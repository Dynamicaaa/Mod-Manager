/*
    A dodgy format where the game folder is not in the root of the zip.
    Used by DDLCtVN
 */
import {sep as pathSep, join as joinPath} from "path";
import {ModMapper} from "../ModMapper";
import {CrossPlatformPathResolver} from "../../utils/CrossPlatformPathResolver";

export default class NestedGameFolder extends ModMapper {

    public mapFile(path: string): string {
        const pathParts = path.split("/");
        const filename = pathParts[pathParts.length - 1];

        // Check if this is in an asset folder that should be preserved
        if (pathParts.length > 1 && this.isAssetFolder(pathParts[0])) {
            return CrossPlatformPathResolver.normalizePath(path);
        }

        // On macOS, place Ren'Py scripts in autorun for better compatibility
        if (process.platform === "darwin" && filename && filename.match(/\.rp(y|yc)$/)) {
            return CrossPlatformPathResolver.normalizePath(joinPath("game", "autorun", filename));
        }

        // For everything else, treat the first folder as the game folder
        pathParts[0] = "game";

        return CrossPlatformPathResolver.normalizePath(pathParts.join(pathSep));
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
        return "Nested Game Folder";
    }
}
