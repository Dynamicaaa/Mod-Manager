/**
 * Standardized error types for mod installation failures
 * Provides user-friendly error messages with suggested fixes
 */

export type InstallationPhase = 'analyzing' | 'extracting' | 'mapping' | 'installing' | 'verifying';

/**
 * Base class for mod installation errors
 */
export class ModInstallationError extends Error {
    public readonly phase: InstallationPhase;
    public readonly suggestedFix?: string;
    public readonly isRetryable: boolean;
    public readonly errorCode: string;

    constructor(
        message: string,
        phase: InstallationPhase,
        suggestedFix?: string,
        isRetryable: boolean = false,
        errorCode: string = 'GENERIC_ERROR'
    ) {
        super(message);
        this.name = 'ModInstallationError';
        this.phase = phase;
        this.suggestedFix = suggestedFix;
        this.isRetryable = isRetryable;
        this.errorCode = errorCode;
        
        // Maintains proper stack trace for where error was thrown (V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ModInstallationError);
        }
    }

    /**
     * Returns a user-friendly error message
     */
    public getUserFriendlyMessage(): string {
        const phaseText = this.getPhaseDisplayName();
        let message = `Error during ${phaseText}: ${this.message}`;
        
        if (this.suggestedFix) {
            message += `\n\nSuggested fix: ${this.suggestedFix}`;
        }
        
        if (this.isRetryable) {
            message += '\n\nThis error may be temporary. You can try again.';
        }
        
        return message;
    }

    private getPhaseDisplayName(): string {
        switch (this.phase) {
            case 'analyzing':
                return 'mod analysis';
            case 'extracting':
                return 'archive extraction';
            case 'mapping':
                return 'file mapping';
            case 'installing':
                return 'file installation';
            case 'verifying':
                return 'installation verification';
            default:
                return 'mod installation';
        }
    }
}

/**
 * Error thrown when archive format is not supported or corrupted
 */
export class UnsupportedArchiveError extends ModInstallationError {
    constructor(filename: string, detectedFormat?: string) {
        const message = detectedFormat 
            ? `Archive format '${detectedFormat}' is not supported`
            : `Unable to determine archive format for '${filename}'`;
        
        const suggestedFix = 'Please ensure the mod is in a supported format (.zip, .rar, .7z, .tar.gz). Try re-downloading the mod if the file appears corrupted.';
        
        super(message, 'analyzing', suggestedFix, false, 'UNSUPPORTED_ARCHIVE');
    }
}

/**
 * Error thrown when archive extraction fails
 */
export class ExtractionError extends ModInstallationError {
    constructor(filename: string, originalError?: Error) {
        const message = `Failed to extract archive '${filename}'${originalError ? `: ${originalError.message}` : ''}`;
        const suggestedFix = 'The archive file may be corrupted or password-protected. Try re-downloading the mod or check if it requires a password.';
        
        super(message, 'extracting', suggestedFix, true, 'EXTRACTION_FAILED');
    }
}

/**
 * Error thrown when mod structure cannot be determined
 */
export class InvalidModStructureError extends ModInstallationError {
    constructor(details?: string) {
        const message = `Invalid mod structure${details ? `: ${details}` : ''}`;
        const suggestedFix = 'This mod may not be compatible with DDLC or may be missing required files. Check the mod documentation for installation instructions.';
        
        super(message, 'analyzing', suggestedFix, false, 'INVALID_MOD_STRUCTURE');
    }
}

/**
 * Error thrown when file operations fail during installation
 */
export class FileOperationError extends ModInstallationError {
    constructor(operation: string, filePath: string, originalError?: Error) {
        const message = `Failed to ${operation} file '${filePath}'${originalError ? `: ${originalError.message}` : ''}`;
        
        let suggestedFix = 'Check that the installation directory is writable and has enough free space.';
        if (originalError) {
            if (originalError.message.includes('ENOSPC')) {
                suggestedFix = 'Not enough disk space available. Free up some space and try again.';
            } else if (originalError.message.includes('EACCES') || originalError.message.includes('EPERM')) {
                suggestedFix = 'Permission denied. Make sure the mod manager has write access to the installation directory.';
            } else if (originalError.message.includes('ENOENT')) {
                suggestedFix = 'File or directory not found. The installation directory may have been moved or deleted.';
            }
        }
        
        super(message, 'installing', suggestedFix, true, 'FILE_OPERATION_FAILED');
    }
}

