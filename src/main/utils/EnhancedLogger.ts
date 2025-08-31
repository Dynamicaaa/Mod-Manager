import { Console } from 'console';
import { Transform } from 'stream';
import * as util from 'util';

/**
 * Enhanced logger with colors and better organization for console debugging
 */
export class EnhancedLogger {
    private static instance: EnhancedLogger;
    private console: Console;

    // ANSI color codes
    private static readonly COLORS = {
        RESET: '\x1b[0m',
        BRIGHT: '\x1b[1m',
        DIM: '\x1b[2m',
        
        // Text colors
        RED: '\x1b[31m',
        GREEN: '\x1b[32m',
        YELLOW: '\x1b[33m',
        BLUE: '\x1b[34m',
        MAGENTA: '\x1b[35m',
        CYAN: '\x1b[36m',
        WHITE: '\x1b[37m',
        GRAY: '\x1b[90m',
        
        // Background colors
        BG_RED: '\x1b[41m',
        BG_GREEN: '\x1b[42m',
        BG_YELLOW: '\x1b[43m',
        BG_BLUE: '\x1b[44m',
        BG_MAGENTA: '\x1b[45m',
        BG_CYAN: '\x1b[46m',
    } as const;

    private static readonly LOG_LEVELS = {
        DEBUG: { color: EnhancedLogger.COLORS.GRAY, prefix: '🔍', name: 'DEBUG' },
        INFO: { color: EnhancedLogger.COLORS.BLUE, prefix: 'ℹ️', name: 'INFO' },
        SUCCESS: { color: EnhancedLogger.COLORS.GREEN, prefix: '✅', name: 'SUCCESS' },
        WARN: { color: EnhancedLogger.COLORS.YELLOW, prefix: '⚠️', name: 'WARN' },
        ERROR: { color: EnhancedLogger.COLORS.RED, prefix: '❌', name: 'ERROR' },
        PROGRESS: { color: EnhancedLogger.COLORS.CYAN, prefix: '📊', name: 'PROGRESS' },
        NETWORK: { color: EnhancedLogger.COLORS.MAGENTA, prefix: '🌐', name: 'NETWORK' },
        FILE: { color: EnhancedLogger.COLORS.YELLOW, prefix: '📁', name: 'FILE' },
        INSTALL: { color: EnhancedLogger.COLORS.GREEN, prefix: '⚙️', name: 'INSTALL' },
        ARCHIVE: { color: EnhancedLogger.COLORS.BLUE, prefix: '📦', name: 'ARCHIVE' }
    } as const;

    private constructor() {
        // Create a transform stream to add colors and formatting
        const stdout = new Transform({
            transform(chunk, encoding, callback) {
                callback(null, chunk);
            }
        });
        
        const stderr = new Transform({
            transform(chunk, encoding, callback) {
                callback(null, chunk);
            }
        });

        stdout.pipe(process.stdout);
        stderr.pipe(process.stderr);

        this.console = new Console({ stdout, stderr });
    }

    public static getInstance(): EnhancedLogger {
        if (!EnhancedLogger.instance) {
            EnhancedLogger.instance = new EnhancedLogger();
        }
        return EnhancedLogger.instance;
    }

    private formatTimestamp(): string {
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').slice(0, -1);
        return `${EnhancedLogger.COLORS.GRAY}[${timestamp}]${EnhancedLogger.COLORS.RESET}`;
    }

    private formatMessage(level: keyof typeof EnhancedLogger.LOG_LEVELS, module: string, message: string, ...args: any[]): string {
        const logLevel = EnhancedLogger.LOG_LEVELS[level];
        const timestamp = this.formatTimestamp();
        const levelStr = `${logLevel.color}${EnhancedLogger.COLORS.BRIGHT}${logLevel.prefix} ${logLevel.name}${EnhancedLogger.COLORS.RESET}`;
        const moduleStr = `${EnhancedLogger.COLORS.CYAN}[${module}]${EnhancedLogger.COLORS.RESET}`;
        const formattedMessage = args.length > 0 ? util.format(message, ...args) : message;
        
        return `${timestamp} ${levelStr} ${moduleStr} ${formattedMessage}`;
    }

