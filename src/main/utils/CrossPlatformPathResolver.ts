import { join as joinPath, sep as pathSep } from "path";
import { platform } from "os";
import { existsSync } from "fs";

/**
 * Cross-platform path resolver for handling platform-specific game installation paths
 * Provides centralized logic for resolving game paths, script paths, and save data paths
 */
export class CrossPlatformPathResolver {
    
    private static pickExistingPath(candidates: string[], fallback?: string): string {
        for (const candidate of candidates) {
            try {
                if (existsSync(candidate)) {
                    return candidate;
                }
            } catch {
                // Ignore filesystem errors (permissions, etc.)
            }
        }
        return fallback ?? candidates[0];
    }
    
    /**
     * Resolves the main game path based on platform and installation structure
     * @param installPath The base installation path
     * @returns The resolved game path
     */
    public static resolveGamePath(installPath: string): string {
        const currentPlatform = platform();
        
        switch (currentPlatform) {
            case 'darwin':
                // macOS: Support multiple bundle layouts (App bundle or extracted)
                const macCandidates = [
                    joinPath(installPath, "DDLC.app", "Contents", "Resources", "autorun"),
                    joinPath(installPath, "DDLC.app", "Contents", "Resources", "game"),
                    joinPath(installPath, "Contents", "Resources", "autorun"),
                    joinPath(installPath, "Contents", "Resources", "game"),
                    joinPath(installPath, "autorun"),
                    joinPath(installPath, "game")
                ];
                return this.pickExistingPath(macCandidates);
                
            case 'win32':
                // Windows: Standard game folder
                return joinPath(installPath, "game");
                
            case 'linux':
                // Linux: Standard game folder
                return joinPath(installPath, "game");
                
            default:
                // Fallback to standard structure
                return joinPath(installPath, "game");
        }
    }

    /**
     * Resolves the script path (main executable location) based on platform
     * @param installPath The base installation path
     * @returns The resolved script path
     */
    public static resolveScriptPath(installPath: string): string {
        const currentPlatform = platform();
        
        switch (currentPlatform) {
            case 'darwin':
                // macOS: Executables typically live inside the app bundle, but fall back gracefully
                const macScriptCandidates = [
                    joinPath(installPath, "DDLC.app", "Contents", "MacOS"),
                    joinPath(installPath, "Contents", "MacOS"),
                    installPath
                ];
                for (const candidate of macScriptCandidates) {
                    if (existsSync(joinPath(candidate, "DDLC"))) {
                        return candidate;
                    }
                }
                return this.pickExistingPath(macScriptCandidates);
                
            case 'win32':
                // Windows: Executables in root
                return installPath;
                
            case 'linux':
                // Linux: Executables in root or bin
                return installPath;
                
            default:
                return installPath;
        }
    }

    /**
     * Resolves the save data path based on platform and installation structure
     * @param installPath The base installation path
     * @returns The resolved save data path
     */
    public static resolveSaveDataPath(installPath: string): string {
        const currentPlatform = platform();
        
        switch (currentPlatform) {
            case 'darwin':
                // macOS: Support autorun/game as well as extracted structures
                const macSaveCandidates = [
                    joinPath(installPath, "DDLC.app", "Contents", "Resources", "autorun", "game", "saves"),
                    joinPath(installPath, "DDLC.app", "Contents", "Resources", "game", "saves"),
                    joinPath(installPath, "Contents", "Resources", "autorun", "game", "saves"),
                    joinPath(installPath, "autorun", "game", "saves"),
                    joinPath(installPath, "game", "saves")
                ];
                return this.pickExistingPath(macSaveCandidates);
                
            case 'win32':
                // Windows: Standard saves folder
                return joinPath(installPath, "game", "saves");
                
            case 'linux':
                // Linux: Standard saves folder
                return joinPath(installPath, "game", "saves");
                
            default:
                return joinPath(installPath, "game", "saves");
        }
    }

    /**
     * Resolves the RenPy library path based on platform
     * @param installPath The base installation path
     * @returns The resolved RenPy library path
     */
    public static resolveRenpyPath(installPath: string): string {
        const currentPlatform = platform();
        
        switch (currentPlatform) {
            case 'darwin':
                // macOS: Ren'Py libraries can appear in several bundle layouts
                const macRenpyCandidates = [
                    joinPath(installPath, "DDLC.app", "Contents", "Resources", "autorun", "renpy"),
                    joinPath(installPath, "DDLC.app", "Contents", "Resources", "renpy"),
                    joinPath(installPath, "Contents", "Resources", "autorun", "renpy"),
                    joinPath(installPath, "autorun", "renpy"),
                    joinPath(installPath, "renpy")
                ];
                return this.pickExistingPath(macRenpyCandidates);
                
            case 'win32':
            case 'linux':
            default:
                return joinPath(installPath, "renpy");
        }
    }

