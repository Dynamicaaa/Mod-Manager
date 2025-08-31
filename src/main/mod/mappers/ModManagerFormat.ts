import {join as joinPath} from "path";
import {ModMapper} from "../ModMapper";
import {CrossPlatformPathResolver} from "../../utils/CrossPlatformPathResolver";
import {RenpyVersionInfo} from "../../version/RenpyVersionDetector";

/*
    If the mod uses the DDMMv1 mod format, it can be installed 100% of the time without breaking!
    Well, as long as the mod does use the DDMMv1 mod format, and there isn't just a mod.json file sitting
    there for no apparent reason.
 */
export default class ModManagerFormat extends ModMapper {

    public mapFile(path: string): string {
        const baseFolder = path.split("/")[0];
        const filename = path.split("/").pop();

        if (baseFolder === "game") {
            // Use CrossPlatformPathResolver for consistent path handling
            if (process.platform === "darwin" && filename && filename.match(/\.rp(y|yc)$/)) {
                // On macOS, place Ren'Py scripts in autorun for better compatibility
                return joinPath("game", "autorun", filename);
            }
            return CrossPlatformPathResolver.normalizePath(path);
        } else if (baseFolder === "characters") {
            return CrossPlatformPathResolver.normalizePath(path);
        } else if (this.isAssetFolder(baseFolder)) {
            // Include asset folders (audio, images, fonts, videos, etc.)
            return CrossPlatformPathResolver.normalizePath(path);
        }

        return null; // ignore it
    }

    private isAssetFolder(folderName: string): boolean {
        // Common asset folder names that should be preserved
        const assetFolders = [
            "audio", "music", "sound", "sounds",
            "images", "img", "sprites", "backgrounds", "bg", "cg",
            "fonts", "font",
            "videos", "video", "movies", "movie",
            "data", "assets", "resources",
            "gui", "interface",
            "tl", "translations", "lang", "locale"
        ];
        return assetFolders.includes(folderName.toLowerCase());
    }

    public getFriendlyName(): string {
        return "Mod (Doki Doki Mod Manager)";
    }

    /**
     * Checks if this mapper supports the detected Ren'Py version
     * ModManagerFormat is compatible with all Ren'Py versions
     */
    public supportsVersion(versionInfo: RenpyVersionInfo): boolean {
        if (!versionInfo) {
            return true; // Support unknown versions
        }

        // ModManagerFormat is generally compatible with all versions
        // but provide warnings for older versions
        if (versionInfo.majorVersion === 6) {
            console.warn(`ModManagerFormat: Ren'Py ${versionInfo.version} detected - some modern features may not be available`);
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
                notes.push('Legacy Ren\'Py 6.x detected - using Python 2.7 compatibility mode');
                notes.push('Some modern mod features may not be available');
            } else if (this.versionInfo.majorVersion === 7) {
                notes.push('Ren\'Py 7.x detected - good compatibility with mod manager format');
            } else if (this.versionInfo.majorVersion === 8) {
                notes.push('Ren\'Py 8.x detected - full compatibility with all mod features');
            }

            // Platform-specific notes
            if (process.platform === "darwin" && this.versionInfo.majorVersion >= 7) {
                notes.push('macOS compatibility: Scripts will be placed in autorun directory');
            }
        }

        return notes;
    }
}
