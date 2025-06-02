import {join as joinPath} from "path";
import {ModMapper} from "../ModMapper";

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
            // On macOS, place Ren'Py scripts in autorun for better compatibility
            if (process.platform === "darwin" && filename && filename.match(/\.rp(y|yc)$/)) {
                return joinPath("game", "autorun", filename);
            }
            return path;
        } else if (baseFolder === "characters") {
            return path;
        }

        return null; // ignore it
    }

    public getFriendlyName(): string {
        return "Mod (Doki Doki Mod Manager)";
    }
}
