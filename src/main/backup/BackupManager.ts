import { createWriteStream, createReadStream, existsSync, readFileSync, writeFileSync, statSync } from "fs";
import { join as joinPath, dirname, basename } from "path";
import { remove, ensureDir, copy } from "fs-extra";
import * as Archiver from "archiver";
import * as StreamZip from "node-stream-zip";
import { createHash } from "crypto";
import Config from "../utils/Config";
import { CrossPlatformPathResolver } from "../utils/CrossPlatformPathResolver";

/**
 * Metadata for backup operations
 */
export interface BackupMetadata {
    id: string;
    name: string;
    installPath: string;
    backupPath: string;
    createdAt: Date;
    type: 'automatic' | 'manual' | 'incremental';
    size: number;
    checksum: string;
    description?: string;
    modInfo?: {
        name: string;
        version: string;
        renpyVersion?: string;
    };
    originalFiles: BackupFileInfo[];
}

/**
 * Information about individual files in backup
 */
export interface BackupFileInfo {
    relativePath: string;
    size: number;
    checksum: string;
    modifiedAt: Date;
}

/**
 * Backup validation result
 */
export interface BackupValidation {
    isValid: boolean;
    issues: string[];
    corruptedFiles: string[];
    missingFiles: string[];
}

/**
 * Advanced backup manager with rollback capabilities and integrity checking
 */
export class AdvancedBackupManager {
    private static readonly BACKUP_METADATA_FILE = "backup-metadata.json";
    private static readonly MAX_AUTOMATIC_BACKUPS = 10;
    private static readonly MAX_BACKUP_AGE_DAYS = 30;

    /**
     * Creates an automatic backup before mod operations
     */
    public static async createAutomaticBackup(installPath: string, description?: string): Promise<BackupMetadata> {
        const backupId = this.generateBackupId();
        const backupName = `auto-backup-${new Date().toISOString().split('T')[0]}-${backupId}`;
        
        return this.createBackup(installPath, backupName, 'automatic', description);
    }

    /**
     * Creates a manual backup initiated by the user
     */
    public static async createManualBackup(installPath: string, name: string, description?: string): Promise<BackupMetadata> {
        const backupId = this.generateBackupId();
        const backupName = `${name}-${backupId}`;
        
        return this.createBackup(installPath, backupName, 'manual', description);
    }

    /**
     * Creates an incremental backup based on a previous backup
     */
    public static async createIncrementalBackup(installPath: string, baseBackupId: string): Promise<BackupMetadata> {
        const baseBackup = await this.getBackupMetadata(baseBackupId);
        if (!baseBackup) {
            throw new Error(`Base backup ${baseBackupId} not found`);
        }

        const backupId = this.generateBackupId();
        const backupName = `incremental-${baseBackupId}-${backupId}`;
        
        // Identify changed files since base backup
        const changedFiles = await this.getChangedFiles(installPath, baseBackup);
        
        if (changedFiles.length === 0) {
            throw new Error("No changes detected since base backup");
        }

        return this.createPartialBackup(installPath, backupName, 'incremental', changedFiles, `Incremental backup based on ${baseBackup.name}`);
    }

    /**
     * Restores an installation from a backup
     */
    public static async restoreFromBackup(backupId: string, targetPath?: string): Promise<void> {
        const metadata = await this.getBackupMetadata(backupId);
        if (!metadata) {
            throw new Error(`Backup ${backupId} not found`);
        }

        const restorePath = targetPath || metadata.installPath;
        
        // Validate backup before restoration
        const validation = await this.validateBackup(backupId);
        if (!validation.isValid) {
            throw new Error(`Backup validation failed: ${validation.issues.join(', ')}`);
        }

        // Create a safety backup before restoration
        if (existsSync(restorePath)) {
            await this.createAutomaticBackup(restorePath, `Safety backup before restoring ${metadata.name}`);
        }

        // Restore the backup
        await this.extractBackup(metadata.backupPath, restorePath);
        
        console.log(`Successfully restored backup ${metadata.name} to ${restorePath}`);
    }

