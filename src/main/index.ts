import Logger from "./utils/Logger";

import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    IpcMainEvent,
    Notification,
    SaveDialogReturnValue,
    OpenDialogReturnValue,
    shell,
} from "electron";

if (!app.isPackaged) {
    if (process.env.DDMM_CHINA) {
        Logger.debug("Localised Mode", "DDMM_CHINA set, using China constants");
        global.ddmm_constants = require("./constants/china");
    } else {
        Logger.debug("Localised Mode", "Defaulting to global mode");
        global.ddmm_constants = require("./constants/global");
    }
} else {
    try {
        global.ddmm_constants = require("./constants/china");
    } catch (e) {
        global.ddmm_constants = require("./constants/global");
    }
}

console.dir(global.ddmm_constants);

import {copyFileSync, existsSync, mkdirpSync, move, readdirSync, removeSync, unlinkSync} from "fs-extra";
import {join as joinPath} from "path";

if (existsSync(joinPath(app.getPath("appData"), "Doki Doki Mod Manager!"))) {
    Logger.info("Startup", "Prehistoric install folder found, using that.");
    app.setPath("userData", joinPath(app.getPath("appData"), "Doki Doki Mod Manager!"));
} else {
    app.setPath("userData", joinPath(app.getPath("appData"), "DokiDokiModManager"));
}

import DummyDiscordManager from "./discord/DummyDiscordManager";
import {sync as getDataURI} from "datauri";
import ModList from "./mod/ModList";
import I18n from "./i18n/i18n";
import InstallList from "./install/InstallList";
import InstallLauncher from "./install/InstallLauncher";
import Config from "./utils/Config";
import InstallCreator from "./install/InstallCreator";
import ModInstaller from "./mod/ModInstaller";
import InstallManager from "./install/InstallManager";
import DiscordManager from "./discord/DiscordManager";
import OnboardingManager from "./onboarding/OnboardingManager";
import IntegrityCheck from "./onboarding/IntegrityCheck";
import SpecialCaseManager from "./mod/SpecialCaseManager";
import IDiscordManager from "./discord/IDiscordManager";
import BundledUIServer from "./utils/BundledUIServer";

const DISCORD_ID = "1181746042056753216";

// region Flags and references

// User agent for API requests
app.userAgentFallback = "DokiDokiModManager/" + app.getVersion() + " (CanaryZen@proton.me)";

// The last argument, might be a ddmm:// url
const lastArg: string = process.argv.pop();

// Permanent reference to the main app window
let appWindow: BrowserWindow;

// Discord rich presence
let richPresence: IDiscordManager = global.ddmm_constants.discord_disabled ? new DummyDiscordManager() : new DiscordManager(process.env.DDMM_DISCORD_ID || DISCORD_ID);

richPresence.setIdleStatus();

// url to load the UI from
const uiURL: string = require("../../ddmm.json").ui;

// Special case data
const specialCaseManager: SpecialCaseManager = new SpecialCaseManager();

// Mod list
let modList: ModList;

// Install launcher
let installLauncher: InstallLauncher;

// Localisation
mkdirpSync(joinPath(app.getPath("userData"), "language"));

let lang: I18n = new I18n();

// endregion

// region IPC functions

/**
 * Shows an error message in the UI
 * @param error A stacktrace to show on the frontend
 * @param fatal Whether the app needs to restart or not
 */
function showError(error: Error, fatal: boolean) {
    appWindow.webContents.send("error message", {
        fatal,
        stacktrace: error.stack
    });

    appWindow.setClosable(true);
}

/**
 * Launches an install, handling frontend functionality automatically
 * @param folderName The folder containing the install
 */
