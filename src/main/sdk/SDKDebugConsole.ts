import {BrowserWindow} from "electron";
import {join as joinPath} from "path";
import {LogClass} from "./LogClass";
import { logger } from "../utils/EnhancedLogger";

export interface DebugLogEntry {
    timestamp: string;
    level: 'DEBUG' | 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'PROGRESS' | 'NETWORK' | 'FILE' | 'INSTALL' | 'ARCHIVE';
    module: string;
    message: string;
    data?: any;
}

export default class SDKDebugConsole {

    private window: BrowserWindow;
    private logHistory: DebugLogEntry[] = [];
    private maxLogEntries: number = 1000;

    /**
     * Initialises a console window for debugging the SDK
     * @param windowTitle The text to be appended to the window title
     */
    constructor(windowTitle: string) {
        this.window = new BrowserWindow({
            width: 1000,
            height: 600,
            minWidth: 600,
            minHeight: 300,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                preload: joinPath(__dirname, "../../../src/renderer/js-preload/sdk-preload.js") // contains all the IPC scripts
            }
        });

        this.window.setMenu(null);

        this.window.loadFile(joinPath(__dirname, "../../../src/renderer/html/sdk-debug.html"));

        logger.info('SDKDebugConsole', `Initializing debug console for: ${windowTitle}`);
        this.window.setTitle("Enhanced Debug Console - " + windowTitle);

        this.window.on("ready-to-show", () => {
            this.window.show();
            // Send existing log history
            this.sendLogHistory();
            logger.debug('SDKDebugConsole', 'Debug console window ready and shown.');
        });

        this.window.on("closed", () => {
            this.window = null;
        });
    }

    /**
     * Logs text to the console with enhanced formatting
     * @param text The text to be logged
     * @param clazz The class to apply to the text (for warnings or errors)
     * @param module The module name for organization
     * @param data Optional additional data to log
     */
    log(text: string, clazz?: LogClass, module: string = 'SDK', data?: any) {
        const entry: DebugLogEntry = {
            timestamp: new Date().toISOString(),
            level: this.mapLogClassToLevel(clazz),
            module,
            message: text,
            data
        };

        // Add to history
        this.addToHistory(entry);

        if (!this.window) return;
        
        if (this.window.isVisible()) {
            this.window.webContents.send("enhanced-log", entry);
        } else {
            this.window.once("ready-to-show", () => {
                this.window.webContents.send("enhanced-log", entry);
            });
        }
    }

    /**
     * Logs with specific level and module
     */
    logWithLevel(level: DebugLogEntry['level'], module: string, message: string, data?: any) {
        const entry: DebugLogEntry = {
            timestamp: new Date().toISOString(),
            level,
            module,
            message,
            data
        };

        this.addToHistory(entry);

        if (!this.window) return;
        
        if (this.window.isVisible()) {
            this.window.webContents.send("enhanced-log", entry);
        } else {
            this.window.once("ready-to-show", () => {
                this.window.webContents.send("enhanced-log", entry);
            });
        }
    }

    /**
     * Logs progress information
     */
    logProgress(module: string, current: number, total: number, message: string) {
        const percentage = Math.round((current / total) * 100);
        const progressMessage = `${message} - ${current}/${total} (${percentage}%)`;
        
        this.logWithLevel('PROGRESS', module, progressMessage, {
            current,
            total,
            percentage
        });
    }

    /**
     * Adds a visual separator in the console
     */
    addSeparator(title?: string) {
        const entry: DebugLogEntry = {
            timestamp: new Date().toISOString(),
            level: 'INFO',
            module: 'SYSTEM',
            message: title ? `── ${title} ──` : '────────────────────────────────────────',
            data: { separator: true, title }
        };

        this.addToHistory(entry);

        if (this.window && this.window.isVisible()) {
            this.window.webContents.send("enhanced-log", entry);
        }
    }

    /**
     * Clears the console
     */
    clear() {
        this.logHistory = [];
        if (this.window && this.window.isVisible()) {
            this.window.webContents.send("clear-console");
        }
    }

    /**
     * Exports log history as JSON
     */
    exportLogs(): string {
        return JSON.stringify(this.logHistory, null, 2);
    }

    private mapLogClassToLevel(clazz?: LogClass): DebugLogEntry['level'] {
        switch (clazz) {
            case LogClass.WARNING:
                return 'WARN';
            case LogClass.ERROR:
                return 'ERROR';
            default:
                return 'INFO';
        }
    }

    private addToHistory(entry: DebugLogEntry) {
        this.logHistory.push(entry);
        // Keep only the last N entries to prevent memory issues
        if (this.logHistory.length > this.maxLogEntries) {
            this.logHistory = this.logHistory.slice(-this.maxLogEntries);
        }
    }

    private sendLogHistory() {
        if (this.window && this.logHistory.length > 0) {
            this.window.webContents.send("log-history", this.logHistory);
            logger.debug('SDKDebugConsole', `Sent ${this.logHistory.length} log entries to renderer.`);
        }
    }

    /**
     * Closes the debugging console
     */
    shutdown() {
        if (!this.window) return;
        logger.info('SDKDebugConsole', 'Shutting down debug console.');
        this.window.close();
    }
}