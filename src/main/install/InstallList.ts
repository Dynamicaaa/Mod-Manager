import {app} from "electron";
import {join as joinPath} from "path";
import {readdirSync, readFileSync, statSync} from "fs";
import Install from "../types/Install";
import Config from "../utils/Config";
import I18n from "../utils/i18n";

const lang: I18n = new I18n(app.getLocale());

export default class InstallList {

    /**
     * Reads the install directory and returns information on each install
     * @returns Install[] a list of installs
     */
    static getInstallList(): Install[] {
        // find and read the folders
        const installFolder: string = joinPath(Config.readConfigValue("installFolder"), "installs");

        console.log("Reading installs from " + installFolder);

        const installs = readdirSync(installFolder);
        let returned: Install[] = [];

        for (let folder of installs) {
            // Skip system files and hidden files that aren't valid install directories
            if (folder.startsWith('.') || folder === 'Thumbs.db') {
                console.log("Skipping system file:", folder);
                continue;
            }

            // Verify this is actually a directory before trying to read install data
            try {
                const folderPath = joinPath(installFolder, folder);
                const folderStats = statSync(folderPath);
                if (!folderStats.isDirectory()) {
                    console.log("Skipping non-directory:", folder);
                    continue;
                }
            } catch (e) {
                console.log("Could not stat folder:", folder, e.message);
                continue;
            }

            const dataFilePath: string = joinPath(installFolder, folder, "install", "install.json");
            let data: any = null;
            let fileContents: string | null = null;
            try {
                // Try new location first
                fileContents = readFileSync(dataFilePath, "utf8");
                data = JSON.parse(fileContents);
            } catch (e) {
                // Fallback: try old install.json in instance folder
                const legacyPath = joinPath(installFolder, folder, "install.json");
                try {
                    fileContents = readFileSync(legacyPath, "utf8");
                    data = JSON.parse(fileContents);
                    // Adapt old format to new Install constructor
                    if (data && typeof data === "object" && data.name) {
                        data.globalSave = data.globalSave ?? false;
                        data.mod = data.mod ?? null;
                    }
                } catch (legacyErr) {
                    console.info("Failed to read install data from both new and legacy locations for " + folder, legacyErr.message);
                    console.log("Ignoring the folder.");
                    continue;
                }
            }

            let screenshots: string[] = [];
            try {
                screenshots = readdirSync(joinPath(installFolder, folder, "install")).filter(fn => {
                    return fn.match(/^screenshot(\d+)\.png$/);
                });
            } catch (e) {
                console.log("Could not load screenshots due to an IO error", e.message);
            }

            if (data && data.name) {
                returned.push(new Install(data.name, folder, data.globalSave, screenshots, data.mod));
            }
        }

        if (process.platform === "win32") {
            app.setUserTasks(returned.map((install: Install) => {
                return {
                    program: process.execPath,
                    arguments: "ddmm://launch-install/" + install.folderName,
                    iconPath: process.execPath,
                    iconIndex: 0,
                    title: install.name,
                    description: lang.translate("main.jumplist.task_launch", install.name)
                };
            }));
        }

        return returned;
    }
}