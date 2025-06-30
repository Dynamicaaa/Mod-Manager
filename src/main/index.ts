import {app, BrowserWindow, ipcMain, IpcMainEvent, shell, dialog, Notification} from "electron";
import {move, existsSync, mkdirpSync, readdirSync, removeSync, copyFileSync} from "fs-extra";
import {join as joinPath} from "path";
import {autoUpdater} from "electron-updater";
import * as semver from "semver";
import * as remoteMain from "@electron/remote/main";

// Check if running from Windows Store
const isAppx: boolean = (process.execPath.indexOf("WindowsApps") !== -1);

// One of my major regrets in life is putting an ! at the end of the application name
// This should allow me to use a sane directory name but not break old installs.
if (existsSync(joinPath(app.getPath("appData"), "Doki Doki Mod Manager!"))) {
    console.log("Overriding app data path");
    app.setPath("userData", joinPath(app.getPath("appData"), "Doki Doki Mod Manager!"));
} else {
    app.setPath("userData", joinPath(app.getPath("appData"), "DokiDokiModManager"));
}

import ModList from "./mod/ModList";
import I18n from "./utils/i18n";
import AppConfig from "./utils/AppConfig";
import InstallList from "./install/InstallList";
import InstallLauncher from "./install/InstallLauncher";
import Config from "./utils/Config";
import InstallCreator from "./install/InstallCreator";
import ModInstaller from "./mod/ModInstaller";
import InstallManager from "./install/InstallManager";

import DownloadManager from "./net/DownloadManager";
import OnboardingManager from "./onboarding/OnboardingManager";
import {unlinkSync} from "fs";

// region Flags and references

// Initialize app config
const appConfig = AppConfig.getInstance();

// User agent for API requests - will be updated after config loads
let USER_AGENT = "DokiDokiModManager/0.0.0 (CanaryZen@proton.me)";

// The last argument, might be a ddmm:// url
const lastArg: string = process.argv.pop();

// Permanent reference to the main app window
let appWindow: BrowserWindow;



// Mod list
let modList: ModList;

// Download manager
let downloadManager: DownloadManager;

// Flag for allowing the app window to be closed
let windowClosable: boolean = true;

// Initialize language from saved config or fall back to system locale
const savedLanguage = Config.readConfigValue("language");
const defaultLanguage = process.env.DDMM_LANG || savedLanguage || app.getLocale();
const lang: I18n = new I18n(defaultLanguage);
console.log(`Initialized I18n with language: ${defaultLanguage} (saved: ${savedLanguage}, system: ${app.getLocale()})`);

// endregion

// region IPC functions

/**
 * Shows an error message in the UI
 * @param title The title of the error
 * @param body Some more description text
 * @param stacktrace A stacktrace to show on the frontend
 * @param fatal Whether the app needs to restart or not
 */
function showError(title: string, body: string, stacktrace: string, fatal: boolean) {
    appWindow.webContents.send("error message", {
        title, body, fatal, stacktrace
    });

    windowClosable = true;
    appWindow.setClosable(true);
}

// Cloud save function removed

/**
 * Launches an install, handling frontend functionality automatically
 * @param folderName The folder containing the install
 */
