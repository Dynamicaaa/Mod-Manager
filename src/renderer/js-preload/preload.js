/*
    The preload script contains all of the IPC logic to communicate with the main process.
    It avoids exposing node context to the renderer process which could lead to e.g. self-XSS

    THIS CODE HAS FULL ACCESS TO THE NODE.JS RUNTIME! Be careful.
 */

const {ipcRenderer} = require("electron");
const remote = require("@electron/remote");
const EventEmitter = remote.require("events");
// Get app config from main process via IPC
let appConfig;
let fullConfig;
try {
    // Get the full config from the main process via IPC
    console.log("Preload: Requesting full config from main process...");
    fullConfig = ipcRenderer.sendSync("get app config");
    console.log("Preload: Received full config:", fullConfig);

    // Also get individual values for backwards compatibility
    console.log("Preload: Requesting version from main process...");
    const version = ipcRenderer.sendSync("get app version");
    console.log("Preload: Received version:", version);

    console.log("Preload: Requesting name from main process...");
    const name = ipcRenderer.sendSync("get app name");
    console.log("Preload: Received name:", name);

    appConfig = {
        getVersion: () => version || "0.0.0",
        getName: () => name || "Doki Doki Mod Manager"
    };

    // Expose full config as window.APP_CONFIG for renderer compatibility
    if (fullConfig) {
        window.APP_CONFIG = fullConfig;
        console.log("Exposed full config as window.APP_CONFIG:", window.APP_CONFIG);
    }

    console.log("Loaded app config via IPC successfully");
    console.log("Final appConfig.getVersion():", appConfig.getVersion());
} catch (e) {
    console.warn("Could not load app config via IPC:", e);
    // Fallback
    appConfig = {
        getVersion: () => "0.0.0",
        getName: () => "Doki Doki Mod Manager"
    };
    // Fallback config
    window.APP_CONFIG = {
        name: "Doki Doki Mod Manager",
        version: "0.0.0",
        description: "Mod Manager for Doki Doki Literature Club",
        author: "Dynamicaaa"
    };
}
const path = remote.require("path");

// Try to require file-url, but provide fallback if it fails (ES module issue)
let fileUrl;
try {
    fileUrl = remote.require("file-url");
} catch (e) {
    console.warn("Could not load file-url module:", e.message);
    // Provide a simple fallback implementation
    fileUrl = (filePath) => {
        if (process.platform === 'win32') {
            return 'file:///' + filePath.replace(/\\/g, '/');
        } else {
            return 'file://' + filePath;
        }
    };
}

const api = new EventEmitter();

// Ready flag for Firebase auth state
let ready = false;

api.mods = {};
api.app = {};
api.window = {};
api.config = {};
api.onboarding = {};

// Called when the UI wants to refresh the mod list
api.mods.refreshModList = function () {
    ipcRenderer.send("get modlist");
};

// Called when the UI wants to refresh the install list
api.mods.refreshInstallList = function () {
    ipcRenderer.send("get installs");
};

// Open a browse dialog for mods to be imported
api.mods.browseForMod = function () {
    return ipcRenderer.sendSync("browse mods");
};

// Launches an install
api.mods.launchInstall = function (folderName) {
    if (!ready) return;

    ipcRenderer.send("launch install", folderName);
};

// Creates an install
api.mods.createInstall = function (options) {
    ipcRenderer.send("create install", options);
};

// File exists?
api.mods.installExists = function (folderName) {
    return ipcRenderer.sendSync("install exists", folderName);
};

// Download mod
api.mods.download = function (url) {
    ipcRenderer.send("download mod", url);
};

// Fires an event on the DDMM object when the mod list has been retrieved
ipcRenderer.on("got modlist", (ev, list) => {
    api.emit("mod list", list);
});

// Fires an event on the DDMM object when the install list has been retrieved
ipcRenderer.on("got installs", (ev, list) => {
    api.emit("install list", list);
});

