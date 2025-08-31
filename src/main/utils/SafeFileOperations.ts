import {
    promises as fs,
    createReadStream,
    createWriteStream,
    existsSync,
    statSync,
    mkdirSync,
    renameSync,
    unlinkSync,
    copyFileSync,
    constants
} from "fs";
import { join as joinPath, dirname, resolve, normalize, basename } from "path";
import { randomBytes, createHash } from "crypto";
import { InputValidator, ValidationResult } from "./InputValidator";
import { EnhancedLogger } from "./EnhancedLogger";

/**
 * Transaction interface for atomic operations
 */
interface FileTransaction {
    id: string;
    operations: FileOperation[];
    rollbackOperations: FileOperation[];
    completed: boolean;
    startTime: number;
}

/**
 * File operation interface
 */
interface FileOperation {
    type: 'create' | 'update' | 'delete' | 'move' | 'copy';
    source?: string;
    target: string;
    backup?: string;
    completed: boolean;
    checksum?: string;
}

/**
 * Safe file operation options
 */
interface SafeOperationOptions {
    createBackup?: boolean;
    validateChecksums?: boolean;
    atomicOperation?: boolean;
    overwriteExisting?: boolean;
    validatePath?: boolean;
    maxFileSize?: number;
    allowedExtensions?: string[];
}

/**
 * Comprehensive safe file operations utility with atomic transactions,
 * path validation, backup support, and comprehensive error handling
 */
export class SafeFileOperations {
    private static readonly logger = EnhancedLogger.getInstance();
    private static readonly activeTransactions = new Map<string, FileTransaction>();
    private static readonly TEMP_SUFFIX = '.tmp';
    private static readonly BACKUP_SUFFIX = '.backup';
    private static readonly MAX_TRANSACTION_AGE = 30 * 60 * 1000; // 30 minutes

    /**
     * Safely writes content to a file with atomic operation support
     */
    public static async writeFile(
        filePath: string,
        content: string | Buffer,
        options: SafeOperationOptions = {}
    ): Promise<void> {
        const operation: FileOperation = {
            type: 'create',
            target: filePath,
            completed: false
        };

        try {
            // Validate the file path
            if (options.validatePath !== false) {
                const validation = this.validateFilePath(filePath, options);
                if (!validation.isValid) {
                    throw new Error(`Path validation failed: ${validation.errors.join(', ')}`);
                }
                filePath = validation.sanitized!;
                operation.target = filePath;
            }

            // Ensure directory exists
            const dir = dirname(filePath);
            await this.ensureDirectoryExists(dir);

            // Create backup if file exists and backup is requested
            if (options.createBackup && existsSync(filePath)) {
                const backupPath = `${filePath}${this.BACKUP_SUFFIX}`;
                operation.backup = backupPath;
                await fs.copyFile(filePath, backupPath);
                this.logger.debug('SafeFileOperations', `Created backup: ${backupPath}`);
            }

            if (options.atomicOperation !== false) {
                // Atomic write using temporary file
                await this.atomicWrite(filePath, content, operation);
            } else {
                // Direct write
                await fs.writeFile(filePath, content);
            }

            // Calculate and store checksum if requested
            if (options.validateChecksums) {
                operation.checksum = await this.calculateFileChecksum(filePath);
            }

            operation.completed = true;
            this.logger.debug('SafeFileOperations', `File written successfully: ${filePath}`);

        } catch (error) {
            this.logger.error('SafeFileOperations', `Failed to write file ${filePath}:`, error);
            
            // Rollback if backup exists
            if (operation.backup && existsSync(operation.backup)) {
                try {
                    await fs.copyFile(operation.backup, filePath);
                    await fs.unlink(operation.backup);
                    this.logger.debug('SafeFileOperations', `Restored from backup: ${operation.backup}`);
                } catch (rollbackError) {
                    this.logger.error('SafeFileOperations', `Failed to rollback from backup:`, rollbackError);
                }
            }
            
            throw error;
        }
    }