async function launchInstall(folderName): Promise<void> {
    appWindow.webContents.send("running cover", {
        display: true,
        folder_path: joinPath(Config.readConfigValue("installFolder"), "installs", folderName)
    });
    Config.saveConfigValue("lastLaunchedInstall", folderName);
    appWindow.minimize(); // minimise the window to draw attention to the fact another window will be appearing
    installLauncher.launchInstall(folderName, richPresence).then(() => {
        appWindow.restore(); // show DDMM again
        appWindow.focus();
        appWindow.webContents.send("running cover", {display: false});
        refreshInstalls();
    }).catch(e => {
        appWindow.restore();
        appWindow.focus();
        appWindow.webContents.send("running cover", {display: false});
        showError(e, false);
    });
}

// Restart the app
ipcMain.on("restart", () => {
    app.relaunch();
    app.quit();
});

// Retrieves a list of mods
ipcMain.on("get modlist", () => {
    appWindow.webContents.send("got modlist", modList.getModList());
});

// Retrieves a list of installs
function refreshInstalls() {
    InstallList.getInstallList().then(installs => {
        appWindow.webContents.send("got installs", installs);
    });
}

ipcMain.on("get installs", () => {
    refreshInstalls();
});

// Handler for renderer process localisation functions
ipcMain.on("translate", (ev: IpcMainEvent, query: { key: string, args: string[] }) => {
    let passArgs: string[] = query.args;
    passArgs.unshift(query.key);
    ev.returnValue = lang.translate.apply(lang, passArgs);
});

// Open external URLs
ipcMain.on("open url", (ev: IpcMainEvent, url: string) => {
    shell.openExternal(url);
});

// Show file in file manager
ipcMain.on("show file", (ev: IpcMainEvent, path: string) => {
    shell.showItemInFolder(path);
});

// Config IPC functions
ipcMain.on("save config", (ev: IpcMainEvent, configData: { key: string, value: any }) => {
    Config.saveConfigValue(configData.key, configData.value);
});

ipcMain.on("read config", (ev: IpcMainEvent, key: string) => {
    ev.returnValue = Config.readConfigValue(key);
});

ipcMain.on("get feature flag", (ev: IpcMainEvent, flag: string) => {
    ev.returnValue = true;
});

// Launch install
ipcMain.on("launch install", (ev: IpcMainEvent, folderName: string) => {
    launchInstall(folderName);
});

// Kill game
ipcMain.on("kill game", () => {
    installLauncher.forceKill();
});

// Browse for a mod
ipcMain.on("browse mods", (ev: IpcMainEvent) => {
    const extensions: string[] = ["zip", "7z", "rar", "rpa"];
    dialog.showOpenDialog(appWindow, {
        title: lang.translate("main.mod_browse_dialog.title"),
        filters: [{
            extensions: extensions,
            name: lang.translate("main.mod_browse_dialog.file_format_name")
        }],
    }).then((res: OpenDialogReturnValue) => {
        if (res.filePaths && res.filePaths[0] && extensions.find(ext => (res.filePaths[0].endsWith("." + ext)))) {
            ev.returnValue = res.filePaths[0];
        } else {
            ev.returnValue = null;
        }
    });
});

ipcMain.on("select folder", (ev: IpcMainEvent) => {
    dialog.showOpenDialog(appWindow, {
        title: lang.translate("main.move_install.title"),
        properties: ["openDirectory"]
    }).then((res: OpenDialogReturnValue) => {
        if (res.filePaths && res.filePaths[0]) {
            let error: string = null;
            try {
                const files: string[] = readdirSync(res.filePaths[0]);

                if (files.length > 0) {
                    if (!(files.length <= 4 && files.indexOf("installs") !== -1 && files.indexOf("mods") !== -1)) {
                        error = lang.translate("main.move_install.error_not_empty");
                    }
                }
            } catch {
                error = lang.translate("main.move_install.error_read");
            } finally {
                ev.returnValue = {
                    error,
                    path: res.filePaths[0]
                };
            }
        } else {
            ev.returnValue = null;
        }
    });
});

