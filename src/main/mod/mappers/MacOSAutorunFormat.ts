import {join as joinPath} from "path";
import {ModMapper} from "../ModMapper";

/*
    macOS Autorun Format: Optimized for macOS Ren'Py mod compatibility
    
    This mapper ensures better mod compatibility on macOS by placing Ren'Py script files
    (.rpy and .rpyc) into the game/autorun directory. This helps with mod loading issues
    that can occur on macOS systems.
    
    Mapping behavior:
    - .rpy/.rpyc files go to game/autorun/ (for better macOS compatibility)
    - .chr files go to characters/
    - .rpa files go to game/
    - Files already in game/ or characters/ directories are preserved
    - Other files are ignored
 */
export default class MacOSAutorunFormat extends ModMapper {

    public mapFile(path: string): string {
        const pathParts = path.split("/");
        const filename = pathParts[pathParts.length - 1];

        // Skip directories
        if (path.endsWith("/")) {
            return null;
        }

        // Handle files already in structured directories
        if (pathParts[0] === "game") {
            // For Ren'Py scripts in game folder, move to autorun for better macOS compatibility
            if (filename.match(/\.rp(y|yc)$/)) {
                return joinPath("game", "autorun", filename);
            } else {
                // Keep other game files in their original location
                return path;
            }
        } else if (pathParts[0] === "characters") {
            // Keep character files in characters folder
            return path;
        } else if (this.isAssetFolder(pathParts[0])) {
            // Include asset folders (audio, images, fonts, videos, etc.)
            return path;
        } else if (filename.match(/\.rp(y|yc)$/)) {
            // Place loose Ren'Py scripts in autorun for macOS compatibility
            return joinPath("game", "autorun", filename);
        } else if (filename.match(/\.chr$/)) {
            // Place character files in characters folder
            return joinPath("characters", filename);
        } else if (filename.match(/\.rpa$/)) {
            // Place archive files in game folder
            return joinPath("game", filename);
        }

        // Ignore all other files
        return null;
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
        return "macOS Autorun Mod";
    }
}
