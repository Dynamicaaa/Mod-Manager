import {join as joinPath} from "path";
import {ModMapper} from "../ModMapper";
import {CrossPlatformPathResolver} from "../../utils/CrossPlatformPathResolver";
import {RenpyVersionInfo} from "../../version/RenpyVersionDetector";

/*
    macOS Autorun Format: Optimized for macOS Ren'Py mod compatibility
    
    This mapper ensures better mod compatibility on macOS with two different extraction modes:
    
    1. Standard Mode (no .app file in mod):
       - ALL files and folders are extracted to DDLC.app/Contents/Resources/autorun/
       - Complete directory structure is preserved within the autorun folder
    
    2. App Bundle Mode (.app file present in mod):
       - Files within .app bundles overwrite DDLC.app structure
       - Other files and game/ folder are extracted to the root install directory
       - This is because custom modded .app files don't have an autorun directory structure
    
    This ensures maximum compatibility with all mod types on macOS.
 */
export default class MacOSAutorunFormat extends ModMapper {
    private hasAppFile: boolean;

    constructor(hasAppFile: boolean = false) {
        super();
        this.hasAppFile = hasAppFile;
    }

    public mapFile(path: string): string {
        // Skip directories
        if (path.endsWith("/")) {
            return null;
        }

        // App Bundle Mode: Handle mods that contain .app files
        if (this.hasAppFile) {
            // If this is a .app directory, map it to replace DDLC.app
            if (path.toLowerCase().endsWith(".app")) {
                return "DDLC.app";
            }
            // If this is a file within a .app bundle, map it to overwrite DDLC.app structure
            else if (CrossPlatformPathResolver.isAppBundle(path)) {
                // Handle files within .app bundle (e.g., "CustomMod.app/Contents/Resources/file.txt")
                const appIndex = path.toLowerCase().indexOf(".app/");
                const pathWithinApp = path.substring(appIndex + 5); // Remove "*.app/" prefix
                return joinPath("DDLC.app", pathWithinApp);
            } else {
                // All other files (including game/ folder) go to root install directory
                return path;
            }
        }

        // Standard Mode: Use CrossPlatformPathResolver for consistent macOS path handling
        // For macOS, files should go to the autorun directory for maximum compatibility
        if (process.platform === "darwin") {
            return joinPath("DDLC.app", "Contents", "Resources", "autorun", path);
        } else {
            // For other platforms, use standard mapping
            return path;
        }
    }



    public getFriendlyName(): string {
        return "macOS Autorun Mod";
    }

    /**
     * Returns true if this mapper requires app bundle replacement
     */
    public requiresAppBundleReplacement(): boolean {
        return this.hasAppFile;
    }

    /**
     * Gets the app bundle file that should replace DDLC.app
     * Returns null if no app bundle replacement is needed
     */
    public getAppBundleToReplace(fileName: string): string | null {
        if (!this.hasAppFile) {
            return null;
        }
        
        // Check if this is a .app directory
        if (fileName.toLowerCase().endsWith(".app")) {
            return fileName;
        }
        
        return null;
    }

    /**
     * Checks if this mapper supports the detected Ren'Py version
     * MacOSAutorunFormat works best with Ren'Py 7.x and 8.x
     */
    public supportsVersion(versionInfo: RenpyVersionInfo): boolean {
        if (!versionInfo) {
            return true; // Support unknown versions
        }

        // MacOSAutorunFormat works well with modern Ren'Py versions
        if (versionInfo.majorVersion >= 7) {
            return true;
        }

        // Ren'Py 6.x may have compatibility issues with modern macOS app bundle structure
        if (versionInfo.majorVersion === 6) {
            console.warn(`MacOSAutorunFormat: Ren'Py ${versionInfo.version} may have compatibility issues on macOS`);
            return true; // Still allow but with warning
        }

        return true;
    }

    /**
     * Gets version-specific installation notes
     */
    public getVersionNotes(): string[] {
        const notes: string[] = [];
        
        if (this.versionInfo) {
            if (this.versionInfo.majorVersion === 6) {
                notes.push('Legacy Ren\'Py 6.x detected - may require manual path adjustments');
                notes.push('Consider testing mod functionality after installation');
            } else if (this.versionInfo.majorVersion === 7) {
                notes.push('Ren\'Py 7.x detected - good compatibility with macOS autorun structure');
            } else if (this.versionInfo.majorVersion === 8) {
                notes.push('Ren\'Py 8.x detected - optimal compatibility with modern macOS');
            }

            if (this.hasAppFile && this.versionInfo.majorVersion >= 7) {
                notes.push('App bundle replacement mode - mod will replace DDLC.app structure');
            }
        }

        return notes;
    }
}
