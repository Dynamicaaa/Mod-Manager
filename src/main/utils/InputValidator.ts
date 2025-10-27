import { join as joinPath, resolve, normalize, isAbsolute, extname, basename, dirname } from "path";
import { existsSync, statSync, constants, accessSync } from "fs";
import { homedir } from "os";

/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    sanitized?: any;
}

/**
 * File validation options
 */
export interface FileValidationOptions {
    allowedExtensions?: string[];
    maxFileSize?: number; // in bytes
    requireExists?: boolean;
    allowSymlinks?: boolean;
    allowExecutables?: boolean;
    restrictToBasePath?: string;
}

/**
 * Path validation options
 */
export interface PathValidationOptions {
    mustExist?: boolean;
    mustBeWritable?: boolean;
    mustBeReadable?: boolean;
    allowRelative?: boolean;
    restrictToBasePath?: string;
    maxLength?: number;
    allowedCharacters?: RegExp;
}

/**
 * String validation options
 */
export interface StringValidationOptions {
    minLength?: number;
    maxLength?: number;
    allowedCharacters?: RegExp;
    forbiddenPatterns?: RegExp[];
    trimWhitespace?: boolean;
    normalizeSpaces?: boolean;
}

/**
 * Comprehensive input validation utility for the DDLC Mod Manager
 * Provides security-focused validation for file paths, user inputs, and mod data
 */
export class InputValidator {
    
