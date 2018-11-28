"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const Install_1 = require("../types/Install");
const config_1 = require("../config");
class InstallList {
    /**
     * Reads the install directory and returns information on each install
     * @returns Install[] a list of installs
     */
    static getInstallList() {
        // find and read the folders
        const installFolder = path_1.join(config_1.default.readConfigValue("installFolder"), "installs");
        console.log("Reading installs from " + installFolder);
        const installs = fs_1.readdirSync(installFolder);
        let returned = [];
        for (let folder of installs) {
            const dataFilePath = path_1.join(installFolder, folder, "install.json");
            try {
                const fileContents = fs_1.readFileSync(dataFilePath, "utf8");
                const data = JSON.parse(fileContents);
                if (data.name) {
                    returned.push(new Install_1.default(data.name, folder, data.globalSave));
                }
            }
            catch (e) {
                console.info("Failed to read install data from " + dataFilePath, e.message);
                console.log("Ignoring the folder.");
                // do nothing, the folder should be ignored
            }
        }
        return returned;
    }
}
exports.default = InstallList;
//# sourceMappingURL=InstallList.js.map