/**
 * Error thrown when insufficient disk space is available
 */
export class InsufficientSpaceError extends ModInstallationError {
    constructor(requiredSpace?: number, availableSpace?: number) {
        let message = 'Insufficient disk space for mod installation';
        if (requiredSpace && availableSpace) {
            message += ` (requires ${Math.round(requiredSpace / 1024 / 1024)}MB, available ${Math.round(availableSpace / 1024 / 1024)}MB)`;
        }
        
        const suggestedFix = 'Free up disk space and try again. You may also want to move the installation to a drive with more space.';
        
        super(message, 'installing', suggestedFix, true, 'INSUFFICIENT_SPACE');
    }
}

/**
 * Error thrown when installation path conflicts occur
 */
export class PathConflictError extends ModInstallationError {
    constructor(conflictPath: string) {
        const message = `Path conflict detected at '${conflictPath}'`;
        const suggestedFix = 'There may be existing files blocking the installation. Try installing to a clean DDLC installation.';
        
        super(message, 'installing', suggestedFix, true, 'PATH_CONFLICT');
    }
}

/**
 * Error thrown when mod verification fails
 */
export class VerificationError extends ModInstallationError {
    constructor(details: string) {
        const message = `Mod verification failed: ${details}`;
        const suggestedFix = 'The mod may not have installed correctly. Try reinstalling the mod or check if the mod files are corrupted.';
        
        super(message, 'verifying', suggestedFix, true, 'VERIFICATION_FAILED');
    }
}

/**
 * Error thrown when network operations fail
 */
export class NetworkError extends ModInstallationError {
    constructor(operation: string, originalError?: Error) {
        const message = `Network error during ${operation}${originalError ? `: ${originalError.message}` : ''}`;
        const suggestedFix = 'Check your internet connection and try again. If the problem persists, the server may be temporarily unavailable.';
        
        super(message, 'extracting', suggestedFix, true, 'NETWORK_ERROR');
    }
}

/**
 * Error thrown when mod installation is cancelled by user
 */
export class InstallationCancelledError extends ModInstallationError {
    constructor() {
        super('Installation was cancelled by the user', 'installing', undefined, false, 'CANCELLED');
    }
}

/**
 * Utility functions for error handling
 */
export class ErrorHandlerUtils {
    /**
     * Wraps an existing error in a ModInstallationError if it isn't already one
     */
    static wrapError(error: Error, phase: InstallationPhase, context?: string): ModInstallationError {
        if (error instanceof ModInstallationError) {
            return error;
        }
        
        // Try to determine the appropriate error type based on the original error
        if (error.message.includes('ENOSPC')) {
            return new InsufficientSpaceError();
        }
        
        if (error.message.includes('EACCES') || error.message.includes('EPERM')) {
            return new FileOperationError('access', context || 'unknown', error);
        }
        
        if (error.message.includes('not supported') || error.message.includes('invalid format')) {
            return new UnsupportedArchiveError(context || 'unknown');
        }
        
        // Default wrapper
        const message = context ? `${context}: ${error.message}` : error.message;
        return new ModInstallationError(message, phase, 'Please check the error details and try again.', true, 'WRAPPED_ERROR');
    }
    
    /**
     * Determines if an error is worth retrying
     */
    static isRetryableError(error: Error): boolean {
        if (error instanceof ModInstallationError) {
            return error.isRetryable;
        }
        
        // Check for common retryable error patterns
        const retryablePatterns = [
            'ECONNRESET',
            'ECONNREFUSED', 
            'ETIMEDOUT',
            'ENOTFOUND',
            'timeout',
            'network',
            'temporary'
        ];
        
        return retryablePatterns.some(pattern => 
            error.message.toLowerCase().includes(pattern.toLowerCase())
        );
    }
    
    /**
     * Gets a suggested retry delay based on the error type
     */
    static getRetryDelay(error: Error, attemptNumber: number): number {
        const baseDelay = 1000; // 1 second
        const maxDelay = 30000; // 30 seconds
        
        // Exponential backoff with jitter
        const delay = Math.min(baseDelay * Math.pow(2, attemptNumber - 1), maxDelay);
        const jitter = Math.random() * 0.3 * delay; // Add up to 30% jitter
        
        return Math.round(delay + jitter);
    }
}