    /**
     * Validates a backup's integrity
     */
    public static async validateBackup(backupId: string): Promise<BackupValidation> {
        const metadata = await this.getBackupMetadata(backupId);
        if (!metadata) {
            return {
                isValid: false,
                issues: [`Backup metadata not found for ${backupId}`],
                corruptedFiles: [],
                missingFiles: []
            };
        }

        const validation: BackupValidation = {
            isValid: true,
            issues: [],
            corruptedFiles: [],
            missingFiles: []
        };

        // Check if backup file exists
        if (!existsSync(metadata.backupPath)) {
            validation.isValid = false;
            validation.missingFiles.push(metadata.backupPath);
            validation.issues.push("Backup file not found");
            return validation;
        }

        // Verify backup file checksum
        try {
            const currentChecksum = await this.calculateFileChecksum(metadata.backupPath);
            if (currentChecksum !== metadata.checksum) {
                validation.isValid = false;
                validation.corruptedFiles.push(metadata.backupPath);
                validation.issues.push("Backup file checksum mismatch");
            }
        } catch (error) {
            validation.isValid = false;
            validation.issues.push(`Error calculating checksum: ${error.message}`);
        }

        // Validate backup contents if it's a zip file
        if (metadata.backupPath.endsWith('.zip')) {
            try {
                await this.validateZipContents(metadata);
            } catch (error) {
                validation.isValid = false;
                validation.issues.push(`Zip validation failed: ${error.message}`);
            }
        }

        return validation;
    }

    /**
     * Lists all available backups
     */
    public static async listBackups(installPath?: string): Promise<BackupMetadata[]> {
        const metadataPath = this.getBackupMetadataPath();
        if (!existsSync(metadataPath)) {
            return [];
        }

        try {
            const allMetadata: BackupMetadata[] = JSON.parse(readFileSync(metadataPath, 'utf8'));
            
            if (installPath) {
                return allMetadata.filter(backup => backup.installPath === installPath);
            }
            
            return allMetadata;
        } catch (error) {
            console.error("Error reading backup metadata:", error);
            return [];
        }
    }

    /**
     * Deletes a backup
     */
    public static async deleteBackup(backupId: string): Promise<void> {
        const metadata = await this.getBackupMetadata(backupId);
        if (!metadata) {
            throw new Error(`Backup ${backupId} not found`);
        }

        // Delete backup file
        if (existsSync(metadata.backupPath)) {
            await remove(metadata.backupPath);
        }

        // Remove from metadata
        await this.removeBackupMetadata(backupId);
        
        console.log(`Deleted backup ${metadata.name}`);
    }

    /**
     * Cleanup old automatic backups based on policies
     */
    public static async cleanupOldBackups(): Promise<void> {
        const allBackups = await this.listBackups();
        const automaticBackups = allBackups.filter(b => b.type === 'automatic');
        
        // Sort by creation date (newest first)
        automaticBackups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const now = new Date();
        const maxAge = this.MAX_BACKUP_AGE_DAYS * 24 * 60 * 60 * 1000; // Convert to milliseconds
        
        for (let i = 0; i < automaticBackups.length; i++) {
            const backup = automaticBackups[i];
            const age = now.getTime() - new Date(backup.createdAt).getTime();
            
            // Delete if beyond max count or max age
            if (i >= this.MAX_AUTOMATIC_BACKUPS || age > maxAge) {
                try {
                    await this.deleteBackup(backup.id);
                    console.log(`Cleaned up old backup: ${backup.name}`);
                } catch (error) {
                    console.warn(`Failed to cleanup backup ${backup.name}:`, error);
                }
            }
        }
    }