// Trigger install creation
ipcMain.on("create install", (ev: IpcMainEvent, install: { folderName: string, installName: string, globalSave: boolean, mod: string }) => {
    appWindow.setClosable(false);
    Logger.info("IPC", "Creating install in folder " + install.folderName)
    InstallCreator.createInstall(install.folderName, install.installName, install.globalSave, false).then(() => {
        if (!install.mod) {
            refreshInstalls();
            appWindow.setClosable(true);
        } else {
            Logger.info("IPC", "Installing mod " + install.mod + " in " + install.folderName);
            ModInstaller.installMod(install.mod, joinPath(Config.readConfigValue("installFolder"), "installs", install.folderName, "install"), specialCaseManager).then(() => {
                refreshInstalls();
                appWindow.setClosable(true);
            }).catch((e: Error) => {
                refreshInstalls();
                showError(
                    e,
                    false
                );
            });
        }
    }).catch((e: Error) => {
        refreshInstalls();
        showError(
            e,
            false
        );
    });
});

ipcMain.on("unarchive install", (ev: IpcMainEvent, install: { folderName: string, mod: string }) => {
    appWindow.setClosable(false);
    InstallCreator.createInstall(install.folderName).then(() => {
        if (!install.mod) {
            refreshInstalls();
            appWindow.setClosable(true);
            launchInstall(install.folderName);
        } else {
            ModInstaller.installMod(install.mod, joinPath(Config.readConfigValue("installFolder"), "installs", install.folderName, "install"), specialCaseManager).then(() => {
                refreshInstalls();
                appWindow.setClosable(true);
                launchInstall(install.folderName);
            }).catch((e: Error) => {
                refreshInstalls();
                showError(
                    e,
                    false
                );
            });
        }
    }).catch((e: Error) => {
        refreshInstalls();
        showError(
            e,
            false
        );
    });
});

// Rename an install
ipcMain.on("rename install", (ev: IpcMainEvent, options: { folderName: string, newName: string }) => {
    Logger.info("IPC", "Renaming install in " + options.folderName + " to " + options.newName)
    InstallManager.renameInstall(options.folderName, options.newName).then(() => {
        refreshInstalls();
    }).catch((e: Error) => {
        showError(
            e,
            false
        );
    });
});

// Archive an install
ipcMain.on("archive install", (ev: IpcMainEvent, folderName: string) => {
    InstallManager.archiveInstall(folderName).then(() => {
        refreshInstalls();
    });
});

// Delete an install permanently
ipcMain.on("delete install", (ev: IpcMainEvent, folderName: string) => {
    Logger.info("IPC", "Deleting install in " + folderName);
    InstallManager.deleteInstall(folderName).then(() => {
        refreshInstalls();
    }).catch((e: Error) => {
        showError(
            e,
            false
        );
    });
});

// Delete a mod
ipcMain.on("delete mod", (ev: IpcMainEvent, fileName: string) => {
    Logger.info("IPC", "Deleting mod " + fileName);
    try {
        unlinkSync(joinPath(Config.readConfigValue("installFolder"), "mods", fileName));
        appWindow.webContents.send("got modlist", modList.getModList());
    } catch (e) {
        showError(
            e,
            false
        );
    }
});

// Delete a save file for an install
ipcMain.on("delete save", (ev: IpcMainEvent, folderName: string) => {
    Logger.info("IPC", "Deleting save data for " + folderName);
    InstallManager.deleteSaveData(folderName).then(() => {
        refreshInstalls();
    }).catch((e: Error) => {
        showError(
            e,
            false
        );
    });
});

// Sets install category
ipcMain.on("set category", (ev: IpcMainEvent, options: { folderName: string, category: string }) => {
    Logger.info("IPC", "Setting category of " + options.folderName + " to " + options.category);
    InstallManager.setCategory(options.folderName, options.category).then(() => {
        refreshInstalls();
    }).catch((e: Error) => {
        showError(
            e,
            false
        );
    });
});

