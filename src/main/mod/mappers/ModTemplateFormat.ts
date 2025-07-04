import {sep as pathSep, join as joinPath} from "path";
import {ModMapper} from "../ModMapper";

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
            // On macOS, place Ren'Py scripts in autorun for better compatibility
            if (process.platform === "darwin" && filename && filename.match(/\.rp(y|yc)$/)) {
                return joinPath("game", "autorun", filename);
            }
            return pathParts.join(pathSep);
        } else if (pathParts[0] === "characters") {
            return pathParts.join(pathSep);
        } else if (pathParts.length > 0 && this.isAssetFolder(pathParts[0])) {
            // Include asset folders (audio, images, fonts, videos, etc.)
            return pathParts.join(pathSep);
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

}