    /**
     * Safely reads a file with validation
     */
    public static async readFile(
        filePath: string,
        options: SafeOperationOptions = {}
    ): Promise<Buffer> {
        try {
            // Validate the file path
            if (options.validatePath !== false) {
                const validation = this.validateFilePath(filePath, {
                    ...options,
                    requireExists: true
                });
                if (!validation.isValid) {
                    throw new Error(`Path validation failed: ${validation.errors.join(', ')}`);
                }
                filePath = validation.sanitized!;
            }

            // Check file size if limit specified
            if (options.maxFileSize) {
                const stats = await fs.stat(filePath);
                if (stats.size > options.maxFileSize) {
                    throw new Error(`File too large: ${stats.size} bytes (max: ${options.maxFileSize})`);
                }
            }

            const content = await fs.readFile(filePath);
            this.logger.debug('SafeFileOperations', `File read successfully: ${filePath}`);
            return content;

        } catch (error) {
            this.logger.error('SafeFileOperations', `Failed to read file ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Safely copies a file with validation and backup support
     */
    public static async copyFile(
        sourcePath: string,
        targetPath: string,
        options: SafeOperationOptions = {}
    ): Promise<void> {
        const operation: FileOperation = {
            type: 'copy',
            source: sourcePath,
            target: targetPath,
            completed: false
        };

        try {
            // Validate both paths
            if (options.validatePath !== false) {
                const sourceValidation = this.validateFilePath(sourcePath, {
                    ...options,
                    requireExists: true
                });
                const targetValidation = this.validateFilePath(targetPath, options);

                if (!sourceValidation.isValid || !targetValidation.isValid) {
                    const errors = [...sourceValidation.errors, ...targetValidation.errors];
                    throw new Error(`Path validation failed: ${errors.join(', ')}`);
                }

                sourcePath = sourceValidation.sanitized!;
                targetPath = targetValidation.sanitized!;
                operation.source = sourcePath;
                operation.target = targetPath;
            }

            // Ensure target directory exists
            await this.ensureDirectoryExists(dirname(targetPath));

            // Create backup if target exists and backup is requested
            if (options.createBackup && existsSync(targetPath)) {
                const backupPath = `${targetPath}${this.BACKUP_SUFFIX}`;
                operation.backup = backupPath;
                await fs.copyFile(targetPath, backupPath);
            }

            // Perform the copy operation
            if (options.atomicOperation !== false) {
                const tempPath = `${targetPath}${this.TEMP_SUFFIX}`;
                await fs.copyFile(sourcePath, tempPath);
                await fs.rename(tempPath, targetPath);
            } else {
                await fs.copyFile(sourcePath, targetPath);
            }

            // Verify copy with checksum if requested
            if (options.validateChecksums) {
                const sourceChecksum = await this.calculateFileChecksum(sourcePath);
                const targetChecksum = await this.calculateFileChecksum(targetPath);
                
                if (sourceChecksum !== targetChecksum) {
                    throw new Error('File copy verification failed: checksums do not match');
                }
                
                operation.checksum = targetChecksum;
            }

            operation.completed = true;
            this.logger.debug('SafeFileOperations', `File copied successfully: ${sourcePath} -> ${targetPath}`);

        } catch (error) {
            this.logger.error('SafeFileOperations', `Failed to copy file ${sourcePath} -> ${targetPath}:`, error);
            
            // Rollback if backup exists
            if (operation.backup && existsSync(operation.backup)) {
                try {
                    await fs.copyFile(operation.backup, targetPath);
                    await fs.unlink(operation.backup);
                } catch (rollbackError) {
                    this.logger.error('SafeFileOperations', `Failed to rollback from backup:`, rollbackError);
                }
            }
            
            throw error;
        }
    }

    /**
     * Safely deletes a file with backup support
     */
    public static async deleteFile(
        filePath: string,
        options: SafeOperationOptions = {}
    ): Promise<void> {
        const operation: FileOperation = {
            type: 'delete',
            target: filePath,
            completed: false
        };

        try {
            // Validate the file path
            if (options.validatePath !== false) {
                const validation = this.validateFilePath(filePath, {
                    ...options,
                    requireExists: true
                });
                if (!validation.isValid) {
                    throw new Error(`Path validation failed: ${validation.errors.join(', ')}`);
                }
                filePath = validation.sanitized!;
                operation.target = filePath;
            }

            // Create backup if requested
            if (options.createBackup) {
                const backupPath = `${filePath}${this.BACKUP_SUFFIX}`;
                operation.backup = backupPath;
                await fs.copyFile(filePath, backupPath);
            }

            // Delete the file
            await fs.unlink(filePath);
            operation.completed = true;
            this.logger.debug('SafeFileOperations', `File deleted successfully: ${filePath}`);

        } catch (error) {
            this.logger.error('SafeFileOperations', `Failed to delete file ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Safely moves/renames a file
     */
    public static async moveFile(
        sourcePath: string,
        targetPath: string,
        options: SafeOperationOptions = {}
    ): Promise<void> {
        const operation: FileOperation = {
            type: 'move',
            source: sourcePath,
            target: targetPath,
            completed: false
        };

        try {
            // Validate both paths
            if (options.validatePath !== false) {
                const sourceValidation = this.validateFilePath(sourcePath, {
                    ...options,
                    requireExists: true
                });
                const targetValidation = this.validateFilePath(targetPath, options);

                if (!sourceValidation.isValid || !targetValidation.isValid) {
                    const errors = [...sourceValidation.errors, ...targetValidation.errors];
                    throw new Error(`Path validation failed: ${errors.join(', ')}`);
                }

                sourcePath = sourceValidation.sanitized!;
                targetPath = targetValidation.sanitized!;
                operation.source = sourcePath;
                operation.target = targetPath;
            }

            // Ensure target directory exists
            await this.ensureDirectoryExists(dirname(targetPath));

            // Create backup if target exists
            if (options.createBackup && existsSync(targetPath)) {
                const backupPath = `${targetPath}${this.BACKUP_SUFFIX}`;
                operation.backup = backupPath;
                await fs.copyFile(targetPath, backupPath);
            }

            // Move the file
            await fs.rename(sourcePath, targetPath);
            operation.completed = true;
            this.logger.debug('SafeFileOperations', `File moved successfully: ${sourcePath} -> ${targetPath}`);

        } catch (error) {
            this.logger.error('SafeFileOperations', `Failed to move file ${sourcePath} -> ${targetPath}:`, error);
            
            // Rollback if backup exists
            if (operation.backup && existsSync(operation.backup)) {
                try {
                    await fs.copyFile(operation.backup, targetPath);
                    await fs.unlink(operation.backup);
                } catch (rollbackError) {
                    this.logger.error('SafeFileOperations', `Failed to rollback from backup:`, rollbackError);
                }
            }
            
            throw error;
        }
    }

    /**
     * Safely creates a directory with proper error handling
     */
    public static async ensureDirectoryExists(dirPath: string, mode: number = 0o755): Promise<void> {
        try {
            // Validate directory path
            const validation = InputValidator.validateDirectoryPath(dirPath, {
                allowRelative: false,
                maxLength: 260
            });

            if (!validation.isValid) {
                throw new Error(`Directory path validation failed: ${validation.errors.join(', ')}`);
            }

            const sanitizedPath = validation.sanitized!;
            
            // Check if directory already exists
            try {
                const stats = await fs.stat(sanitizedPath);
                if (stats.isDirectory()) {
                    return; // Directory already exists
                } else {
                    throw new Error(`Path exists but is not a directory: ${sanitizedPath}`);
                }
            } catch (error: any) {
                if (error.code !== 'ENOENT') {
                    throw error; // Re-throw non-ENOENT errors
                }
            }

            // Create directory recursively
            await fs.mkdir(sanitizedPath, { recursive: true, mode });
            this.logger.debug('SafeFileOperations', `Directory created: ${sanitizedPath}`);

        } catch (error) {
            this.logger.error('SafeFileOperations', `Failed to create directory ${dirPath}:`, error);
            throw error;
        }
    }

    /**
     * Starts a file transaction for atomic operations
     */
    public static startTransaction(): string {
        const transactionId = randomBytes(8).toString('hex');
        const transaction: FileTransaction = {
            id: transactionId,
            operations: [],
            rollbackOperations: [],
            completed: false,
            startTime: Date.now()
        };

        this.activeTransactions.set(transactionId, transaction);
        this.logger.debug('SafeFileOperations', `Started transaction: ${transactionId}`);
        return transactionId;
    }

    /**
     * Commits a transaction
     */
    public static async commitTransaction(transactionId: string): Promise<void> {
        const transaction = this.activeTransactions.get(transactionId);
        if (!transaction) {
            throw new Error(`Transaction not found: ${transactionId}`);
        }

        try {
            // Mark transaction as completed
            transaction.completed = true;
            
            // Clean up any backup files created during the transaction
            for (const operation of transaction.operations) {
                if (operation.backup && existsSync(operation.backup)) {
                    await fs.unlink(operation.backup);
                }
            }

            this.activeTransactions.delete(transactionId);
            this.logger.debug('SafeFileOperations', `Transaction committed: ${transactionId}`);

        } catch (error) {
            this.logger.error('SafeFileOperations', `Failed to commit transaction ${transactionId}:`, error);
            throw error;
        }
    }

    /**
     * Rolls back a transaction
     */
    public static async rollbackTransaction(transactionId: string): Promise<void> {
        const transaction = this.activeTransactions.get(transactionId);
        if (!transaction) {
            throw new Error(`Transaction not found: ${transactionId}`);
        }

        try {
            // Execute rollback operations in reverse order
            for (let i = transaction.rollbackOperations.length - 1; i >= 0; i--) {
                const rollbackOp = transaction.rollbackOperations[i];
                
                try {
                    switch (rollbackOp.type) {
                        case 'delete':
                            if (rollbackOp.source && existsSync(rollbackOp.source)) {
                                await fs.unlink(rollbackOp.target);
                            }
                            break;
                        case 'create':
                        case 'update':
                            if (rollbackOp.backup && existsSync(rollbackOp.backup)) {
                                await fs.copyFile(rollbackOp.backup, rollbackOp.target);
                                await fs.unlink(rollbackOp.backup);
                            } else if (existsSync(rollbackOp.target)) {
                                await fs.unlink(rollbackOp.target);
                            }
                            break;
                        case 'move':
                            if (rollbackOp.source && existsSync(rollbackOp.target)) {
                                await fs.rename(rollbackOp.target, rollbackOp.source);
                            }
                            break;
                    }
                } catch (rollbackError) {
                    this.logger.error('SafeFileOperations', `Failed to rollback operation:`, rollbackError);
                    // Continue with other rollback operations
                }
            }

            this.activeTransactions.delete(transactionId);
            this.logger.debug('SafeFileOperations', `Transaction rolled back: ${transactionId}`);

        } catch (error) {
            this.logger.error('SafeFileOperations', `Failed to rollback transaction ${transactionId}:`, error);
            throw error;
        }
    }

    /**
     * Cleans up old transactions
     */
    public static cleanupOldTransactions(): void {
        const now = Date.now();
        for (const [id, transaction] of this.activeTransactions.entries()) {
            if (now - transaction.startTime > this.MAX_TRANSACTION_AGE) {
                this.logger.warn('SafeFileOperations', `Cleaning up old transaction: ${id}`);
                this.rollbackTransaction(id).catch(error => {
                    this.logger.error('SafeFileOperations', `Failed to cleanup old transaction ${id}:`, error);
                });
            }
        }
    }

    /**
     * Performs atomic write operation using temporary file
     */
    private static async atomicWrite(
        filePath: string,
        content: string | Buffer,
        operation: FileOperation
    ): Promise<void> {
        const tempPath = `${filePath}${this.TEMP_SUFFIX}`;
        
        try {
            // Write to temporary file
            await fs.writeFile(tempPath, content);
            
            // Atomically rename temporary file to target
            await fs.rename(tempPath, filePath);
            
        } catch (error) {
            // Clean up temporary file if it exists
            try {
                if (existsSync(tempPath)) {
                    await fs.unlink(tempPath);
                }
            } catch (cleanupError) {
                this.logger.error('SafeFileOperations', `Failed to cleanup temporary file ${tempPath}:`, cleanupError);
            }
            throw error;
        }
    }

    /**
     * Calculates SHA-256 checksum of a file
     */
    private static async calculateFileChecksum(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = createHash('sha256');
            const stream = createReadStream(filePath);
            
            stream.on('data', chunk => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }

    /**
     * Validates file path using InputValidator
     */
    private static validateFilePath(
        filePath: string,
        options: SafeOperationOptions & { requireExists?: boolean } = {}
    ): ValidationResult {
        return InputValidator.validateFilePath(filePath, {
            allowedExtensions: options.allowedExtensions,
            maxFileSize: options.maxFileSize,
            requireExists: options.requireExists,
            allowSymlinks: false,
            allowExecutables: false
        });
    }

    /**
     * Checks if a file operation is safe to perform
     */
    public static async isOperationSafe(
        operation: 'read' | 'write' | 'delete' | 'move' | 'copy',
        filePath: string,
        targetPath?: string
    ): Promise<{ safe: boolean; reasons: string[] }> {
        const reasons: string[] = [];
        let safe = true;

        try {
            // Validate source path
            const sourceValidation = this.validateFilePath(filePath, {
                requireExists: operation !== 'write'
            });
            
            if (!sourceValidation.isValid) {
                safe = false;
                reasons.push(...sourceValidation.errors);
            }

            // Validate target path if provided
            if (targetPath) {
                const targetValidation = this.validateFilePath(targetPath);
                if (!targetValidation.isValid) {
                    safe = false;
                    reasons.push(...targetValidation.errors);
                }
            }

            // Check for sufficient disk space (simplified check)
            if (operation === 'write' || operation === 'copy') {
                try {
                    const stats = await fs.stat(dirname(targetPath || filePath));
                    // Basic disk space check could be implemented here
                } catch (error) {
                    reasons.push('Unable to verify disk space');
                }
            }

        } catch (error) {
            safe = false;
            reasons.push(`Operation safety check failed: ${error.message}`);
        }

        return { safe, reasons };
    }

    /**
     * Creates a secure temporary directory
     */
    public static async createTempDirectory(prefix: string = 'ddmm-temp'): Promise<string> {
        const tempDir = await fs.mkdtemp(joinPath(require('os').tmpdir(), `${prefix}-`));
        this.logger.debug('SafeFileOperations', `Created temporary directory: ${tempDir}`);
        return tempDir;
    }

    /**
     * Safely removes a directory and all its contents
     */
    public static async removeDirectory(dirPath: string, options: SafeOperationOptions = {}): Promise<void> {
        try {
            // Validate directory path
            if (options.validatePath !== false) {
                const validation = InputValidator.validateDirectoryPath(dirPath, {
                    mustExist: true
                });
                if (!validation.isValid) {
                    throw new Error(`Directory path validation failed: ${validation.errors.join(', ')}`);
                }
                dirPath = validation.sanitized!;
            }

            // Create backup if requested
            if (options.createBackup) {
                const backupPath = `${dirPath}${this.BACKUP_SUFFIX}`;
                await this.copyDirectory(dirPath, backupPath);
            }

            // Remove directory recursively
            await fs.rm(dirPath, { recursive: true, force: true });
            this.logger.debug('SafeFileOperations', `Directory removed: ${dirPath}`);

        } catch (error) {
            this.logger.error('SafeFileOperations', `Failed to remove directory ${dirPath}:`, error);
            throw error;
        }
    }

    /**
     * Safely copies a directory recursively
     */
    public static async copyDirectory(sourcePath: string, targetPath: string): Promise<void> {
        await this.ensureDirectoryExists(targetPath);
        
        const entries = await fs.readdir(sourcePath, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = joinPath(sourcePath, entry.name);
            const tgtPath = joinPath(targetPath, entry.name);
            
            if (entry.isDirectory()) {
                await this.copyDirectory(srcPath, tgtPath);
            } else {
                await this.copyFile(srcPath, tgtPath, { validatePath: false });
            }
        }
    }
}