    /**
     * Resolves the autorun directory used for mod content placement.
     * On macOS this targets the app bundle, other platforms fall back to the game directory.
     */
    public static resolveAutorunPath(installPath: string): string {
        if (platform() === 'darwin') {
            const macAutorunCandidates = [
                joinPath(installPath, "DDLC.app", "Contents", "Resources", "autorun"),
                joinPath(installPath, "Contents", "Resources", "autorun"),
                joinPath(installPath, "autorun"),
                joinPath(installPath, "game")
            ];
            return this.pickExistingPath(macAutorunCandidates);
        }

        return joinPath(installPath, "game");
    }

    /**
     * Resolves the appropriate mod installation path for a given file
     * @param installPath The base installation path
     * @param relativePath The relative path of the file being installed
     * @returns The resolved installation path
     */
    public static resolveModInstallPath(installPath: string, relativePath: string): string {
        const currentPlatform = platform();
        
        const normalizedRelative = relativePath.replace(/^[\\/]+/, "").replace(/\\/g, "/");
        const lower = normalizedRelative.toLowerCase();

        const assetExtensions = [
            ".rpy",
            ".rpyc",
            ".rpa",
            ".txt",
            ".json",
            ".py",
            ".png",
            ".jpg",
            ".jpeg",
            ".webp",
            ".ogg",
            ".mp3",
            ".wav",
            ".flac",
            ".mp4",
            ".webm",
            ".avi",
            ".chr"
        ];

        const gameDirectoryPrefixes = [
            "game/",
            "characters/",
            "autorun/",
            "scripts/",
            "tl/",
            "mod/",
            "mods/",
            "renpy/"
        ];
        
        const isGameDirectory = gameDirectoryPrefixes.some(prefix => lower.startsWith(prefix));
        const isGameExtension = assetExtensions.some(ext => lower.endsWith(ext));
        const isGameFile = isGameDirectory || isGameExtension;
        
        const isScriptFile = lower.endsWith(".exe") ||
            lower.endsWith(".sh") ||
            lower.endsWith(".bat") ||
            lower.includes(".app/");
        
        const normalizedPath = this.normalizePath(normalizedRelative);
        
        switch (currentPlatform) {
            case 'darwin':
                if (isScriptFile) {
                    // Maintain executable placement beside the app bundle
                    return joinPath(installPath, normalizedPath);
                }
                // Route all mod/game assets into the autorun directory for compatibility
                const autorunBase = this.resolveAutorunPath(installPath);
                return joinPath(autorunBase, normalizedPath);
                
            case 'win32':
            case 'linux':
            default:
                // Standard structure for Windows and Linux
                return joinPath(installPath, normalizedPath);
        }
    }

    /**
     * Gets the platform-specific path separator
     * @returns The path separator for the current platform
     */
    public static getPathSeparator(): string {
        return pathSep;
    }

    /**
     * Normalizes a path for the current platform
     * @param path The path to normalize
     * @returns The normalized path
     */
    public static normalizePath(path: string): string {
        return path.split(/[/\\]/).join(pathSep);
    }

    /**
     * Checks if a path is likely to be a macOS app bundle
     * @param path The path to check
     * @returns True if the path appears to be an app bundle
     */
    public static isAppBundle(path: string): boolean {
        return path.toLowerCase().includes(".app/") || path.toLowerCase().endsWith(".app");
    }

    /**
     * Gets the appropriate game executable name for the platform
     * @returns The executable name for the current platform
     */
    public static getGameExecutableName(): string {
        const currentPlatform = platform();
        
        switch (currentPlatform) {
            case 'darwin':
                return "DDLC"; // macOS app bundle executable
            case 'win32':
                return "DDLC.exe"; // Windows executable
            case 'linux':
                return "DDLC.sh"; // Linux shell script
            default:
                return "DDLC";
        }
    }

    /**
     * Resolves the backup path for a given installation
     * @param installPath The base installation path
     * @param backupName The name of the backup
     * @returns The resolved backup path
     */
    public static resolveBackupPath(installPath: string, backupName: string): string {
        const currentPlatform = platform();
        
        switch (currentPlatform) {
            case 'darwin':
                // macOS: Store backups in a platform-specific location
                return joinPath(installPath, "..", "backups", "macos", backupName);
            case 'win32':
                return joinPath(installPath, "..", "backups", "windows", backupName);
            case 'linux':
                return joinPath(installPath, "..", "backups", "linux", backupName);
            default:
                return joinPath(installPath, "..", "backups", "generic", backupName);
        }
    }
}