// Fires an event when the running cover should be shown / hidden
ipcRenderer.on("running cover", (ev, data) => {
    console.log("Running cover updated", data);
    api.emit("running cover", data);
});

// Restart the app
api.app.restart = function () {
    ipcRenderer.send("restart");
};

// Open URL in browser
api.app.openURL = function (url) {
    ipcRenderer.send("open url", url);
};

// Show file in file manager
api.app.showFile = function (path) {
    ipcRenderer.send("show file", path);
};

// Crash the app, for testing
api.app.crash = function () {
    ipcRenderer.send("debug crash");
};

// Localisation function
api.translate = function (key, ...args) {
    try {
        const result = ipcRenderer.sendSync("translate", {
            "key": key,
            "args": args
        });
        console.log(`Translation for "${key}":`, result);
        return result || key; // fallback to key if translation fails
    } catch (e) {
        console.warn(`Translation failed for "${key}":`, e);
        return key; // fallback to key if IPC fails
    }
};

// Path to URL conversion
api.pathToFile = fileUrl;

// Close window
api.window.close = function () {
    try {
        remote.getCurrentWindow().close();
    } catch (e) {
        console.error("Failed to close window:", e);
    }
};

// Maximise or restore window
api.window.maximise = function () {
    try {
        const currentWindow = remote.getCurrentWindow();
        if (currentWindow.isMaximized()) {
            currentWindow.restore();
        } else {
            currentWindow.maximize();
        }
    } catch (e) {
        console.error("Failed to maximize/restore window:", e);
    }
};

// Minimise window
api.window.minimise = function () {
    try {
        remote.getCurrentWindow().minimize();
    } catch (e) {
        console.error("Failed to minimize window:", e);
    }
};

// Prompt
api.window.prompt = function (data) {
    api.emit("prompt", data);
};

// Input
api.window.input = function (data) {
    api.emit("input", data);
};

// Show right click for install
api.window.handleInstallRightClick = function (folderName, installName, mouseX, mouseY) {
    remote.Menu.buildFromTemplate([
        {
            label: api.translate("renderer.tab_mods.install_contextmenu.launch"), click: () => {
                api.mods.launchInstall(folderName)
            }, accelerator: "enter"
        },
        {type: "separator"},
        {
            label: api.translate("renderer.tab_mods.install_contextmenu.rename"), click: () => {
                api.emit("input", {
                    title: api.translate("renderer.tab_mods.rename_input.message"),
                    description: api.translate("renderer.tab_mods.rename_input.details", installName),
                    button_affirmative: api.translate("renderer.tab_mods.rename_input.button_affirmative"),
                    button_negative: api.translate("renderer.tab_mods.rename_input.button_negative"),
                    callback: (newName) => {
                        if (newName) {
                            api.mods.renameInstall(folderName, newName);
                        }
                    }
                });
            },
            accelerator: "F2"
        },
        {
            label: api.translate("renderer.tab_mods.install_contextmenu.shortcut"), click: () => {
                api.mods.createShortcut(folderName, installName)
            },
            enabled: api.platform === "win32"
        },
        {type: "separator"},
        {
            label: api.translate("renderer.tab_mods.install_contextmenu.delete_save"),
            click: () => {
                api.emit("prompt", {
                    title: api.translate("renderer.tab_mods.save_delete_confirmation.message"),
                    description: api.translate("renderer.tab_mods.save_delete_confirmation.details", installName),
                    affirmative_style: "danger",
                    button_affirmative: api.translate("renderer.tab_mods.save_delete_confirmation.button_affirmative"),
                    button_negative: api.translate("renderer.tab_mods.save_delete_confirmation.button_negative"),
                    callback: (uninstall) => {
                        if (uninstall) {
                            api.mods.deleteSaveData(folderName);
                        }
                    }
                });
            }
        },
        {
            label: api.translate("renderer.tab_mods.install_contextmenu.uninstall"),
            accelerator: "delete",
            click: () => {
                api.emit("prompt", {
                    title: api.translate("renderer.tab_mods.uninstall_confirmation.message"),
                    description: api.translate("renderer.tab_mods.uninstall_confirmation.details", installName),
                    affirmative_style: "danger",
                    button_affirmative: api.translate("renderer.tab_mods.uninstall_confirmation.button_affirmative"),
                    button_negative: api.translate("renderer.tab_mods.uninstall_confirmation.button_negative"),
                    callback: (uninstall) => {
                        if (uninstall) {
                            api.mods.deleteInstall(folderName);
                            ddmm.emit("create install");
                        }
                    }
                });
            }
        }
    ]).popup({
        x: mouseX,
        y: mouseY
    });
};