// desktop shortcut creation
ipcMain.on("create shortcut", (ev: IpcMainEvent, options: { folderName: string, installName: string }) => {
    if (process.platform !== "win32") {
        dialog.showErrorBox("Shortcut creation is only supported on Windows", "Nice try.");
        return;
    }

    dialog.showSaveDialog(appWindow, {
        title: lang.translate("main.shortcut_dialog.title"),
        defaultPath: options.installName,
        filters: [
            {name: lang.translate("main.shortcut_dialog.file_format_name"), extensions: ["lnk"]}
        ]
    }).then((dialogReturn: SaveDialogReturnValue) => {
        const file: string = dialogReturn.filePath;
        if (file) {
            Logger.info("IPC", "Creating shortcut to " + options.folderName);
            if (!shell.writeShortcutLink(file, "create", {
                target: "ddmm://launch-install/" + options.folderName,
                icon: process.execPath,
                iconIndex: 0
            })) {
                showError(
                    new Error("Attempt to write shortcut failed"),
                    false
                );
            }
        }
    });
});

ipcMain.on("get install background", (ev: IpcMainEvent, folder: string) => {
    const installFolder: string = joinPath(Config.readConfigValue("installFolder"), "installs");

    let bgPath: string = joinPath(installFolder, folder, "ddmm-bg.png");
    let bgDataURL: string;

    let screenshots: string[];

    try {
        screenshots = readdirSync(joinPath(installFolder, folder, "install")).filter(fn => {
            return fn.match(/^screenshot(\d+)\.png$/);
        });
    } catch (e) {
        screenshots = [];
    }

    if (existsSync(bgPath)) {
        bgDataURL = getDataURI(bgPath);
    } else if (screenshots.length > 0) {
        bgDataURL = getDataURI(joinPath(installFolder, folder, "install", screenshots[Math.floor(Math.random() * screenshots.length)]));
    }

    ev.returnValue = bgDataURL;
});

// Check if install exists
ipcMain.on("install exists", (ev: IpcMainEvent, folderName: string) => {
    if (!folderName || typeof folderName !== "string") {
        ev.returnValue = false;
        return;
    }
    ev.returnValue = InstallManager.installExists(folderName);
});

// move installation folder
ipcMain.on("move install", (ev: IpcMainEvent, newInstallFolder: string) => {
    Logger.info("Install Move", "Moving install directory to " + newInstallFolder);
    appWindow.hide();
    const oldInstallFolder: string = Config.readConfigValue("installFolder");
    move(oldInstallFolder, newInstallFolder, {overwrite: true}, e => {
        if (e) {
            Logger.warn("Install Move", "Failed to move install directory: " + e.message);
            dialog.showErrorBox(lang.translate("main.errors.move_install.title"), lang.translate("main.errors.move_install.body"));
        } else {
            Config.saveConfigValue("installFolder", newInstallFolder);
        }
        app.relaunch();
        app.quit();
    });
});

// Get available backgrounds
ipcMain.on("get backgrounds", (ev: IpcMainEvent) => {
    ev.returnValue = readdirSync(joinPath(__dirname, "../../src/renderer/images/backgrounds"));
});

// Get constants
ipcMain.on("get constants", (ev: IpcMainEvent) => {
    ev.returnValue = global.ddmm_constants;
});

// Crash for debugging
ipcMain.on("debug crash", () => {
    throw new Error("User forced debug crash with DevTools");
});

// Disk space check
ipcMain.on("disk space", (ev: IpcMainEvent, path: string) => {
    // sorry!
    ev.returnValue = 999999; // assume there is space
});

ipcMain.on("import mas", (ev: IpcMainEvent, folderName: string) => {
    dialog.showOpenDialog(appWindow, {
        title: lang.translate("main.import_mas.title"),
        filters: [
            {
                name: lang.translate("main.import_mas.filter"),
                extensions: ["*"]
            }
        ]
    }).then((res: OpenDialogReturnValue) => {
        if (res.filePaths && res.filePaths[0]) {
            copyFileSync(res.filePaths[0], joinPath(Config.readConfigValue("installFolder"), "installs", folderName, "install", "characters", "monika"));
            removeSync(res.filePaths[0]);
            InstallManager.setMonikaExported(folderName, false).then(() => {
                refreshInstalls();
            });
        }
    });
});