    private log(level: keyof typeof EnhancedLogger.LOG_LEVELS, module: string, message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage(level, module, message, ...args);
        
        if (level === 'ERROR') {
            console.error(formattedMessage);
        } else {
            console.log(formattedMessage);
        }
    }

    // Public logging methods
    public debug(module: string, message: string, ...args: any[]): void {
        this.log('DEBUG', module, message, ...args);
    }

    public info(module: string, message: string, ...args: any[]): void {
        this.log('INFO', module, message, ...args);
    }

    public success(module: string, message: string, ...args: any[]): void {
        this.log('SUCCESS', module, message, ...args);
    }

    public warn(module: string, message: string, ...args: any[]): void {
        this.log('WARN', module, message, ...args);
    }

    public error(module: string, message: string, ...args: any[]): void {
        this.log('ERROR', module, message, ...args);
    }

    public progress(module: string, message: string, ...args: any[]): void {
        this.log('PROGRESS', module, message, ...args);
    }

    public network(module: string, message: string, ...args: any[]): void {
        this.log('NETWORK', module, message, ...args);
    }

    public file(module: string, message: string, ...args: any[]): void {
        this.log('FILE', module, message, ...args);
    }

    public install(module: string, message: string, ...args: any[]): void {
        this.log('INSTALL', module, message, ...args);
    }

    public archive(module: string, message: string, ...args: any[]): void {
        this.log('ARCHIVE', module, message, ...args);
    }

    // Progress bar for long-running operations
    public progressBar(module: string, current: number, total: number, message?: string): void {
        const percentage = Math.round((current / total) * 100);
        const barLength = 30;
        const filledLength = Math.round((barLength * current) / total);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        
        const progressMsg = message ? `${message} ` : '';
        const progressStr = `${progressMsg}${EnhancedLogger.COLORS.CYAN}${bar}${EnhancedLogger.COLORS.RESET} ${percentage}% (${current}/${total})`;
        
        this.progress(module, progressStr);
    }

    // Separator for visual organization
    public separator(title?: string): void {
        const line = '─'.repeat(80);
        if (title) {
            const titleFormatted = `${EnhancedLogger.COLORS.BRIGHT}${EnhancedLogger.COLORS.CYAN}${title}${EnhancedLogger.COLORS.RESET}`;
            const padding = Math.max(0, (80 - title.length) / 2);
            const paddedTitle = '─'.repeat(Math.floor(padding)) + ` ${titleFormatted} ` + '─'.repeat(Math.ceil(padding));
            console.log(`${EnhancedLogger.COLORS.GRAY}${paddedTitle}${EnhancedLogger.COLORS.RESET}`);
        } else {
            console.log(`${EnhancedLogger.COLORS.GRAY}${line}${EnhancedLogger.COLORS.RESET}`);
        }
    }

    // Performance timing
    private timers: Map<string, number> = new Map();

    public time(label: string, module: string): void {
        this.timers.set(label, Date.now());
        this.debug(module, `⏱️ Timer started: ${label}`);
    }

    public timeEnd(label: string, module: string): void {
        const startTime = this.timers.get(label);
        if (startTime) {
            const duration = Date.now() - startTime;
            this.timers.delete(label);
            this.info(module, `⏱️ Timer "${label}" completed in ${duration}ms`);
        } else {
            this.warn(module, `⏱️ Timer "${label}" not found`);
        }
    }

    // Object/data inspection with colors
    public inspect(module: string, label: string, obj: any): void {
        const inspected = util.inspect(obj, { 
            colors: true, 
            depth: 3, 
            compact: false,
            breakLength: 80
        });
        this.debug(module, `${label}:\n${inspected}`);
    }

    // Error with stack trace
    public errorWithStack(module: string, error: Error | string, context?: any): void {
        if (error instanceof Error) {
            this.error(module, `${error.message}`);
            if (error.stack) {
                console.error(`${EnhancedLogger.COLORS.RED}${EnhancedLogger.COLORS.DIM}${error.stack}${EnhancedLogger.COLORS.RESET}`);
            }
            if (context) {
                this.inspect(module, 'Error Context', context);
            }
        } else {
            this.error(module, error);
            if (context) {
                this.inspect(module, 'Error Context', context);
            }
        }
    }
}

// Export singleton instance
export const logger = EnhancedLogger.getInstance();

// Export for compatibility with existing code
export default logger;