// Show right click for mod
api.window.handleModRightClick = function (filename, mouseX, mouseY) {
    remote.Menu.buildFromTemplate([
        {
            label: api.translate("renderer.tab_mods.mod_contextmenu.install"), accelerator: "enter", click: () => {
                ddmm.emit("create install", filename);
            }
        },
        {type: "separator"},
        {
            label: api.translate("renderer.tab_mods.mod_contextmenu.delete"), accelerator: "delete", click: () => {
                api.window.prompt({
                    title: api.translate("renderer.tab_mods.mod_delete_confirmation.message"),
                    description: api.translate("renderer.tab_mods.mod_delete_confirmation.details"),
                    affirmative_style: "danger",
                    button_affirmative: api.translate("renderer.tab_mods.mod_delete_confirmation.button_affirmative"),
                    button_negative: api.translate("renderer.tab_mods.mod_delete_confirmation.button_negative"),
                    callback: (del) => {
                        if (del) {
                            api.mods.deleteMod(filename);
                            ddmm.emit("create install");
                        }
                    }
                });
            }
        }
    ]).popup({
        x: mouseX,
        y: mouseY
    });
};

// Change a setting in config
api.config.saveConfigValue = function (k, v) {
    ipcRenderer.send("save config", {"key": k, "value": v});
};

// Read a setting from config
api.config.readConfigValue = function (k) {
    return ipcRenderer.sendSync("read config", k);
};

// Delete install
api.mods.renameInstall = function (folderName, newName) {
    ipcRenderer.send("rename install", {folderName, newName});
};

// Delete install
api.mods.deleteInstall = function (folderName) {
    ipcRenderer.send("delete install", folderName);
};

// Delete mod
api.mods.deleteMod = function (fileName) {
    ipcRenderer.send("delete mod", fileName);
};

// Delete save data
api.mods.deleteSaveData = function (folderName) {
    ipcRenderer.send("delete save", folderName);
};

// Create shortcut
api.mods.createShortcut = function (folderName, installName) {
    ipcRenderer.send("create shortcut", {folderName, installName});
};



// User menu
api.app.showUserMenu = function (x, y) {
    remote.Menu.buildFromTemplate([
        {
            label: api.translate("renderer.user_menu.option_rename"), click: () => {
                api.emit("change username")
            }
        },
        {
            label: api.translate("renderer.user_menu.option_logout"), click: () => {
                api.emit("logout");
            }
        }
    ]).popup({x, y})
};

// Move install folder
api.app.beginMoveInstall = function () {
    ipcRenderer.send("move install");
};

// Get available backgrounds
api.app.getBackgrounds = function () {
    return ipcRenderer.sendSync("get backgrounds");
};

// Toggle DevTools
api.app.toggleDevTools = function () {
    ipcRenderer.send("toggle devtools");
};



// Handler for crashes / errors
ipcRenderer.on("error message", (ev, data) => {
    api.emit("error", data);
});

// Handler for DDLC crashes
ipcRenderer.on("ddlc-crash", (ev, data) => {
    console.log("DDLC crash detected:", data);
    api.emit("ddlc-crash", data);
});

// Send crash dialog actions to main process
api.app.sendCrashAction = function(action) {
    ipcRenderer.send("crash-dialog-action", action);
};