    private static async createBackup(installPath: string, backupName: string, type: BackupMetadata['type'], description?: string): Promise<BackupMetadata> {
        if (!existsSync(installPath)) {
            throw new Error(`Install path does not exist: ${installPath}`);
        }

        const backupId = this.generateBackupId();
        const backupPath = CrossPlatformPathResolver.resolveBackupPath(installPath, `${backupName}.zip`);
        
        // Ensure backup directory exists
        await ensureDir(dirname(backupPath));
        
        // Create backup
        await this.createZipBackup(installPath, backupPath);
        
        // Calculate checksum and collect file info
        const checksum = await this.calculateFileChecksum(backupPath);
        const originalFiles = await this.collectFileInfo(installPath);
        const size = statSync(backupPath).size;
        
        // Create metadata
        const metadata: BackupMetadata = {
            id: backupId,
            name: backupName,
            installPath,
            backupPath,
            createdAt: new Date(),
            type,
            size,
            checksum,
            description,
            originalFiles
        };

        // Save metadata
        await this.saveBackupMetadata(metadata);
        
        console.log(`Created ${type} backup: ${backupName} (${this.formatSize(size)})`);
        return metadata;
    }

    private static async createPartialBackup(installPath: string, backupName: string, type: BackupMetadata['type'], files: string[], description?: string): Promise<BackupMetadata> {
        const backupId = this.generateBackupId();
        const backupPath = CrossPlatformPathResolver.resolveBackupPath(installPath, `${backupName}.zip`);
        
        // Ensure backup directory exists
        await ensureDir(dirname(backupPath));
        
        // Create selective backup
        await this.createSelectiveZipBackup(installPath, backupPath, files);
        
        // Calculate checksum and collect file info
        const checksum = await this.calculateFileChecksum(backupPath);
        const originalFiles = await this.collectSelectiveFileInfo(installPath, files);
        const size = statSync(backupPath).size;
        
        // Create metadata
        const metadata: BackupMetadata = {
            id: backupId,
            name: backupName,
            installPath,
            backupPath,
            createdAt: new Date(),
            type,
            size,
            checksum,
            description,
            originalFiles
        };

        // Save metadata
        await this.saveBackupMetadata(metadata);
        
        console.log(`Created ${type} backup: ${backupName} (${files.length} files, ${this.formatSize(size)})`);
        return metadata;
    }