ipcMain.on("export mas", (ev: IpcMainEvent, folderName: string) => {
    dialog.showSaveDialog(appWindow, {
        title: lang.translate("main.export_mas.title"),
        defaultPath: "monika",
        filters: [
            {
                name: lang.translate("main.export_mas.filter"),
                extensions: ["*"]
            }
        ]
    }).then((dialogReturn: SaveDialogReturnValue) => {
        if (dialogReturn.filePath) {
            Logger.info("MAS", "Exporting Monika from " + folderName);
            const source: string = joinPath(Config.readConfigValue("installFolder"), "installs", folderName, "install", "characters", "monika");
            copyFileSync(source, dialogReturn.filePath);
            removeSync(source);
            InstallManager.setMonikaExported(folderName, true).then(() => {

            });
        }
    });
});

ipcMain.on("reload languages", () => {
    lang = new I18n();
    appWindow.webContents.send("languages reloaded");
});

// endregion

// region Onboarding

ipcMain.on("onboarding scan", () => {
    // the user has likely saved ddlc to their downloads folder, check there.
    const guessPath: string = joinPath(app.getPath("downloads"), process.platform === "darwin" ? "ddlc-mac.zip" : "ddlc-win.zip");
    Logger.info("Onboarding", "Testing " + guessPath);
    if (existsSync(guessPath)) {
        Logger.info("Onboarding", "Download guess exists, checking...");
        IntegrityCheck.checkGameIntegrity(guessPath).then(version => {
            Logger.info("Onboarding", "Game found automatically!");
            appWindow.webContents.send("onboarding validated", {
                path: guessPath,
                success: true,
                version_match: (process.platform === "darwin" ? version === "mac" : version == "windows")
            });
        });
    } else {
        appWindow.webContents.send("onboarding validated", {
            path: guessPath,
            success: false,
            version_match: false
        });
    }
});

ipcMain.on("onboarding browse", (ev: IpcMainEvent) => {
    dialog.showOpenDialog(appWindow, {
        title: lang.translate("main.game_browse_dialog.title"),
        filters: [
            {
                name: lang.translate("main.game_browse_dialog.file_format_name"),
                extensions: ["zip"]
            }
        ]
    }).then((res: OpenDialogReturnValue) => {
        if (res.filePaths && res.filePaths[0]) {
            ev.returnValue = res.filePaths[0];
        } else {
            ev.returnValue = null;
        }
    });
});

ipcMain.on("onboarding validate", (ev: IpcMainEvent, path: string) => {
    IntegrityCheck.checkGameIntegrity(path).then(version => {
        appWindow.webContents.send("onboarding validated", {
            path,
            success: true,
            version_match: (process.platform === "darwin" ? version === "mac" : version == "windows")
        });
    }).catch(() => {
        appWindow.webContents.send("onboarding validated", {
            path, success: false, version_match: false
        });
    })
});

ipcMain.on("onboarding finalise", (ev: IpcMainEvent, ddlcPath: string) => {
    Logger.info("Onboarding", "Creating directory structure");
    mkdirpSync(joinPath(Config.readConfigValue("installFolder"), "mods"));
    mkdirpSync(joinPath(Config.readConfigValue("installFolder"), "installs"));
    mkdirpSync(joinPath(Config.readConfigValue("installFolder"), "downloads"));
    copyFileSync(ddlcPath, joinPath(Config.readConfigValue("installFolder"), "ddlc.zip"));
});
// endregion

// region Global exception handler
process.on("uncaughtException", (e: Error) => {
    Logger.error("Application", "An uncaught exception occurred in the main process");
    console.error(e);
    showError(
        e,
        true
    );
});
// endregion

// region App initialisation
function handleURL(forcedArg?: string) {
    // logic for handling various command line arguments
    const url = forcedArg ? forcedArg : lastArg;
    if (url.startsWith("ddmm://")) {
        const commandParts: string[] = url.split("ddmm://")[1].split("/");
        const command: string = commandParts.shift();

        if (command === "launch-install") {
            const installFolder: string = commandParts[0];
            launchInstall(installFolder);
        }
    }
}

