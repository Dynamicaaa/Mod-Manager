import { join as joinPath, sep as pathSep } from "path";
import { platform } from "os";

/**
 * Cross-platform path resolver for handling platform-specific game installation paths
 * Provides centralized logic for resolving game paths, script paths, and save data paths
 */
export class CrossPlatformPathResolver {
    
    /**
     * Resolves the main game path based on platform and installation structure
     * @param installPath The base installation path
     * @returns The resolved game path
     */
    public static resolveGamePath(installPath: string): string {
        const currentPlatform = platform();
        
        switch (currentPlatform) {
            case 'darwin':
                // macOS: Check for app bundle structure first
                const appBundlePath = joinPath(installPath, "DDLC.app", "Contents", "Resources", "autorun");
                const directGamePath = joinPath(installPath, "game");
                
                // Prefer app bundle structure for macOS
                try {
                    const fs = require("fs");
                    if (fs.existsSync(appBundlePath)) {
                        return appBundlePath;
                    } else if (fs.existsSync(directGamePath)) {
                        return directGamePath;
                    } else {
                        // Default to app bundle path for new installations
                        return appBundlePath;
                    }
                } catch (error) {
                    console.warn("Error checking game path existence:", error);
                    return appBundlePath;
                }
                
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
                // macOS: Scripts are in the app bundle or root
                const appBundleScriptPath = joinPath(installPath, "DDLC.app", "Contents", "MacOS");
                const rootScriptPath = installPath;
                
                try {
                    const fs = require("fs");
                    if (fs.existsSync(joinPath(appBundleScriptPath, "DDLC"))) {
                        return appBundleScriptPath;
                    } else {
                        return rootScriptPath;
                    }
                } catch (error) {
                    console.warn("Error checking script path existence:", error);
                    return appBundleScriptPath;
                }
                
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
                // macOS: Save data can be in multiple locations
                const appBundleSavePath = joinPath(installPath, "DDLC.app", "Contents", "Resources", "autorun", "game", "saves");
                const directSavePath = joinPath(installPath, "game", "saves");
                
                try {
                    const fs = require("fs");
                    if (fs.existsSync(appBundleSavePath)) {
                        return appBundleSavePath;
                    } else if (fs.existsSync(directSavePath)) {
                        return directSavePath;
                    } else {
                        // Default to app bundle structure for consistency
                        return appBundleSavePath;
                    }
                } catch (error) {
                    console.warn("Error checking save data path existence:", error);
                    return appBundleSavePath;
                }
                
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
                // macOS: RenPy libs can be in app bundle or root
                const appBundleRenpyPath = joinPath(installPath, "DDLC.app", "Contents", "Resources", "autorun", "renpy");
                const directRenpyPath = joinPath(installPath, "renpy");
                
                try {
                    const fs = require("fs");
                    if (fs.existsSync(appBundleRenpyPath)) {
                        return appBundleRenpyPath;
                    } else if (fs.existsSync(directRenpyPath)) {
                        return directRenpyPath;
                    } else {
                        return appBundleRenpyPath;
                    }
                } catch (error) {
                    console.warn("Error checking RenPy path existence:", error);
                    return appBundleRenpyPath;
                }
                
            case 'win32':
            case 'linux':
            default:
                return joinPath(installPath, "renpy");
        }
    }

    /**
     * Resolves the appropriate mod installation path for a given file
     * @param installPath The base installation path
     * @param relativePath The relative path of the file being installed
     * @returns The resolved installation path
     */
    public static resolveModInstallPath(installPath: string, relativePath: string): string {
        const currentPlatform = platform();
        
        // Determine if this is a game file, script file, or other type
        const isGameFile = relativePath.startsWith("game/") || 
                          relativePath.includes(".rpy") || 
                          relativePath.includes(".rpyc") ||
                          relativePath.includes(".png") ||
                          relativePath.includes(".jpg") ||
                          relativePath.includes(".ogg") ||
                          relativePath.includes(".mp3");
        
        const isScriptFile = relativePath.includes(".exe") || 
                           relativePath.includes(".sh") ||
                           relativePath.includes(".app/");
        
        switch (currentPlatform) {
            case 'darwin':
                if (isGameFile) {
                    // Game files go to the autorun directory for macOS compatibility
                    const basePath = this.resolveGamePath(installPath);
                    return joinPath(basePath, relativePath.replace(/^game\//, ""));
                } else if (isScriptFile) {
                    // Script files and app bundles go to appropriate locations
                    return joinPath(installPath, relativePath);
                } else {
                    // Other files (configs, etc.) go to root
                    return joinPath(installPath, relativePath);
                }
                
            case 'win32':
            case 'linux':
            default:
                // Standard structure for Windows and Linux
                return joinPath(installPath, relativePath);
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