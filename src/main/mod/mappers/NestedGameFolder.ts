/*
    A dodgy format where the game folder is not in the root of the zip.
    Used by DDLCtVN
 */
import {sep as pathSep, join as joinPath} from "path";
import {ModMapper} from "../ModMapper";

export default class NestedGameFolder extends ModMapper {

    public mapFile(path: string): string {
        const pathParts = path.split("/");
        const filename = pathParts[pathParts.length - 1];

        // On macOS, place Ren'Py scripts in autorun for better compatibility
        if (process.platform === "darwin" && filename && filename.match(/\.rp(y|yc)$/)) {
            return joinPath("game", "autorun", filename);
        }

        pathParts[0] = "game";

        return pathParts.join(pathSep);
    }

    public getFriendlyName(): string {
        return "Nested Game Folder";
    }
}
