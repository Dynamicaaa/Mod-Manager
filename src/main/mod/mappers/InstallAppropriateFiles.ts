import {join as joinPath} from "path";
import {ModMapper} from "../ModMapper";

/*
    Take files and put them in their appropriate directories.
    rpy / rpyc / rpa files go in the game folder, whereas chr files go in the characters folder.
    This won't work a lot of the time, but at least it's not "dump and hope for the best".
    Wait, that's a thing too!
 */
export default class InstallAppropriateFiles extends ModMapper {

    public mapFile(path: string): string {
        const filename: string = path.split("/").pop();
        const pathParts = path.split("/");
        
        // Check if this file is in an asset folder that should be preserved
        if (pathParts.length > 1 && this.isAssetFolder(pathParts[0])) {
            return path;
        }
        
        if (filename.match(/\.rp(y|yc)$/)) { // it is a ren'py script file
            // On macOS, place scripts in autorun for better compatibility
            if (process.platform === "darwin") {
                return joinPath("game", "autorun", filename);
            }
            return joinPath("game", filename);
        } else if (filename.match(/\.rpa$/)) { // it is a ren'py archive file
            return joinPath("game", filename);
        } else if (filename.match(/\.chr$/)) { // it is a character file
            return joinPath("characters", filename);
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
        return "Unsorted Game Files";
    }
}
