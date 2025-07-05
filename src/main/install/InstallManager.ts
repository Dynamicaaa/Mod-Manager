import {remove, emptyDir, mkdirsSync} from "fs-extra";
import {join as joinPath, sep as pathSep} from "path";
import Config from "../utils/Config";
import {existsSync, readFileSync, writeFileSync} from "fs";
import * as Archiver from "archiver";
import * as StreamZip from "node-stream-zip";
import {createWriteStream, createReadStream} from "fs";

export default class InstallManager {

    /**
     * Returns whether or not the given install exists (or there is a file/folder with that name)
     * @param folderName The folder/file to check
     */
    public static installExists(folderName: string): boolean {
        return existsSync(joinPath(Config.readConfigValue("installFolder"), "installs", folderName));
    }

    /**
     * Rename an install
     * @param folderName The folder containing the install
     * @param newName The new name for the install
     */
    public static renameInstall(folderName: string, newName: string): Promise<null> {
        return new Promise((ff, rj) => {
            const installDataPath: string = joinPath(Config.readConfigValue("installFolder"), "installs", folderName, "install", "install.json");
            if (existsSync(installDataPath)) {
                const data: any = JSON.parse(readFileSync(installDataPath, "utf8"));
                data.name = newName;
                writeFileSync(installDataPath, JSON.stringify(data));
                ff(undefined);
            } else {
                rj();
            }
        });
    }

    /**
     * Deletes an install of the game, including save files.
     * @param folderName The folder containing the install
     */
    public static deleteInstall(folderName: string): Promise<void> {
        return new Promise((ff, rj) => {
            const dirPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            if (existsSync(dirPath)) {
                remove(dirPath).then(() => ff(undefined)).catch(rj);
            } else {
                rj(new Error("Install does not exist."))
            }
        });
    }

    /**
     * Deletes the save file of an install.
     * @param folderName The folder containing the install
     */
    public static deleteSaveData(folderName: string): Promise<void> {
        return new Promise((ff, rj) => {
            const dirPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            if (existsSync(dirPath)) {
                if (process.platform === "win32") {
                    emptyDir(joinPath(dirPath, "appdata")).then(() => ff(undefined)).catch(rj);
                } else if (process.platform === "darwin") {
                    emptyDir(joinPath(dirPath, "appdata", "Library", "RenPy")).then(() => ff(undefined)).catch(rj);
                } else {
                    emptyDir(joinPath(dirPath, "appdata", ".renpy")).then(() => ff(undefined)).catch(rj);
                }
            } else {
                rj(new Error("Install does not exist."))
            }
        });
    }

    /**
     * Backup an install to a zip file
     * @param folderName The folder containing the install
     * @param outPath The output zip file path
     */
    public static backupInstall(folderName: string, outPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const dirPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            if (!existsSync(dirPath)) return reject(new Error("Install does not exist."));
            const output = createWriteStream(outPath);
            const archive = Archiver("zip", { zlib: { level: 9 } });
            output.on("close", () => resolve());
            archive.on("error", err => reject(err));
            archive.pipe(output);
            archive.directory(dirPath, false);
            archive.finalize();
        });
    }

    /**
     * Restore an install from a zip file
     * @param zipPath The zip file path
     * @param folderName The folder to restore to (will be overwritten)
     */
    public static restoreInstall(zipPath: string, folderName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const destPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            // Remove existing folder if present
            remove(destPath).then(async () => {
                const zip = new StreamZip.async({ file: zipPath });
                try {
                    const entries = await zip.entries();
                    for (const entryName in entries) {
                        const entry = entries[entryName];
                        // Always split entryName by '/' to preserve zip structure
                        const entryPath = joinPath(destPath, ...entryName.split("/"));
                        if (entry.isDirectory) {
                            mkdirsSync(entryPath);
                        } else {
                            // Ensure directory exists
                            const dirPath = entryPath.split(pathSep).slice(0, -1).join(pathSep);
                            mkdirsSync(dirPath);
                            await zip.extract(entryName, entryPath);
                        }
                    }
                    await zip.close();
                    resolve();
                } catch (err) {
                    await zip.close();
                    reject(err);
                }
            }).catch(reject);
        });
    }
}