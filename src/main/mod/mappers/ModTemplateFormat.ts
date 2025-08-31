import {sep as pathSep, join as joinPath} from "path";
import {ModMapper} from "../ModMapper";
import {CrossPlatformPathResolver} from "../../utils/CrossPlatformPathResolver";
import {RenpyVersionInfo} from "../../version/RenpyVersionDetector";

/*
    This name isn't quite accurate. It actually works with any mod that has one folder in the root of the zip file,
    then the game, characters etc in that folder. As therationalpi's mod template exports to this format, it seems like
    a good name.
 */
export default class ModTemplateFormat extends ModMapper {

    public mapFile(path: string): string {
        const pathParts = path.split("/");
        const baseFolder = pathParts.shift();
        const filename = pathParts[pathParts.length - 1];

        if (pathParts[0] === "game") {
            // Use CrossPlatformPathResolver for consistent path handling
            if (process.platform === "darwin" && filename && filename.match(/\.rp(y|yc)$/)) {
                // On macOS, place Ren'Py scripts in autorun for better compatibility
                return joinPath("game", "autorun", filename);
            }
            return CrossPlatformPathResolver.normalizePath(pathParts.join("/"));
        } else if (pathParts[0] === "characters") {
            return CrossPlatformPathResolver.normalizePath(pathParts.join("/"));
        } else if (pathParts.length > 0 && this.isAssetFolder(pathParts[0])) {
            // Include asset folders (audio, images, fonts, videos, etc.)
            return CrossPlatformPathResolver.normalizePath(pathParts.join("/"));
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
        return "Mod (DDLC Mod Template)";
    }

    /**
     * Checks if this mapper supports the detected Ren'Py version
     * ModTemplateFormat works with all Ren'Py versions but optimized for 7.x+
     */
    public supportsVersion(versionInfo: RenpyVersionInfo): boolean {
        if (!versionInfo) {
            return true; // Support unknown versions
        }

        // ModTemplateFormat works well with all versions
        // but provide warnings for very old versions
        if (versionInfo.majorVersion === 6) {
            console.warn(`ModTemplateFormat: Ren'Py ${versionInfo.version} detected - some template features may not be fully compatible`);
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
                notes.push('Legacy Ren\'Py 6.x detected - template may use legacy features');
                notes.push('Consider updating to a newer Ren\'Py version if possible');
            } else if (this.versionInfo.majorVersion === 7) {
                notes.push('Ren\'Py 7.x detected - excellent compatibility with mod template format');
            } else if (this.versionInfo.majorVersion === 8) {
                notes.push('Ren\'Py 8.x detected - optimal compatibility with modern template features');
            }

            // Platform-specific notes for macOS
            if (process.platform === "darwin" && this.versionInfo.majorVersion >= 7) {
                notes.push('macOS optimization: Scripts will be placed in autorun directory');
            }
        }

        return notes;
    }
}
