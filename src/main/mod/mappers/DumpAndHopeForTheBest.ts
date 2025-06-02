import {join as joinPath} from "path";
import {ModMapper} from "../ModMapper";

/*
    A last resort attempt to install a mod by dumping everything in the game folder.
    This won't work most of the time, but it's better than giving up.
 */
export default class DumpAndHopeForTheBest extends ModMapper {

    public mapFile(path: string): string {
        const filename = path.split("/").pop();
        const pathParts = path.split("/");
        
        // If the file is in a recognized asset folder, preserve the folder structure
        if (pathParts.length > 1 && this.isAssetFolder(pathParts[0])) {
            return path;
        }
        
        // On macOS, place Ren'Py scripts in autorun for better compatibility
        if (process.platform === "darwin" && filename && filename.match(/\.rp(y|yc)$/)) {
            return joinPath("game", "autorun", filename);
        }
        
        // For everything else, put it in the game folder as a fallback
        return joinPath("game", path);
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
            "tl", "translations", "lang", "locale",
            "characters" // Also preserve characters folder if found
        ];
        return assetFolders.includes(folderName.toLowerCase());
    }

    public getFriendlyName(): string {
        return "Zipped Game Folder";
    }
}