    // Common dangerous patterns to check for
    private static readonly DANGEROUS_PATTERNS = [
        /\.\./,                    // Directory traversal
        /[<>:"|?*]/,              // Invalid filename characters on Windows (but allow in full paths)
        /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
        /[\x00-\x1f\x7f]/,        // Control characters
        /^\.+$/,                  // Only dots
        /\s+$/,                   // Trailing whitespace
        /^-/,                     // Leading dash (can be problematic)
    ];

    private static readonly EXECUTABLE_EXTENSIONS = [
        '.exe', '.bat', '.cmd', '.com', '.scr', '.pif', '.vbs', '.js', '.jar',
        '.app', '.dmg', '.pkg', '.deb', '.rpm', '.sh', '.py', '.pl', '.rb'
    ];

    private static readonly ARCHIVE_EXTENSIONS = [
        '.zip', '.rar', '.7z', '.tar', '.tar.gz', '.tgz', '.tar.bz2', '.tar.xz'
    ];

    private static readonly MOD_EXTENSIONS = [
        '.rpy', '.rpyc', '.png', '.jpg', '.jpeg', '.gif', '.ogg', '.mp3', '.wav',
        '.webp', '.bmp', '.tiff', '.flac', '.aac', '.opus', '.txt', '.json', '.yml', '.yaml'
    ];

    private static readonly SUSPICIOUS_PATTERNS = [
        /javascript:/i,               // JavaScript URLs
        /data:/i,                    // Data URLs
        /file:/i,                    // File URLs
        /ftp:/i,                     // FTP URLs
        /\$\{.*\}/,                  // Template injection patterns
        /%[0-9a-fA-F]{2}/,          // URL encoding (potential obfuscation)
        /eval\s*\(/i,               // Eval calls
        /exec\s*\(/i,               // Exec calls
        /system\s*\(/i,             // System calls
        /cmd\s*\(/i,                // Command execution
        /shell\s*\(/i,              // Shell execution
        /spawn\s*\(/i,              // Process spawning
    ];

    private static readonly ARCHIVE_BOMB_LIMITS = {
        maxFiles: 10000,            // Maximum number of files in archive
        maxDepth: 50,               // Maximum directory depth
        maxTotalSize: 10 * 1024 * 1024 * 1024, // 10GB total uncompressed size
        compressionRatio: 100       // Maximum compression ratio (suspicious if higher)
    };

    /**
     * Validates a file path for security and correctness
     */
    public static validateFilePath(filePath: string, options: FileValidationOptions = {}): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: normalize(filePath)
        };

        // Basic null/undefined check
        if (!filePath || typeof filePath !== 'string') {
            result.isValid = false;
            result.errors.push('File path is required and must be a string');
            return result;
        }

        // Normalize the path
        const normalizedPath = normalize(filePath);
        result.sanitized = normalizedPath;

        // Check for dangerous patterns
        for (const pattern of this.DANGEROUS_PATTERNS) {
            if (pattern.test(normalizedPath)) {
                // Special case: Allow Windows drive letters (C:, D:, etc.)
                if (pattern.source === '[<>:"|?*]' && /^[A-Za-z]:[\\/]/.test(normalizedPath)) {
                    // This is a Windows drive letter, which is safe
                    continue;
                }
                result.isValid = false;
                result.errors.push(`File path contains dangerous pattern: ${pattern.source}`);
            }
        }

        // Check for directory traversal attempts
        if (normalizedPath.includes('..')) {
            result.isValid = false;
            result.errors.push('Directory traversal patterns are not allowed');
        }

        // Validate path length
        if (normalizedPath.length > 260) { // Windows MAX_PATH limitation
            result.isValid = false;
            result.errors.push('File path is too long (maximum 260 characters)');
        }

        // Check if path is absolute when it shouldn't be
        if (isAbsolute(normalizedPath) && options.restrictToBasePath) {
            result.isValid = false;
            result.errors.push('Absolute paths are not allowed');
        }

        // Validate base path restriction
        if (options.restrictToBasePath) {
            const resolvedPath = resolve(options.restrictToBasePath, normalizedPath);
            const basePath = resolve(options.restrictToBasePath);
            
            if (!resolvedPath.startsWith(basePath)) {
                result.isValid = false;
                result.errors.push('File path must be within the allowed base directory');
            }
        }

        // Check file existence if required
        if (options.requireExists !== false) {
            try {
                if (!existsSync(normalizedPath)) {
                    if (options.requireExists === true) {
                        result.isValid = false;
                        result.errors.push('File does not exist');
                    } else {
                        result.warnings.push('File does not exist');
                    }
                } else {
                    // Additional checks for existing files
                    const stats = statSync(normalizedPath);
                    
                    // Check if it's a symlink
                    if (stats.isSymbolicLink() && !options.allowSymlinks) {
                        result.isValid = false;
                        result.errors.push('Symbolic links are not allowed');
                    }

                    // Check file size
                    if (options.maxFileSize && stats.size > options.maxFileSize) {
                        result.isValid = false;
                        result.errors.push(`File is too large (maximum ${Math.round(options.maxFileSize / 1024 / 1024)}MB)`);
                    }
                }
            } catch (error) {
                result.warnings.push(`Unable to check file existence: ${error.message}`);
            }
        }

        // Validate file extension
        if (options.allowedExtensions) {
            const fileExt = extname(normalizedPath).toLowerCase();
            if (!options.allowedExtensions.includes(fileExt)) {
                result.isValid = false;
                result.errors.push(`File extension '${fileExt}' is not allowed`);
            }
        }

        // Check for executable files
        if (!options.allowExecutables) {
            const fileExt = extname(normalizedPath).toLowerCase();
            if (this.EXECUTABLE_EXTENSIONS.includes(fileExt)) {
                result.isValid = false;
                result.errors.push('Executable files are not allowed');
            }
        }

        return result;
    }

    /**
     * Validates a directory path
     */
    public static validateDirectoryPath(dirPath: string, options: PathValidationOptions = {}): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: normalize(dirPath)
        };

        if (!dirPath || typeof dirPath !== 'string') {
            result.isValid = false;
            result.errors.push('Directory path is required and must be a string');
            return result;
        }

        const normalizedPath = normalize(dirPath);
        result.sanitized = normalizedPath;

        // Check for dangerous patterns
        for (const pattern of this.DANGEROUS_PATTERNS) {
            if (pattern.test(normalizedPath)) {
                // Special case: Allow Windows drive letters (C:, D:, etc.)
                if (pattern.source === '[<>:"|?*]' && /^[A-Za-z]:[\\/]/.test(normalizedPath)) {
                    // This is a Windows drive letter, which is safe
                    continue;
                }
                result.isValid = false;
                result.errors.push(`Directory path contains dangerous pattern: ${pattern.source}`);
            }
        }

        // Check path length
        if (options.maxLength && normalizedPath.length > options.maxLength) {
            result.isValid = false;
            result.errors.push(`Directory path is too long (maximum ${options.maxLength} characters)`);
        }

        // Check allowed characters
        if (options.allowedCharacters && !options.allowedCharacters.test(normalizedPath)) {
            result.isValid = false;
            result.errors.push('Directory path contains invalid characters');
        }

        // Validate relative vs absolute paths
        if (!isAbsolute(normalizedPath) && !options.allowRelative) {
            result.isValid = false;
            result.errors.push('Relative paths are not allowed');
        }

        // Check base path restriction
        if (options.restrictToBasePath) {
            const resolvedPath = resolve(options.restrictToBasePath, normalizedPath);
            const basePath = resolve(options.restrictToBasePath);
            
            if (!resolvedPath.startsWith(basePath)) {
                result.isValid = false;
                result.errors.push('Directory path must be within the allowed base directory');
            }
        }

        // Check existence and permissions
        if (options.mustExist || options.mustBeWritable || options.mustBeReadable) {
            try {
                if (!existsSync(normalizedPath)) {
                    if (options.mustExist) {
                        result.isValid = false;
                        result.errors.push('Directory does not exist');
                    }
                } else {
                    const stats = statSync(normalizedPath);
                    if (!stats.isDirectory()) {
                        result.isValid = false;
                        result.errors.push('Path exists but is not a directory');
                    } else {
                        // Check permissions
                        if (options.mustBeReadable) {
                            try {
                                accessSync(normalizedPath, constants.R_OK);
                            } catch {
                                result.isValid = false;
                                result.errors.push('Directory is not readable');
                            }
                        }

                        if (options.mustBeWritable) {
                            try {
                                accessSync(normalizedPath, constants.W_OK);
                            } catch {
                                result.isValid = false;
                                result.errors.push('Directory is not writable');
                            }
                        }
                    }
                }
            } catch (error) {
                result.warnings.push(`Unable to check directory: ${error.message}`);
            }
        }

        return result;
    }

    /**
     * Validates a string input
     */
    public static validateString(input: string, options: StringValidationOptions = {}): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: input
        };

        if (typeof input !== 'string') {
            result.isValid = false;
            result.errors.push('Input must be a string');
            return result;
        }

        let sanitized = input;

        // Trim whitespace if requested
        if (options.trimWhitespace !== false) {
            sanitized = sanitized.trim();
        }

        // Normalize spaces
        if (options.normalizeSpaces) {
            sanitized = sanitized.replace(/\s+/g, ' ');
        }

        result.sanitized = sanitized;

        // Check length constraints
        if (options.minLength !== undefined && sanitized.length < options.minLength) {
            result.isValid = false;
            result.errors.push(`Input is too short (minimum ${options.minLength} characters)`);
        }

        if (options.maxLength !== undefined && sanitized.length > options.maxLength) {
            result.isValid = false;
            result.errors.push(`Input is too long (maximum ${options.maxLength} characters)`);
        }

        // Check allowed characters
        if (options.allowedCharacters && !options.allowedCharacters.test(sanitized)) {
            result.isValid = false;
            result.errors.push('Input contains invalid characters');
        }

        // Check forbidden patterns
        if (options.forbiddenPatterns) {
            for (const pattern of options.forbiddenPatterns) {
                if (pattern.test(sanitized)) {
                    result.isValid = false;
                    result.errors.push(`Input contains forbidden pattern: ${pattern.source}`);
                }
            }
        }

        return result;
    }

    /**
     * Validates an archive file for mod installation
     */
    public static validateModArchive(filePath: string): ValidationResult {
        return this.validateFilePath(filePath, {
            allowedExtensions: this.ARCHIVE_EXTENSIONS,
            maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
            requireExists: true,
            allowSymlinks: false,
            allowExecutables: false
        });
    }

    /**
     * Validates a mod file
     */
    public static validateModFile(filePath: string, basePath?: string): ValidationResult {
        return this.validateFilePath(filePath, {
            allowedExtensions: [...this.MOD_EXTENSIONS, ...this.ARCHIVE_EXTENSIONS],
            maxFileSize: 100 * 1024 * 1024, // 100MB per file
            requireExists: false,
            allowSymlinks: false,
            allowExecutables: false,
            restrictToBasePath: basePath
        });
    }

    /**
     * Validates an installation name
     */
    public static validateInstallationName(name: string): ValidationResult {
        return this.validateString(name, {
            minLength: 1,
            maxLength: 100,
            allowedCharacters: /^[a-zA-Z0-9\s\-_\.]+$/,
            forbiddenPatterns: [
                /^\./,                    // Starting with dot
                /\.{2,}/,                // Multiple consecutive dots
                /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i // Windows reserved names
            ],
            trimWhitespace: true,
            normalizeSpaces: true
        });
    }

    /**
     * Validates a folder name
     */
    public static validateFolderName(folderName: string): ValidationResult {
        return this.validateString(folderName, {
            minLength: 1,
            maxLength: 50,
            allowedCharacters: /^[a-zA-Z0-9\-_]+$/,
            forbiddenPatterns: [
                /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
                /^-/,                     // Starting with dash
                /^_/,                     // Starting with underscore
                /-$/,                     // Ending with dash
                /_$/                      // Ending with underscore
            ],
            trimWhitespace: true
        });
    }

    /**
     * Validates a URL
     */
    public static validateURL(url: string): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: url
        };

