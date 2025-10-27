import { EventEmitter } from "events";
import { ipcMain } from "electron";
import { logger } from "../utils/EnhancedLogger";

/**
 * Interface for progress events during mod installation
 */
export interface ProgressEvent {
    phase: 'analyzing' | 'extracting' | 'mapping' | 'installing' | 'verifying';
    progress: number; // 0-100
    currentFile?: string;
    message: string;
    sessionId: string;
}

/**
 * Progress reporter for a specific installation session
 */
export class ProgressReporter extends EventEmitter {
    private sessionId: string;
    private currentPhase: ProgressEvent['phase'] = 'analyzing';
    private currentProgress: number = 0;

    constructor(sessionId: string) {
        super();
        this.sessionId = sessionId;
    }

    /**
     * Updates the current phase of installation
     * @param phase The installation phase
     * @param message Descriptive message for the phase
     * @param progress Optional progress percentage (0-100)
     */
    public updatePhase(phase: ProgressEvent['phase'], message: string, progress: number = 0): void {
        this.currentPhase = phase;
        this.currentProgress = progress;
        
        const event: ProgressEvent = {
            phase,
            progress,
            message,
            sessionId: this.sessionId
        };

        this.emitProgress(event);
        logger.progress('Installation', `Phase: ${phase}, Progress: ${progress}%, Message: ${message}`, { sessionId: this.sessionId });
    }

    /**
     * Updates progress within the current phase
     * @param progress Progress percentage (0-100)
     * @param currentFile Optional current file being processed
     * @param message Optional message override
     */
    public updateProgress(progress: number, currentFile?: string, message?: string): void {
        this.currentProgress = Math.min(100, Math.max(0, progress));
        
        const event: ProgressEvent = {
            phase: this.currentPhase,
            progress: this.currentProgress,
            currentFile,
            message: message || this.getDefaultPhaseMessage(),
            sessionId: this.sessionId
        };

        this.emitProgress(event);
        logger.progress('Installation', `Progress: ${progress}%, Current File: ${currentFile || 'N/A'}, Message: ${message || this.getDefaultPhaseMessage()}`, { sessionId: this.sessionId });
    }

    /**
     * Updates the current file being processed
     * @param filename The current file
     * @param fileIndex Current file index (0-based)
     * @param totalFiles Total number of files
     */
    public updateCurrentFile(filename: string, fileIndex: number, totalFiles: number): void {
        const progress = totalFiles > 0 ? Math.round((fileIndex / totalFiles) * 100) : 0;
        
        const event: ProgressEvent = {
            phase: this.currentPhase,
            progress,
            currentFile: filename,
            message: `Processing file ${fileIndex + 1} of ${totalFiles}: ${filename}`,
            sessionId: this.sessionId
        };

        this.emitProgress(event);
        logger.progress('Installation', `Processing file ${fileIndex + 1} of ${totalFiles}: ${filename} (${progress}%)`, { sessionId: this.sessionId, currentFile: filename });
    }

    /**
     * Marks the installation as complete
     */
    public complete(): void {
        const event: ProgressEvent = {
            phase: 'verifying',
            progress: 100,
            message: 'Installation completed successfully',
            sessionId: this.sessionId
        };

        this.emitProgress(event);
        logger.success('Installation', 'Installation completed successfully', { sessionId: this.sessionId });
    }

    /**
     * Reports an error during installation
     * @param error The error that occurred
     * @param phase The phase where the error occurred
     */
    public error(error: Error, phase?: ProgressEvent['phase']): void {
        const event: ProgressEvent = {
            phase: phase || this.currentPhase,
            progress: this.currentProgress,
            message: `Error: ${error.message}`,
            sessionId: this.sessionId
        };

        this.emitProgress(event);
        logger.error('Installation', `Error during installation: ${error.message}`, { sessionId: this.sessionId, phase: phase || this.currentPhase, error: error.stack });
    }

    private emitProgress(event: ProgressEvent): void {
        // Emit to local listeners
        this.emit('progress', event);
        
        // Send to renderer process via IPC
        InstallationProgressManager.sendToRenderer(event);
    }

    private getDefaultPhaseMessage(): string {
        switch (this.currentPhase) {
            case 'analyzing':
                return 'Analyzing content...';
            case 'extracting':
                return 'Extracting files...';
            case 'mapping':
                return 'Organizing output...';
            case 'installing':
                return 'Processing task...';
            case 'verifying':
                return 'Finalizing operation...';
            default:
                return 'Processing...';
        }
    }
}

/**
 * Manager for installation progress reporting
 */
export class InstallationProgressManager {
    private static activeReporters: Map<string, ProgressReporter> = new Map();

    /**
     * Creates a new progress reporter for an installation session
     * @param sessionId Unique identifier for the installation session
     * @returns A progress reporter instance
     */
    public static createReporter(sessionId: string): ProgressReporter {
        const reporter = new ProgressReporter(sessionId);
        this.activeReporters.set(sessionId, reporter);
        
        // Clean up when progress reporting is complete
        reporter.on('progress', (event: ProgressEvent) => {
            if (event.progress === 100 && event.phase === 'verifying') {
                setTimeout(() => {
                    this.removeReporter(sessionId);
                }, 1000); // Keep for 1 second after completion
            }
        });

        return reporter;
    }

    /**
     * Gets an existing progress reporter
     * @param sessionId The session identifier
     * @returns The progress reporter or undefined if not found
     */
    public static getReporter(sessionId: string): ProgressReporter | undefined {
        return this.activeReporters.get(sessionId);
    }

    /**
     * Removes a progress reporter
     * @param sessionId The session identifier
     */
    public static removeReporter(sessionId: string): void {
        const reporter = this.activeReporters.get(sessionId);
        if (reporter) {
            reporter.removeAllListeners();
            this.activeReporters.delete(sessionId);
        }
    }

    /**
     * Sends progress event to renderer process
     * @param event The progress event to send
     */
    public static sendToRenderer(event: ProgressEvent): void {
        try {
            // Send to all renderer processes
            const { webContents } = require('electron');
            webContents.getAllWebContents().forEach(contents => {
                if (!contents.isDestroyed()) {
                    contents.send('mod-installation-progress', event);
                }
            });
        } catch (error: any) {
            logger.warn('ProgressManager', 'Failed to send progress to renderer:', error.message);
        }
    }

    /**
     * Gets all active session IDs
     * @returns Array of active session identifiers
     */
    public static getActiveSessions(): string[] {
        return Array.from(this.activeReporters.keys());
    }

    /**
     * Initializes IPC handlers for progress reporting
     */
    public static initializeIPC(): void {
        // Handle requests from renderer for progress updates
        ipcMain.handle('get-installation-progress', (event, sessionId: string) => {
            const reporter = this.getReporter(sessionId);
            return reporter ? {
                exists: true,
                sessionId: sessionId
            } : {
                exists: false
            };
        });

        // Handle cancellation requests
        ipcMain.handle('cancel-installation', (event, sessionId: string) => {
            const reporter = this.getReporter(sessionId);
            if (reporter) {
                reporter.error(new Error('Installation cancelled by user'));
                this.removeReporter(sessionId);
                return true;
            }
            return false;
        });
    }
}
