import {join as joinPath} from "path";
import {ModMapper} from "../ModMapper";

/*
    A last resort attempt to install a mod by dumping everything in the game folder.
    This won't work most of the time, but it's better than giving up.
 */
export default class DumpAndHopeForTheBest extends ModMapper {

    public mapFile(path: string): string {
        const filename = path.split("/").pop();
        
        // On macOS, place Ren'Py scripts in autorun for better compatibility
        if (process.platform === "darwin" && filename && filename.match(/\.rp(y|yc)$/)) {
            return joinPath("game", "autorun", filename);
        }
        
        return joinPath("game", path);
    }

    public getFriendlyName(): string {
        return "Zipped Game Folder";
    }
}