        if (!url || typeof url !== 'string') {
            result.isValid = false;
            result.errors.push('URL is required and must be a string');
            return result;
        }

        try {
            const parsedUrl = new URL(url);
            
            // Only allow HTTP and HTTPS
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                result.isValid = false;
                result.errors.push('Only HTTP and HTTPS URLs are allowed');
            }

            // Check for suspicious patterns
            if (parsedUrl.hostname.includes('localhost') || 
                parsedUrl.hostname.includes('127.0.0.1') || 
                parsedUrl.hostname.includes('0.0.0.0')) {
                result.warnings.push('URL points to localhost');
            }

            result.sanitized = parsedUrl.toString();
        } catch (error) {
            result.isValid = false;
            result.errors.push('Invalid URL format');
        }

        return result;
    }

    /**
     * Validates a JSON configuration object
     */
    public static validateJSONConfig(jsonStr: string, maxSize: number = 1024 * 1024): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: null
        };

        if (!jsonStr || typeof jsonStr !== 'string') {
            result.isValid = false;
            result.errors.push('JSON configuration is required and must be a string');
            return result;
        }

        // Check size limit
        if (jsonStr.length > maxSize) {
            result.isValid = false;
            result.errors.push(`JSON configuration is too large (maximum ${Math.round(maxSize / 1024)}KB)`);
            return result;
        }

        try {
            const parsed = JSON.parse(jsonStr);
            
            // Check for dangerous properties
            if (this.containsDangerousProperties(parsed)) {
                result.isValid = false;
                result.errors.push('JSON configuration contains potentially dangerous properties');
            }

            result.sanitized = parsed;
        } catch (error) {
            result.isValid = false;
            result.errors.push('Invalid JSON format');
        }

        return result;
    }

    /**
     * Checks if an object contains potentially dangerous properties
     */
    private static containsDangerousProperties(obj: any, depth: number = 0): boolean {
        if (depth > 10) return false; // Prevent deep recursion

        const dangerousKeys = [
            '__proto__', 'prototype', 'constructor', 'eval', 'function',
            'require', 'process', 'global', 'window', 'document'
        ];

        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (dangerousKeys.includes(key.toLowerCase())) {
                    return true;
                }
                
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (this.containsDangerousProperties(obj[key], depth + 1)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Sanitizes a filename by removing or replacing invalid characters
     */
    public static sanitizeFilename(filename: string): string {
        if (!filename || typeof filename !== 'string') {
            return 'unnamed_file';
        }

        return filename
            .trim()
            .replace(/[<>:"|?*\x00-\x1f\x7f]/g, '_') // Replace invalid characters with underscore
            .replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, '_$1') // Handle Windows reserved names
            .replace(/^\.+$/, 'dots') // Handle all-dots filenames
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/_+/g, '_') // Replace multiple underscores with single
            .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
            .substring(0, 255); // Limit length
    }

    /**
     * Validates and sanitizes a complete installation configuration
     */
    public static validateInstallationConfig(config: any): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: {}
        };

        if (!config || typeof config !== 'object') {
            result.isValid = false;
            result.errors.push('Installation configuration is required and must be an object');
            return result;
        }

        // Validate installation name
        if (config.installName) {
            const nameValidation = this.validateInstallationName(config.installName);
            if (!nameValidation.isValid) {
                result.isValid = false;
                result.errors.push(...nameValidation.errors.map(e => `Installation name: ${e}`));
            } else {
                result.sanitized.installName = nameValidation.sanitized;
            }
        }

        // Validate folder name
        if (config.folderName) {
            const folderValidation = this.validateFolderName(config.folderName);
            if (!folderValidation.isValid) {
                result.isValid = false;
                result.errors.push(...folderValidation.errors.map(e => `Folder name: ${e}`));
            } else {
                result.sanitized.folderName = folderValidation.sanitized;
            }
        }

        // Validate mod path
        if (config.modPath) {
            const modValidation = this.validateModArchive(config.modPath);
            if (!modValidation.isValid) {
                result.isValid = false;
                result.errors.push(...modValidation.errors.map(e => `Mod path: ${e}`));
            } else {
                result.sanitized.modPath = modValidation.sanitized;
            }
        }

        // Validate boolean options
        ['globalSave', 'createBackup'].forEach(key => {
            if (config[key] !== undefined) {
                if (typeof config[key] !== 'boolean') {
                    result.warnings.push(`${key} should be a boolean, converting from ${typeof config[key]}`);
                    result.sanitized[key] = Boolean(config[key]);
                } else {
                    result.sanitized[key] = config[key];
                }
            }
        });

        return result;
    }

    /**
     * Validates archive contents for potential security threats (zip bombs, etc.)
     */
    public static validateArchiveContents(archivePath: string): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: archivePath
        };

        // This is a placeholder for more advanced archive validation
        // In a full implementation, this would:
        // 1. Check for zip bombs (high compression ratios)
        // 2. Validate file count limits
        // 3. Check directory depth
        // 4. Scan for suspicious file patterns
        
        try {
            const stats = require('fs').statSync(archivePath);
            
            // Basic size check
            if (stats.size > this.ARCHIVE_BOMB_LIMITS.maxTotalSize) {
                result.isValid = false;
                result.errors.push('Archive file is too large and may be malicious');
            }
            
            // Check for suspicious filename patterns
            if (this.containsSuspiciousPatterns(archivePath)) {
                result.warnings.push('Archive path contains patterns that may indicate security risks');
            }
            
        } catch (error) {
            result.warnings.push(`Unable to validate archive: ${error.message}`);
        }

        return result;
    }

    /**
     * Enhanced URL validation with security checks
     */
    public static validateSecureURL(url: string, allowedDomains?: string[]): ValidationResult {
        const result = this.validateURL(url);
        
        if (!result.isValid) {
            return result;
        }

        try {
            const parsedUrl = new URL(url);
            
            // Check for suspicious patterns
            if (this.containsSuspiciousPatterns(url)) {
                result.isValid = false;
                result.errors.push('URL contains suspicious patterns');
                return result;
            }
            
            // Domain whitelist check
            if (allowedDomains && allowedDomains.length > 0) {
                const isAllowed = allowedDomains.some(domain =>
                    parsedUrl.hostname === domain ||
                    parsedUrl.hostname.endsWith('.' + domain)
                );
                
                if (!isAllowed) {
                    result.isValid = false;
                    result.errors.push(`Domain '${parsedUrl.hostname}' is not in the allowed list`);
                    return result;
                }
            }
            
            // Check for suspicious ports
            const suspiciousPorts = [21, 22, 23, 25, 53, 110, 143, 993, 995];
            if (parsedUrl.port && suspiciousPorts.includes(parseInt(parsedUrl.port))) {
                result.warnings.push(`URL uses potentially suspicious port: ${parsedUrl.port}`);
            }
            
        } catch (error) {
            result.isValid = false;
            result.errors.push('URL parsing failed during security validation');
        }

        return result;
    }

    /**
     * Validates file content type against expected types
     */
    public static validateFileType(filePath: string, expectedMimeTypes?: string[]): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: filePath
        };

        if (!expectedMimeTypes || expectedMimeTypes.length === 0) {
            return result; // No specific validation required
        }

        try {
            const mime = require('mime-types');
            const detectedType = mime.lookup(filePath);
            
            if (!detectedType) {
                result.warnings.push('Could not determine file type');
                return result;
            }
            
            if (!expectedMimeTypes.includes(detectedType)) {
                result.isValid = false;
                result.errors.push(`File type '${detectedType}' is not allowed. Expected: ${expectedMimeTypes.join(', ')}`);
            }
            
        } catch (error) {
            result.warnings.push(`File type validation failed: ${error.message}`);
        }

        return result;
    }

    /**
     * Validates that a path doesn't escape a sandbox directory
     */
    public static validateSandboxPath(targetPath: string, sandboxDir: string): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: normalize(targetPath)
        };

        try {
            const path = require('path');
            const resolvedTarget = path.resolve(sandboxDir, targetPath);
            const resolvedSandbox = path.resolve(sandboxDir);
            
            if (!resolvedTarget.startsWith(resolvedSandbox + path.sep) &&
                resolvedTarget !== resolvedSandbox) {
                result.isValid = false;
                result.errors.push('Path attempts to escape sandbox directory');
            }
            
        } catch (error) {
            result.isValid = false;
            result.errors.push(`Sandbox validation failed: ${error.message}`);
        }

        return result;
    }

    /**
     * Checks for suspicious patterns in input
     */
    private static containsSuspiciousPatterns(input: string): boolean {
        return this.SUSPICIOUS_PATTERNS.some(pattern => pattern.test(input));
    }

    /**
     * Rate limiting for validation operations
     */
    private static validationRequestCounts = new Map<string, { count: number, resetTime: number }>();
    
    public static isRateLimited(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
        const now = Date.now();
        const key = identifier;
        
        if (!this.validationRequestCounts.has(key)) {
            this.validationRequestCounts.set(key, { count: 1, resetTime: now + windowMs });
            return false;
        }
        
        const entry = this.validationRequestCounts.get(key)!;
        
        if (now > entry.resetTime) {
            entry.count = 1;
            entry.resetTime = now + windowMs;
            return false;
        }
        
        entry.count++;
        return entry.count > maxRequests;
    }

    /**
     * Comprehensive security validation for mod installation
     */
    public static validateModInstallationSecurity(
        modPath: string,
        installPath: string,
        instanceName: string
    ): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitized: {
                modPath,
                installPath,
                instanceName
            }
        };

        // Validate all components
        const modValidation = this.validateModArchive(modPath);
        const pathValidation = this.validateDirectoryPath(installPath, {
            mustBeWritable: true,
            allowRelative: false
        });
        const nameValidation = this.validateInstallationName(instanceName);
        const archiveValidation = this.validateArchiveContents(modPath);
        
        // Aggregate results
        const validations = [modValidation, pathValidation, nameValidation, archiveValidation];
        
        for (const validation of validations) {
            if (!validation.isValid) {
                result.isValid = false;
                result.errors.push(...validation.errors);
            }
            result.warnings.push(...validation.warnings);
        }
        
        // Update sanitized values
        if (modValidation.sanitized) result.sanitized.modPath = modValidation.sanitized;
        if (pathValidation.sanitized) result.sanitized.installPath = pathValidation.sanitized;
        if (nameValidation.sanitized) result.sanitized.instanceName = nameValidation.sanitized;

        return result;
    }
}