    private static async createZipBackup(sourcePath: string, backupPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const output = createWriteStream(backupPath);
            const archive = Archiver("zip", { zlib: { level: 9 } });
            
            output.on("close", () => resolve());
            archive.on("error", err => reject(err));
            
            archive.pipe(output);
            archive.directory(sourcePath, false);
            archive.finalize();
        });
    }

    private static async createSelectiveZipBackup(sourcePath: string, backupPath: string, files: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const output = createWriteStream(backupPath);
            const archive = Archiver("zip", { zlib: { level: 9 } });
            
            output.on("close", () => resolve());
            archive.on("error", err => reject(err));
            
            archive.pipe(output);
            
            for (const file of files) {
                const fullPath = joinPath(sourcePath, file);
                if (existsSync(fullPath)) {
                    const stats = statSync(fullPath);
                    if (stats.isFile()) {
                        archive.file(fullPath, { name: file });
                    } else if (stats.isDirectory()) {
                        archive.directory(fullPath, file);
                    }
                }
            }
            
            archive.finalize();
        });
    }

    private static async extractBackup(backupPath: string, targetPath: string): Promise<void> {
        // Remove existing directory
        if (existsSync(targetPath)) {
            await remove(targetPath);
        }
        
        await ensureDir(targetPath);
        
        const zip = new StreamZip.async({ file: backupPath });
        await zip.extract(null, targetPath);
        await zip.close();
    }

    private static async calculateFileChecksum(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = createHash('sha256');
            const stream = createReadStream(filePath);
            
            stream.on('data', data => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', err => reject(err));
        });
    }

    private static async collectFileInfo(dirPath: string): Promise<BackupFileInfo[]> {
        const files: BackupFileInfo[] = [];
        const fs = require('fs');
        const path = require('path');
        
        function walkDir(currentPath: string) {
            const entries = fs.readdirSync(currentPath);
            
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry);
                const stats = fs.statSync(fullPath);
                
                if (stats.isFile()) {
                    const relativePath = path.relative(dirPath, fullPath);
                    files.push({
                        relativePath,
                        size: stats.size,
                        checksum: '', // Would be expensive to calculate for all files
                        modifiedAt: stats.mtime
                    });
                } else if (stats.isDirectory()) {
                    walkDir(fullPath);
                }
            }
        }
        
        walkDir(dirPath);
        return files;
    }

    private static async collectSelectiveFileInfo(dirPath: string, files: string[]): Promise<BackupFileInfo[]> {
        const fileInfo: BackupFileInfo[] = [];
        
        for (const file of files) {
            const fullPath = joinPath(dirPath, file);
            if (existsSync(fullPath)) {
                const stats = statSync(fullPath);
                if (stats.isFile()) {
                    fileInfo.push({
                        relativePath: file,
                        size: stats.size,
                        checksum: '',
                        modifiedAt: stats.mtime
                    });
                }
            }
        }
        
        return fileInfo;
    }

    private static async getChangedFiles(installPath: string, baseBackup: BackupMetadata): Promise<string[]> {
        const currentFiles = await this.collectFileInfo(installPath);
        const changedFiles: string[] = [];
        
        for (const currentFile of currentFiles) {
            const baseFile = baseBackup.originalFiles.find(f => f.relativePath === currentFile.relativePath);
            
            if (!baseFile) {
                // New file
                changedFiles.push(currentFile.relativePath);
            } else if (currentFile.modifiedAt > baseFile.modifiedAt || currentFile.size !== baseFile.size) {
                // Modified file
                changedFiles.push(currentFile.relativePath);
            }
        }
        
        return changedFiles;
    }

    private static async validateZipContents(metadata: BackupMetadata): Promise<void> {
        const zip = new StreamZip.async({ file: metadata.backupPath });
        const entries = await zip.entries();
        
        // Check if expected files are present
        for (const expectedFile of metadata.originalFiles) {
            if (!entries[expectedFile.relativePath]) {
                throw new Error(`Expected file missing from backup: ${expectedFile.relativePath}`);
            }
        }
        
        await zip.close();
    }

    private static getBackupMetadataPath(): string {
        return joinPath(Config.readConfigValue("installFolder"), this.BACKUP_METADATA_FILE);
    }

    private static async getBackupMetadata(backupId: string): Promise<BackupMetadata | null> {
        const allBackups = await this.listBackups();
        return allBackups.find(backup => backup.id === backupId) || null;
    }

    private static async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
        const metadataPath = this.getBackupMetadataPath();
        let allMetadata: BackupMetadata[] = [];
        
        if (existsSync(metadataPath)) {
            try {
                allMetadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
            } catch (error) {
                console.warn("Error reading existing metadata, creating new:", error);
            }
        }
        
        // Remove existing metadata with same ID (for updates)
        allMetadata = allMetadata.filter(m => m.id !== metadata.id);
        allMetadata.push(metadata);
        
        // Ensure metadata directory exists
        await ensureDir(dirname(metadataPath));
        writeFileSync(metadataPath, JSON.stringify(allMetadata, null, 2));
    }

    private static async removeBackupMetadata(backupId: string): Promise<void> {
        const metadataPath = this.getBackupMetadataPath();
        if (!existsSync(metadataPath)) {
            return;
        }
        
        try {
            let allMetadata: BackupMetadata[] = JSON.parse(readFileSync(metadataPath, 'utf8'));
            allMetadata = allMetadata.filter(m => m.id !== backupId);
            writeFileSync(metadataPath, JSON.stringify(allMetadata, null, 2));
        } catch (error) {
            console.error("Error removing backup metadata:", error);
        }
    }

    private static generateBackupId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    private static formatSize(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
}