async function launchInstall(folderName: string): Promise<void> {
    Config.saveConfigValue("lastLaunchedInstall", folderName);
    appWindow.minimize(); // minimise the window to draw attention to the fact another window will be appearing

    appWindow.webContents.send("running cover", {
        display: true,
        dismissable: false,
        title: lang.translate("main.running_cover.title_running"),
        description: lang.translate("main.running_cover.description_running"),
        folder_path: joinPath(Config.readConfigValue("installFolder"), "installs", folderName)
    });

    InstallLauncher.launchInstall(folderName).then(() => {
        appWindow.restore(); // show DDMM again
        appWindow.focus();
        appWindow.webContents.send("running cover", {display: false});
        appWindow.webContents.send("got installs", InstallList.getInstallList());
    }).catch(err => {
        appWindow.restore();
        appWindow.focus();

        // Check if this is a crash with enhanced information
        if (err && typeof err === 'object' && err.crashed) {
            console.log("DDLC crashed with enhanced crash info:", err.crashInfo);

            // Send crash dialog to renderer
            appWindow.webContents.send("ddlc-crash", {
                folderName: folderName,
                crashInfo: err.crashInfo,
                message: err.message,
                installPath: joinPath(Config.readConfigValue("installFolder"), "installs", folderName)
            });
        } else {
            // Fallback to old behavior for non-crash errors
            appWindow.webContents.send("running cover", {
                display: true,
                dismissable: true,
                title: lang.translate("main.running_cover.title_crashed"),
                description: err.message || err,
                folder_path: joinPath(Config.readConfigValue("installFolder"), "installs", folderName)
            });
        }
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
ipcMain.on("get installs", () => {
    appWindow.webContents.send("got installs", InstallList.getInstallList());
});

// Handler for renderer process localisation functions
ipcMain.on("translate", (ev: IpcMainEvent, query: { key: string, args: string[] }) => {
    let passArgs: string[] = query.args;
    passArgs.unshift(query.key);
    ev.returnValue = lang.translate.apply(lang, passArgs);
});

// Get available languages
ipcMain.on("get available languages", (ev: IpcMainEvent) => {
    const langPath = joinPath(__dirname, "../../../lang/");
    try {
        const files = readdirSync(langPath);
        const languages = {};
        
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const langCode = file.replace('.json', '');
                const langFile = joinPath(langPath, file);
                try {
                    const langData = JSON.parse(require('fs').readFileSync(langFile, 'utf8'));
                    // Try to get language name from the file itself, or use a lookup
                    const languageNames = {
                        'en-US': { name: 'English', nativeName: 'English (US)' },
                        'es-419': { name: 'Spanish', nativeName: 'Español (América Latina)' },
                        'fr-FR': { name: 'French', nativeName: 'Français' },
                        'de-DE': { name: 'German', nativeName: 'Deutsch' },
                        'fi': { name: 'Finnish', nativeName: 'Suomi' },
                        'ja': { name: 'Japanese', nativeName: '日本語' },
                        'ko': { name: 'Korean', nativeName: '한국어' },
                        'zh-CN': { name: 'Chinese (Simplified)', nativeName: '简体中文' },
                        'zh-TW': { name: 'Chinese (Traditional)', nativeName: '繁體中文' },
                        'ru': { name: 'Russian', nativeName: 'Русский' },
                        'pt-BR': { name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)' },
                        'it-IT': { name: 'Italian', nativeName: 'Italiano' },
                        'nl': { name: 'Dutch', nativeName: 'Nederlands' },
                        'nb': { name: 'Norwegian', nativeName: 'Norsk (Bokmål)' },
                        'pl': { name: 'Polish', nativeName: 'Polski' },
                        'cs': { name: 'Czech', nativeName: 'Čeština' },
                        'da': { name: 'Danish', nativeName: 'Dansk' },
                        'hu': { name: 'Hungarian', nativeName: 'Magyar' },
                        'sv': { name: 'Swedish', nativeName: 'Svenska' },
                        'tr': { name: 'Turkish', nativeName: 'Türkçe' },
                        'ar': { name: 'Arabic', nativeName: 'العربية' },
                        'ua': { name: 'Ukrainian', nativeName: 'Українська' },
                        'sk': { name: 'Slovak', nativeName: 'Slovenčina' },
                        'vn': { name: 'Vietnamese', nativeName: 'Tiếng Việt' },
                        'ro': { name: 'Romanian', nativeName: 'Română' },
                        'el': { name: 'Greek', nativeName: 'Ελληνικά' },
                        'bg': { name: 'Bulgarian', nativeName: 'Български' },
                        'hi': { name: 'Hindi', nativeName: 'हिन्दी' },
                        'id': { name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
                        'tl': { name: 'Tagalog', nativeName: 'Tagalog' },
                        'haw': { name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi' },
                        'eo': { name: 'Esperanto', nativeName: 'Esperanto' },
                        'ms': { name: 'Malay', nativeName: 'Bahasa Melayu' },
                        'ur': { name: 'Urdu', nativeName: 'اردو' },
                        'pa': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
                        'zu': { name: 'Zulu', nativeName: 'isiZulu' },
                        'af': { name: 'Afrikaans', nativeName: 'Afrikaans' },
                        'uwu': { name: 'UwU', nativeName: 'UwU' },
                        'emoji': { name: 'Emoji', nativeName: 'Emoji' },
                        'yoda': { name: 'Yoda', nativeName: 'Yoda' },
                        'pirate': { name: 'Pirate', nativeName: 'Pirate' },
                        'hacker': { name: 'Hacker', nativeName: 'Hacker' },
                        'shakespeare': { name: 'Shakespeare', nativeName: 'Shakespeare' },
                        'valley': { name: 'Valley', nativeName: 'Valley' },
                        'minion': { name: 'Minion', nativeName: 'Minion' }
                    };
                    
                    languages[langCode] = languageNames[langCode] || { 
                        name: langCode, 
                        nativeName: langCode 
                    };
                } catch (err) {
                    console.warn(`Failed to parse language file ${file}:`, err);
                }
            }
        });
        
        ev.returnValue = languages;
    } catch (err) {
        console.error("Failed to read language directory:", err);
        ev.returnValue = {
            'en-US': { name: 'English', nativeName: 'English (US)' }
        };
    }
});

// Reload language
ipcMain.on("reload language", (ev: IpcMainEvent, newLanguage: string) => {
    try {
        // Create new I18n instance with the new language
        const newLang = new I18n(newLanguage);
        
        // Replace the global lang instance
        Object.setPrototypeOf(lang, Object.getPrototypeOf(newLang));
        Object.assign(lang, newLang);
        
        console.log(`Language reloaded to: ${newLanguage}`);
        ev.returnValue = { success: true };
        
        // Notify renderer that language has been reloaded
        if (appWindow && appWindow.webContents) {
            appWindow.webContents.send('language-reloaded', newLanguage);
        }
    } catch (err) {
        console.error("Failed to reload language:", err);
        ev.returnValue = { success: false, error: err.message };
    }
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

// App config IPC functions
ipcMain.on("get app version", (ev: IpcMainEvent) => {
    const version = appConfig.getVersion();
    console.log("IPC get app version called, returning:", version);
    ev.returnValue = version;
});

ipcMain.on("get app name", (ev: IpcMainEvent) => {
    const name = appConfig.getName();
    console.log("IPC get app name called, returning:", name);
    ev.returnValue = name;
});

ipcMain.on("get app config", (ev: IpcMainEvent) => {
    const config = appConfig.getFullConfig();
    console.log("IPC get app config called, returning full config");
    ev.returnValue = config;
});

// Launch install
ipcMain.on("launch install", (ev: IpcMainEvent, folderName: string) => {
    launchInstall(folderName);
});

// Handle crash dialog actions
ipcMain.on("crash-dialog-action", (ev: IpcMainEvent, action: { type: string, folderName?: string }) => {
    console.log("Crash dialog action received:", action);

    switch (action.type) {
        case 'relaunch':
            if (action.folderName) {
                console.log("Relaunching DDLC install:", action.folderName);
                launchInstall(action.folderName);
            }
            break;
        case 'back-to-menu':
            console.log("User chose to go back to menu after crash");
            // Just dismiss the crash dialog - the running cover will be hidden
            appWindow.webContents.send("running cover", {display: false});
            break;
        default:
            console.warn("Unknown crash dialog action:", action.type);
    }
});

// Browse for a mod
ipcMain.on("browse mods", async (ev: IpcMainEvent) => {
    const extensions = ["zip", "gz", "tar", "rar", "7z"];
    const result = await dialog.showOpenDialog(appWindow, {
        title: lang.translate("main.mod_browse_dialog.title"),
        filters: [{
            extensions: extensions,
            name: lang.translate("main.mod_browse_dialog.file_format_name")
        }],
    });

    if (result.filePaths && result.filePaths[0] && extensions.find(ext => (result.filePaths[0].endsWith("." + ext)))) {
        ev.returnValue = result.filePaths[0];
    } else {
        ev.returnValue = null;
    }
});

// Trigger install creation
ipcMain.on("create install", (ev: IpcMainEvent, install: { folderName: string, installName: string, globalSave: boolean, mod: string }) => {
    windowClosable = false;
    appWindow.setClosable(false);
    console.log("[IPC create install] Creating install in " + install.folderName);
    InstallCreator.createInstall(install.folderName, install.installName, install.globalSave).then(() => {
        if (!install.mod) {
            appWindow.webContents.send("got installs", InstallList.getInstallList());
            windowClosable = true;
            appWindow.setClosable(true);
        } else {
            console.log("[IPC create install] Installing mod " + install.mod + " in " + install.folderName);
            ModInstaller.installMod(install.mod, joinPath(Config.readConfigValue("installFolder"), "installs", install.folderName, "install")).then(() => {
                appWindow.webContents.send("got installs", InstallList.getInstallList());
                windowClosable = true;
                appWindow.setClosable(true);
            }).catch((e: Error) => {
                appWindow.webContents.send("got installs", InstallList.getInstallList());
                showError(
                    lang.translate("main.errors.install.title"),
                    lang.translate("main.errors.install.body"),
                    e.toString(),
                    false
                );
            });
        }
    }).catch((e: Error) => {
        appWindow.webContents.send("got installs", InstallList.getInstallList());
        showError(
            lang.translate("main.errors.install.title"),
            lang.translate("main.errors.install.body"),
            e.toString(),
            false
        );
    });
});

// Rename an install
ipcMain.on("rename install", (ev: IpcMainEvent, options: { folderName: string, newName: string }) => {
    console.log("[IPC rename install] Renaming " + options.folderName);
    InstallManager.renameInstall(options.folderName, options.newName).then(() => {
        console.log("[IPC rename install] Renamed " + options.folderName);
        appWindow.webContents.send("got installs", InstallList.getInstallList());
    }).catch((e: Error) => {
        showError(
            lang.translate("main.errors.rename.title"),
            lang.translate("main.errors.rename.body"),
            e.toString(),
            false
        );
    });
});

// Delete an install permanently
ipcMain.on("delete install", (ev: IpcMainEvent, folderName: string) => {
    console.log("[IPC delete install] Deleting " + folderName);
    InstallManager.deleteInstall(folderName).then(() => {
        console.log("[IPC delete install] Deleted " + folderName);
        appWindow.webContents.send("got installs", InstallList.getInstallList());
    }).catch((e: Error) => {
        showError(
            lang.translate("main.errors.uninstall.title"),
            lang.translate("main.errors.uninstall.body"),
            e.toString(),
            false
        );
    });
});

// Delete a mod
ipcMain.on("delete mod", (ev: IpcMainEvent, fileName: string) => {
    console.log("[IPC delete mod] Deleting " + fileName);
    try {
        unlinkSync(joinPath(Config.readConfigValue("installFolder"), "mods", fileName));
        console.log("[IPC delete mod] Deleted " + fileName);
        appWindow.webContents.send("got modlist", modList.getModList());
    } catch (e) {
        showError(
            lang.translate("main.errors.mod_delete.title"),
            lang.translate("main.errors.mod_delete.body"),
            e.toString(),
            false
        );
    }
});

// Delete a save file for an install
ipcMain.on("delete save", (ev: IpcMainEvent, folderName: string) => {
    console.log("[IPC delete save] Deleting save data for " + folderName);
    InstallManager.deleteSaveData(folderName).then(() => {
        console.log("[IPC delete save] Deleted save data for " + folderName);
        appWindow.webContents.send("got installs", InstallList.getInstallList());
    }).catch((e: Error) => {
        showError(
            lang.translate("main.errors.save_delete.title"),
            lang.translate("main.errors.save_delete.body"),
            e.toString(),
            false
        );
    });
});

// desktop shortcut creation
ipcMain.on("create shortcut", async (ev: IpcMainEvent, options: { folderName: string, installName: string }) => {
    if (process.platform === "win32") {
        const result = await dialog.showSaveDialog(appWindow, {
            title: lang.translate("main.shortcut_dialog.title"),
            defaultPath: options.installName,
            filters: [
                {name: lang.translate("main.shortcut_dialog.file_format_name"), extensions: ["lnk"]}
            ]
        });

        if (result.filePath) {
            console.log("[IPC create shortcut] Writing shortcut to " + result.filePath);
            if (!shell.writeShortcutLink(result.filePath, "create", {
                target: "ddmm://launch-install/" + options.folderName,
                icon: process.execPath,
                iconIndex: 0
            })) {
                showError(
                    lang.translate("main.errors.shortcut.title"),
                    lang.translate("main.errors.shortcut.body"),
                    null,
                    false
                );
            } else {
                console.log("[IPC create shortcut] Written shortcut to " + result.filePath);
            }
        }
    } else if (process.platform === "darwin") {
        // macOS: Create app bundle shortcut
        const result = await dialog.showSaveDialog(appWindow, {
            title: lang.translate("main.shortcut_dialog.title"),
            defaultPath: options.installName,
            filters: [
                {name: "Application", extensions: ["app"]}
            ]
        });

        if (result.filePath) {
            console.log("[IPC create shortcut] Creating macOS app bundle at " + result.filePath);
            try {
                const {createMacOSShortcut} = require("./utils/MacOSShortcut");
                await createMacOSShortcut(result.filePath, options.folderName, options.installName);
                console.log("[IPC create shortcut] Created macOS app bundle at " + result.filePath);
            } catch (error) {
                console.error("[IPC create shortcut] Failed to create macOS shortcut:", error);
                showError(
                    lang.translate("main.errors.shortcut.title"),
                    lang.translate("main.errors.shortcut.body"),
                    error.toString(),
                    false
                );
            }
        }
    } else if (process.platform === "linux") {
        // Linux: Create .desktop file
        const result = await dialog.showSaveDialog(appWindow, {
            title: lang.translate("main.shortcut_dialog.title"),
            defaultPath: options.installName,
            filters: [
                {name: "Desktop Entry", extensions: ["desktop"]}
            ]
        });

        if (result.filePath) {
            console.log("[IPC create shortcut] Creating Linux desktop entry at " + result.filePath);
            try {
                const {createLinuxShortcut} = require("./utils/LinuxShortcut");
                await createLinuxShortcut(result.filePath, options.folderName, options.installName);
                console.log("[IPC create shortcut] Created Linux desktop entry at " + result.filePath);
            } catch (error) {
                console.error("[IPC create shortcut] Failed to create Linux shortcut:", error);
                showError(
                    lang.translate("main.errors.shortcut.title"),
                    lang.translate("main.errors.shortcut.body"),
                    error.toString(),
                    false
                );
            }
        }
    } else {
        dialog.showErrorBox("Shortcut creation not supported", "Shortcut creation is not supported on this platform.");
    }
});

// Check if install exists
ipcMain.on("install exists", (ev: IpcMainEvent, folderName: string) => {
    if (!folderName || typeof folderName !== "string") {
        console.warn("[IPC install exists] Folder name should be a string, received " + typeof folderName);
        ev.returnValue = false;
        return;
    }
    ev.returnValue = InstallManager.installExists(folderName);
});

// move installation folder
ipcMain.on("move install", async () => {
    const result = await dialog.showOpenDialog(appWindow, {
        title: lang.translate("main.move_install.title"),
        properties: ["openDirectory"]
    });

    if (result.filePaths && result.filePaths[0]) {
        appWindow.hide();
        const oldInstallFolder: string = Config.readConfigValue("installFolder");
        const newInstallFolder: string = joinPath(result.filePaths[0], "DDMM_GameData");
        move(oldInstallFolder, newInstallFolder, {overwrite: false}, e => {
            if (e) {
                console.log(e);
                dialog.showErrorBox(lang.translate("main.errors.move_install.title"), lang.translate("main.errors.move_install.body"));
            } else {
                Config.saveConfigValue("installFolder", newInstallFolder);
            }
            app.relaunch();
            app.quit();
        });
    }
});

// Get available backgrounds
ipcMain.on("get backgrounds", (ev: IpcMainEvent) => {
    ev.returnValue = readdirSync(joinPath(__dirname, "../../src/renderer/images/backgrounds"));
});



// Crash for debugging
ipcMain.on("debug crash", () => {
    throw new Error("User forced debug crash with DevTools")
});

// Toggle DevTools
ipcMain.on("toggle devtools", () => {
    if (appWindow && appWindow.webContents) {
        if (appWindow.webContents.isDevToolsOpened()) {
            appWindow.webContents.closeDevTools();
        } else {
            appWindow.webContents.openDevTools({mode: "detach"});
        }
    }
});

// endregion

// region Onboarding

// Manual onboarding trigger for testing
ipcMain.on("trigger onboarding", () => {
    console.log("Main: Manual onboarding trigger received");
    appWindow.webContents.send("start onboarding");
});

// Check onboarding status
ipcMain.on("check onboarding", (event) => {
    const needsOnboarding = OnboardingManager.isOnboardingRequired();
    console.log("Main: Onboarding check requested, result:", needsOnboarding);
    event.returnValue = needsOnboarding;
});

// Import start
ipcMain.on("onboarding browse", async () => {
    console.log("Main: Onboarding browse dialog requested");
    const result = await dialog.showOpenDialog(appWindow, {
        filters: [
            {name: lang.translate("main.game_browse_dialog.file_format_name"), extensions: ["zip"]}
        ],
        title: lang.translate("main.game_browse_dialog.title")
    });

    if (result.filePaths && result.filePaths[0] && result.filePaths[0].endsWith(".zip")) {
        try {
            console.log("Main: Copying selected DDLC file:", result.filePaths[0]);
            copyFileSync(result.filePaths[0], joinPath(Config.readConfigValue("installFolder"), "ddlc.zip"));

            // Check if onboarding is still required after copying
            const stillNeedsOnboarding = OnboardingManager.isOnboardingRequired();
            console.log("Main: After copying, still needs onboarding:", stillNeedsOnboarding);

            if (!stillNeedsOnboarding) {
                console.log("Main: Onboarding completed successfully");

                // Automatically create a default DDLC install
                console.log("Main: Creating default DDLC install...");
                InstallCreator.createInstall("ddlc-default", "Doki Doki Literature Club", false).then(() => {
                    console.log("Main: Default DDLC install created successfully");
                    appWindow.webContents.send("onboarding downloaded");
                    // Refresh the install list
                    appWindow.webContents.send("got installs", InstallList.getInstallList());
                }).catch((error) => {
                    console.error("Main: Failed to create default DDLC install:", error);
                    // Still send onboarding completed event even if install creation fails
                    appWindow.webContents.send("onboarding downloaded");
                });
            } else {
                console.log("Main: Onboarding still required after file copy");
                // TODO: show a message and try again
            }
        } catch (e) {
            console.error("Main: Error copying DDLC file:", e);
            // TODO: catch any FS errors
        }
    } else {
        console.log("Main: No valid file selected for onboarding");
    }
});

ipcMain.on("download mod", (ev, url) => {
    downloadManager.downloadFile(url, joinPath(Config.readConfigValue("installFolder"), "mods"), null, "DOWNLOADED_MOD");
});

// endregion

// region Updates etc.
function showUpdating(status: "checking" | "available" | "downloading" | "downloaded" | "none") {
    if (appWindow && appWindow.webContents) {
        appWindow.webContents.send("updating", status);
    }
}

function checkForUpdate() {
    if (isAppx) return; // don't update if windows store
    showUpdating("checking");
    autoUpdater.checkForUpdatesAndNotify().then(update => {
        console.log(update);
        if (update && semver.gt(update.updateInfo.version, app.getVersion())) {
            showUpdating("available");
        } else {
            showUpdating("none");
        }
    }).catch(err => {
        console.warn("Error checking for updates", err);
        showUpdating("none");
    });
}

autoUpdater.autoDownload = false;

autoUpdater.on("update-downloaded", () => {
    showUpdating("downloaded");
});

ipcMain.on("check update", () => {
    checkForUpdate();
});

ipcMain.on("download update", () => {
    showUpdating("downloading");
    autoUpdater.downloadUpdate();
});

checkForUpdate();

// endregion

// region Global exception handler
process.on("uncaughtException", (e: Error) => {
    console.log("Uncaught exception occurred - treating this as a crash.");
    console.error(e);
    showError(
        lang.translate("main.errors.exception.title"),
        lang.translate("main.errors.exception.body"),
        e.toString(),
        true
    );
});
// endregion

// region App initialisation
function handleURL(forcedArg?: string) {
    // logic for handling various command line arguments
    const url = forcedArg ? forcedArg : lastArg;
    if (url.startsWith("ddmm://")) {
        const command: string = url.split("ddmm://")[1];

        if (command.startsWith("launch-install/")) {
            const installFolder: string = command.split("launch-install/")[1];
            launchInstall(installFolder);
        } else if (command.startsWith("auth-handoff/")) {
            const url = Buffer.from(command.split("auth-handoff/")[1], "base64").toString("utf8");
            appWindow.webContents.send("auth handoff", url);
        }
    }
}

app.on("second-instance", (ev: Event, argv: string[]) => {
    appWindow.restore();
    appWindow.focus();
    handleURL(argv.pop());
});

app.on("ready", async () => {
    console.log("App ready, loading configuration...");

    // Load remote configuration first
    try {
        await appConfig.loadConfig();
        USER_AGENT = `DokiDokiModManager/${appConfig.getVersion()} (${appConfig.get('author')})`;
        console.log("Configuration loaded successfully");
        console.log("USER_AGENT set to:", USER_AGENT);

    } catch (error) {
        console.error("Failed to load configuration:", error);
    }

    // Initialize remote module
    remoteMain.initialize();

    if (!app.requestSingleInstanceLock()) {
        // we should quit, as another instance is running
        console.log("App already running.");
        app.quit();
        return; // avoid running for longer than needed
    }

    if (
        !existsSync(joinPath(Config.readConfigValue("installFolder"), "mods")) ||
        !existsSync(joinPath(Config.readConfigValue("installFolder"), "installs"))
    ) {
        console.log("Creating directory structure");
        mkdirpSync(joinPath(Config.readConfigValue("installFolder"), "mods"));
        mkdirpSync(joinPath(Config.readConfigValue("installFolder"), "installs"));
    }

    // set protocol handler
    app.setAsDefaultProtocolClient("ddmm");

    // create browser window
    const preloadPath = joinPath(__dirname, "../../src/renderer/js-preload/preload.js");
    console.log("Main: Preload script path:", preloadPath);
    console.log("Main: Preload script exists:", existsSync(preloadPath));
    console.log("Main: __dirname:", __dirname);

    appWindow = new BrowserWindow({
        title: `${appConfig.getName()} v${appConfig.getVersion()}`,
        width: 1280,
        height: 800,
        minWidth: 1000,
        minHeight: 600,
        maximizable: true,
        frame: !!Config.readConfigValue("systemBorders"),
        useContentSize: true,
        transparent: true, // Enable transparency for rounded corners
        backgroundColor: '#00000000', // Transparent background
        webPreferences: {
            contextIsolation: false,
            sandbox: false,
            nodeIntegration: false,
            webSecurity: true, // Enable web security for better security posture
            allowRunningInsecureContent: false, // Prevent running insecure content
            preload: preloadPath // contains all the IPC scripts
        },
        titleBarStyle: "hiddenInset",
        show: false
    });

    // Enable remote module for this window
    remoteMain.enable(appWindow.webContents);

    // Listen for console messages from renderer process
    appWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        console.log(`Renderer Console [${level}]: ${message} (${sourceId}:${line})`);
    });

    // Activate download manager
    downloadManager = new DownloadManager(appWindow);

    // ...and the mod list
    modList = new ModList(downloadManager);

    downloadManager.on("download progress", (data: { filename: string, downloaded: number, total: number, startTime: number, meta?: any }) => {
        appWindow.webContents.send("download progress", data);
    });

    downloadManager.on("download stalled", (data: { filename: string, downloaded: number, total: number, startTime: number, meta?: any }) => {
        appWindow.webContents.send("download stalled", data);
    });

    downloadManager.on("download started", () => {
        appWindow.webContents.send("got modlist", modList.getModList());
    });

    downloadManager.on("download complete", () => {
        appWindow.webContents.send("got modlist", modList.getModList());
    });

    downloadManager.on("download failed", () => {
        appWindow.webContents.send("got modlist", modList.getModList());
    });

    // set user agent so web services can contact me if necessary
    console.log("Setting User-Agent to:", USER_AGENT);
    appWindow.webContents.setUserAgent(USER_AGENT);

    appWindow.webContents.on("will-navigate", (ev, url) => {
        console.warn("Prevented navigation from app container", url);
        ev.preventDefault(); // prevent navigation
    });

    appWindow.webContents.on("did-finish-load", () => {
        console.log("Main: Window did-finish-load event fired");

        // Check if preload script executed successfully
        appWindow.webContents.executeJavaScript('typeof ddmm !== "undefined"')
            .then(ddmmExists => {
                console.log("Main: DDMM object exists in renderer:", ddmmExists);
                if (!ddmmExists) {
                    console.error("Main: DDMM object not found - preload script may have failed");
                }
            })
            .catch(err => {
                console.error("Main: Failed to check DDMM object:", err);
            });

        if (!appWindow.isVisible()) {
            appWindow.show();
        }

        appWindow.webContents.send("is appx", isAppx);
        appWindow.webContents.send("debug info", {
            "Platform": process.platform,
            "Node Environment": process.env.NODE_ENV || "none",
            "Background": Config.readConfigValue("background"),
            "Node Version": process.version,
            "Electron Version": process.versions.electron,
            "Chrome Version": process.versions.chrome,
            "Locale": app.getLocale(),
            "Install Folder": Config.readConfigValue("installFolder"),
            "AppX": isAppx
        });

        // Check onboarding requirements immediately
        console.log("Main: Checking onboarding requirements...");
        const needsOnboarding = OnboardingManager.isOnboardingRequired();
        console.log("Main: Onboarding required:", needsOnboarding);

        if (needsOnboarding) {
            console.log("Main: Sending 'start onboarding' event to renderer");
            appWindow.webContents.send("start onboarding");

            // Also send it with a delay as a backup
            setTimeout(() => {
                console.log("Main: Sending backup 'start onboarding' event");
                appWindow.webContents.send("start onboarding");
            }, 1000);
        } else {
            console.log("Main: No onboarding required, proceeding normally");
        }
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

    appWindow.on("close", e => {
        if (downloadManager.hasDownloads() || !windowClosable) {
            e.preventDefault();
        }
    });

    appWindow.on("closed", () => {
        appWindow = null;
        app.quit();
    });

    appWindow.webContents.once("did-finish-load", () => {
        handleURL();
    });

    appWindow.setMenu(null);

    if (process.env.DDMM_DEVTOOLS) {
        appWindow.webContents.openDevTools({mode: "detach"});
    }

    appWindow.loadFile(joinPath(__dirname, "../../src/renderer/html/index.html"));

    if (!Config.readConfigValue("installFolder", true)) {
        Config.saveConfigValue("installFolder", Config.readConfigValue("installFolder"));
    }
});
// endregion

// Backup an install to a zip file
ipcMain.on("backup install", async (ev: IpcMainEvent, {folderName, outPath}) => {
    try {
        await InstallManager.backupInstall(folderName, outPath);
        ev.returnValue = { success: true };
    } catch (e) {
        ev.returnValue = { success: false, error: e.toString() };
    }
});

// Restore an install from a zip file
ipcMain.on("restore install", async (ev: IpcMainEvent, {zipPath, folderName}) => {
    try {
        await InstallManager.restoreInstall(zipPath, folderName);
        ev.returnValue = { success: true };
    } catch (e) {
        ev.returnValue = { success: false, error: e.toString() };
    }
});

// Show a save dialog and return the result
ipcMain.handle("showSaveDialog", async (ev, options) => {
    const result = await dialog.showSaveDialog(appWindow, options);
    return result;
});

// Show an open dialog and return the result
ipcMain.handle("showOpenDialog", async (ev, options) => {
    const result = await dialog.showOpenDialog(appWindow, options);
    return result;
});