// Handler for debug info
ipcRenderer.on("debug info", (ev, data) => {
    api.debug = data;
});

// Handler for updates
ipcRenderer.on("updating", (ev, status) => {
    api.emit("updating", status);
});

api.app.downloadUpdate = function () {
    ipcRenderer.send("download update");
};

// Onboarding flow trigger
ipcRenderer.on("start onboarding", () => {
    api.emit("start onboarding");
});

// Check for updates
api.app.update = function () {
    ipcRenderer.send("check update");
};

// Onboarding download

api.onboarding.browseForGame = function () {
    ipcRenderer.send("onboarding browse");
};

api.onboarding.triggerOnboarding = function () {
    ipcRenderer.send("trigger onboarding");
};

api.onboarding.checkOnboarding = function () {
    return ipcRenderer.sendSync("check onboarding");
};

ipcRenderer.on("download progress", (_, data) => {
    api.emit("download progress", data);
});

ipcRenderer.on("download stalled", (_, data) => {
    api.emit("download stalled", data);
});

ipcRenderer.on("onboarding downloaded", () => {
    api.emit("onboarding downloaded");
});

ipcRenderer.on("onboarding download failed", () => {
    api.emit("onboarding download failed");
});

ipcRenderer.on("auth handoff", (_, url) => {
    api.emit("auth handoff", url);
});

ipcRenderer.on("get save url", (ev, filename) => {
    api.emit("get save url", filename);
    api.on("got save url", url => {
        ipcRenderer.send("got save url", url);
    });
});

ipcRenderer.on("upload save", (ev, data) => {
    api.emit("upload save", data);
});

ipcRenderer.on("lock save", (ev, fn) => {
    api.emit("lock save", fn);
});

ipcRenderer.on("unlock save", (ev, fn) => {
    api.emit("unlock save", fn);
});

// Winstore Appx UI handling
ipcRenderer.on("is appx", (_, is) => {
    api.emit("is appx", is);
});

// Application version
api.version = appConfig.getVersion();

// Application name
api.appName = appConfig.getName();

// System platform
api.platform = process.platform;

// Environment variables
api.env = process.env;

// Join paths
api.joinPath = path.join;

// Is absolute
api.isAbsolute = path.isAbsolute;

// Set ready flag when Firebase auth is ready
api.setReady = function(isReady) {
    ready = isReady;
};

// make the API visible to the renderer
global.ddmm = api;

console.log("DDMM preload script loaded successfully");
console.log("DDMM API object:", api);
console.log("App config loaded:", {
    name: appConfig.getName(),
    version: appConfig.getVersion()
});

// Emit a custom event to notify that ddmm is ready
setTimeout(() => {
    const version = appConfig.getVersion();
    const event = new CustomEvent('ddmm-ready', {
        detail: {
            version: version,
            name: appConfig.getName()
        }
    });
    window.dispatchEvent(event);
    console.log("Dispatched ddmm-ready event with version:", version);

    // Also try to update Vue app version directly if the app is available
    if (typeof window.app !== 'undefined' && window.app.app_version !== undefined) {
        console.log("Directly updating Vue app version to:", version);
        window.app.app_version = version;
    } else {
        console.log("Vue app not available yet, will retry...");
        // Retry a few times in case the Vue app isn't available yet
        let retries = 0;
        const maxRetries = 10;
        const retryInterval = setInterval(() => {
            retries++;
            if (typeof window.app !== 'undefined' && window.app.app_version !== undefined) {
                console.log("Directly updating Vue app version to:", version, "(retry", retries, ")");
                window.app.app_version = version;
                clearInterval(retryInterval);
            } else if (retries >= maxRetries) {
                console.warn("Failed to update Vue app version after", maxRetries, "retries");
                clearInterval(retryInterval);
            }
        }, 100);
    }
}, 0);

console.info(`%cWarning! This is the developer console!

Before you type anything here, make sure you know what you're doing. Certain commands could do damage to your game installs or even your computer.`,
    "font-size: 16px");