app.on("second-instance", (ev: Event, argv: string[]) => {
    appWindow.restore();
    appWindow.focus();
    handleURL(argv.pop());
});


app.on("ready", () => {
    if (!app.requestSingleInstanceLock()) {
        // we should quit, as another instance is running
        Logger.info("Startup", "Another instance is running, quitting.");
        app.quit();
        return; // avoid running for longer than needed
    }

    // set protocol handler
    if (app.isPackaged) {
        app.setAsDefaultProtocolClient("ddmm");
    }

    // create browser window
    appWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        minWidth: 1000,
        minHeight: 600,
        maximizable: true,
        frame: !!Config.readConfigValue("systemBorders"),
        useContentSize: true,
        webPreferences: {
            contextIsolation: false,
            sandbox: false,
            nodeIntegration: false,
            nativeWindowOpen: true,
            webviewTag: true,
            enableRemoteModule: true,
            preload: joinPath(__dirname, "../../src/renderer/js-preload/preload.js") // contains all the IPC scripts
        },
        titleBarStyle: "hiddenInset",
        show: false,
        title: "Doki Doki Mod Manager" + (process.env.DDMM_DEVELOPER ? " - Development Mode" : "")
    });

    appWindow.on("page-title-updated", event => {
        event.preventDefault();
    });

    // ...and the mod list
    modList = new ModList();

    // ...and the install launcher
    installLauncher = new InstallLauncher();

    appWindow.webContents.on("will-navigate", (ev, url) => {
        console.warn("Prevented navigation from app container", url);
        ev.preventDefault(); // prevent navigation
    });

    appWindow.on("ready-to-show", () => {
        appWindow.show();
    });

    appWindow.webContents.on("crashed", () => {
        const crashNotif = new Notification({
            title: lang.translate("main.errors.exception.title"),
            body: lang.translate("main.errors.exception.body"),
        });

        crashNotif.show();
        app.quit();
    });

    appWindow.on("unresponsive", () => {
        const freezeNotif = new Notification({
            title: lang.translate("main.errors.renderer_freeze.title"),
            body: lang.translate("main.errors.renderer_freeze.body"),
        });

        freezeNotif.show();
    });

    appWindow.on("closed", () => {
        appWindow = null;
        app.quit();
    });

    appWindow.webContents.on("did-finish-load", () => {
        OnboardingManager.requiresOnboarding().catch(e => {
            Logger.info("Onboarding", "Onboarding required - reason: " + e);
            appWindow.webContents.send("start onboarding");
        });
    });

    appWindow.webContents.once("did-finish-load", () => {
        handleURL();
    });

    if (!process.env.DDMM_DEVELOPER) {
        appWindow.setMenu(null);
        appWindow.setMenuBarVisibility(false);
    }

    appWindow.webContents.once("did-fail-load", () => {
        if (Config.readConfigValue("localUI")) {
            dialog.showErrorBox(lang.translate("main.errors.dev_ui_load_fail.title"), lang.translate("main.errors.dev_ui_load_fail.body"));
            appWindow.loadURL(uiURL);
        } else {
            Logger.warn("UI", "Displaying offline message.");
            appWindow.loadFile(joinPath(__dirname, "../../src/renderer/html/offline.html"))
        }
    });

    if (Config.readConfigValue("localUI")) {
        appWindow.loadURL(Config.readConfigValue("localUI"));
    } else {
        BundledUIServer.start().then(port => {
            appWindow.loadURL(`http://localhost:${port}/`);
        });
    }

    if (!Config.readConfigValue("installFolder", true)) {
        Config.saveConfigValue("installFolder", Config.readConfigValue("installFolder"));
    }

    if (process.env.DDMM_DEVTOOLS) {
        appWindow.webContents.openDevTools();
    }

    Logger.info("Startup", "Application startup complete!");
});
// endregion
