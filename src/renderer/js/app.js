console.log("Starting app.js initialization...");
console.log("ddmm object available:", typeof ddmm !== 'undefined');
console.log("ddmm.config available:", typeof ddmm !== 'undefined' && typeof ddmm.config !== 'undefined');
console.log("ddmm.version available:", typeof ddmm !== 'undefined' && typeof ddmm.version !== 'undefined');
console.log("ddmm.version value:", typeof ddmm !== 'undefined' ? ddmm.version : 'ddmm not available');

// Global function to update version from external sources
window.updateAppVersion = function(version) {
    console.log("updateAppVersion called with:", version);
    if (window.app && version && version !== "0.0.0") {
        window.app.app_version = version;
        console.log("Updated app version to:", version);
    }
};

console.log("Creating Vue app...");
const app = new Vue({
    "el": "#app",
    "data": {
        "appx": false,
        "onboarding": false,
        "background_image": (typeof ddmm !== 'undefined' && ddmm.config) ? ddmm.config.readConfigValue("background") : "none",
        "editInstanceComponent": null,
        "pendingInstanceData": null,
        "app_name": (function() {
            // Try to get name from standalone config first
            if (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.name) {
                console.log("Got name from standalone config:", window.APP_CONFIG.name);
                return window.APP_CONFIG.name;
            }
            console.log("No standalone name available, using fallback");
            return "Doki Doki Mod Manager";
        })(),
        "app_version": (function() {
            // Try to get version from standalone config first
            if (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.version) {
                console.log("Got version from standalone config:", window.APP_CONFIG.version);
                return window.APP_CONFIG.version;
            }
            // Fallback to standalone version
            if (typeof window.APP_VERSION !== 'undefined') {
                console.log("Got version from standalone version:", window.APP_VERSION);
                return window.APP_VERSION;
            }
            console.log("No standalone version available, using fallback");
            return "0.0.0";
        })(),
        "system_platform": (typeof ddmm !== 'undefined') ? ddmm.platform : "unknown",
        "app_updating": "none",
        "discord_status": { connected: false, enabled: false },
        "sayonika_maintenance_mode": false, // Reactive flag for Sayonika maintenance status
        "tab": "mods",
        "previousTab": "mods",
        "pageTransition": "fade",
        "system_borders": (typeof ddmm !== 'undefined' && ddmm.config) ? ddmm.config.readConfigValue("systemBorders") : false,
        "dropping_mod": false,
        "announcement": {
            "active": false,
            "title": "",
            "description": "",
            "url": ""
        },
        "tabs": [
            {"id": "mods", "name": "Mods", "component": "ddmm-mods-tab"},
            {"id": "store", "name": "Sayonika Store", "component": "ddmm-store-placeholder-tab"},
            {"id": "options", "name": "Options", "component": "ddmm-options-tab"},
            {"id": "about", "name": "About", "component": "ddmm-about-tab"},
            {"id": "edit-instance", "name": "Edit Instance", "component": "ddmm-edit-instance-tab", "hidden": true}
        ],
        "running_cover": {
            "display": false,
            "title": "",
            "description": "",
            "dismissable": false
        },
        "crash_cover": {
            "display": false,
            "title": "",
            "description": "",
            "fatal": false,
            "stacktrace": ""
        },
        "prompt_cover": {
            "display": false,
            "title": "",
            "description": "",
            "affirmative_style": "primary",
            "button_affirmative": "",
            "button_negative": "",
            "callback": null
        },
        "input_cover": {
            "display": false,
            "title": "",
            "description": "",
            "button_affirmative": "",
            "button_negative": "",
            "input": "",
            "callback": null
        },
        "ddlc_crash_dialog": {
            "display": false,
            "folderName": "",
            "crashInfo": null,
            "message": "",
            "installPath": ""
        },
        "maintenance_cover": {
            "display": false,
            "title": "Sayonika Maintenance",
            "message": "",
            "estimatedTime": null
        }
    },
    "computed": {
        "currentTabComponent": function () {
            return this.tabs.find(t => t.id === this.tab).component;
        },
        "backgroundImageStyle": function () {
            if (this.background_image && this.background_image !== "none") {
                return "radial-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.99) 90%), url(../images/backgrounds/" + this.background_image + ")";
            } else {
                return "linear-gradient(#111, #111)";
            }
        },
        "backgroundImageCrashStyle": function () {
            if (this.background_image && this.background_image !== "none") {
                return "radial-gradient(rgba(64, 0, 0, 0.5), rgba(64, 0, 0, 0.99) 90%), url(../images/backgrounds/" + this.background_image + ")";
            } else {
                return "linear-gradient(rgb(64, 0, 0), rgb(64, 0, 0))";
            }
        },
        "flashAnnouncement": function () {
            return localStorage.getItem("last_announcement") !== this.announcement.title;
        }
    },
    "methods": {
        "_": function(key, ...args) {
            if (typeof ddmm !== 'undefined' && ddmm.translate) {
                try {
                    return ddmm.translate(key, ...args);
                } catch (e) {
                    console.warn("Translation failed for", key, e);
                    return this.getFallbackTranslation(key, ...args);
                }
            }
            return this.getFallbackTranslation(key, ...args);
        },
        "getFallbackTranslation": function(key, ...args) {
            // Fallback translations for common UI elements
            const fallbacks = {
                "renderer.tabs.tab_mods": "Mods",
                "renderer.tabs.tab_store": "Sayonika Store",
                "renderer.tabs.tab_options": "Options",
                "renderer.tabs.tab_about": "About",
                "renderer.window_controls.close": "Close",
                "renderer.window_controls.maximise": "Maximize",
                "renderer.window_controls.minimise": "Minimize",
                "renderer.window_controls.devtools": "Toggle Developer Tools (F12)",
                "renderer.window_controls.help": "Help",
                "renderer.window_controls.login": "Log In",
                "renderer.onboarding.title": "Welcome!",
                "renderer.onboarding.description_download": "Let's find a copy of DDLC.",
                "renderer.onboarding.button_download": "Visit DDLC's official download page",
                "renderer.onboarding.button_choose": "Browse for a copy",
                "renderer.onboarding.heading_step": "Step {0}",
                "renderer.onboarding.s1_desc": "You need to download a copy of Doki Doki Literature Club.",
                "renderer.onboarding.s2_desc": "Once your download has finished, select it using the button below.",
                "renderer.onboarding.description_location": "Your games will be stored at {0}",
                "renderer.onboarding.link_change": "(Change)"
            };

            let translation = fallbacks[key] || key;

            // Handle string interpolation for fallback translations
            if (args.length > 0) {
                translation = translation.replace(/{(\d+)}/g, (match, index) => {
                    const argIndex = parseInt(index);
                    return args[argIndex] !== undefined ? args[argIndex] : match;
                });
            }

            return translation;
        },

        "windowClose": function() {
            console.log("Window close clicked");
            try {
                if (typeof ddmm !== 'undefined' && ddmm.window && ddmm.window.close) {
                    ddmm.window.close();
                } else if (typeof require !== 'undefined') {
                    const {remote} = require("@electron/remote");
                    remote.getCurrentWindow().close();
                } else {
                    console.warn("Window close function not available");
                }
            } catch (error) {
                console.error("Error closing window:", error);
            }
        },
        "windowMinimise": function() {
            console.log("Window minimize clicked");
            try {
                if (typeof ddmm !== 'undefined' && ddmm.window && ddmm.window.minimise) {
                    ddmm.window.minimise();
                } else if (typeof require !== 'undefined') {
                    const {remote} = require("@electron/remote");
                    remote.getCurrentWindow().minimize();
                } else {
                    console.warn("Window minimize function not available");
                }
            } catch (error) {
                console.error("Error minimizing window:", error);
            }
        },
        "windowMaximise": function() {
            console.log("Window maximize clicked");
            try {
                if (typeof ddmm !== 'undefined' && ddmm.window && ddmm.window.maximise) {
                    ddmm.window.maximise();
                } else if (typeof require !== 'undefined') {
                    const {remote} = require("@electron/remote");
                    const currentWindow = remote.getCurrentWindow();
                    if (currentWindow.isMaximized()) {
                        currentWindow.restore();
                    } else {
                        currentWindow.maximize();
                    }
                } else {
                    console.warn("Window maximize function not available");
                }
            } catch (error) {
                console.error("Error maximizing window:", error);
            }
        },
        "restart": function() {
            console.log("App restart clicked");
            try {
                if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.restart) {
                    ddmm.app.restart();
                } else if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");
                    ipcRenderer.send("restart");
                } else {
                    console.warn("App restart function not available");
                }
            } catch (error) {
                console.error("Error restarting app:", error);
            }
        },
        "openURL": (typeof ddmm !== 'undefined' && ddmm.app) ? ddmm.app.openURL : () => {},
        "downloadUpdate": (typeof ddmm !== 'undefined' && ddmm.app) ? ddmm.app.downloadUpdate : () => {},
        "showFile": (typeof ddmm !== 'undefined' && ddmm.app) ? ddmm.app.showFile : () => {},
        "toggleDevTools": function() {
            console.log("DevTools toggle clicked");
            try {
                if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.toggleDevTools) {
                    ddmm.app.toggleDevTools();
                } else if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");
                    ipcRenderer.send("toggle devtools");
                } else {
                    console.warn("DevTools toggle function not available");
                }
            } catch (error) {
                console.error("Error toggling DevTools:", error);
            }
        },
        "setBackground": function (image) {
            this.background_image = image;
        },

        // Page transition methods
        "navigateToTab": function(tabId, transition = "fade") {
            if (this.tab === tabId) return;

            this.previousTab = this.tab;
            this.pageTransition = transition;
            this.tab = tabId;
        },

        // Refresh tab names when language changes
        "refreshTabNames": function() {
            console.log("Refreshing tab names with current translations");
            this.tabs.forEach(tab => {
                switch(tab.id) {
                    case "mods":
                        tab.name = this._("renderer.tabs.tab_mods");
                        break;
                    case "store":
                        tab.name = this._("renderer.tabs.tab_store");
                        break;
                    case "options":
                        tab.name = this._("renderer.tabs.tab_options");
                        break;
                    case "about":
                        tab.name = this._("renderer.tabs.tab_about");
                        break;
                    case "edit-instance":
                        // This tab name doesn't need translation as it's a technical term
                        tab.name = "Edit Instance";
                        break;
                }
            });
            console.log("Tab names refreshed:", this.tabs.map(tab => `${tab.id}: ${tab.name}`));
        },

        "showEditInstance": function(instanceData) {
            console.log("showEditInstance called with data:", instanceData);

            // Store the instance data for when the component is ready
            this.pendingInstanceData = instanceData;

            // Navigate to edit instance page with slide transition
            this.navigateToTab("edit-instance", "slide-left");

            // Try to pass instance data to the edit component if it's already available
            this.$nextTick(() => {
                this.trySetInstanceData();
            });
        },

        "trySetInstanceData": function() {
            if (!this.pendingInstanceData) return;

            const editComponent = this.editInstanceComponent;
            console.log("trySetInstanceData - Found edit component:", editComponent);

            if (editComponent && editComponent.setInstanceData) {
                editComponent.setInstanceData(this.pendingInstanceData);
                console.log("Instance data set successfully");
                this.pendingInstanceData = null; // Clear pending data
            } else {
                console.log("Edit component not ready yet, data will be set when component mounts");
            }
        },

        "goBackFromEdit": function() {
            // Navigate back to mods tab with slide transition
            this.navigateToTab("mods", "slide-right");
        },
        "closePrompt": function (yes) {
            this.prompt_cover.callback(!!yes);
            this.prompt_cover.display = false;
        },
        "closeInput": function (input) {
            this.input_cover.callback(input);
            this.input_cover.display = false;
        },

        // DDLC Crash Dialog methods
        "showCrashDialog": function(crashData) {
            console.log("Showing DDLC crash dialog:", crashData);
            this.ddlc_crash_dialog = {
                display: true,
                folderName: crashData.folderName,
                crashInfo: crashData.crashInfo,
                message: crashData.message,
                installPath: crashData.installPath
            };
        },

        "closeCrashDialog": function() {
            this.ddlc_crash_dialog.display = false;
        },

        "relaunchDDLC": function() {
            console.log("Relaunching DDLC:", this.ddlc_crash_dialog.folderName);
            if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.sendCrashAction) {
                ddmm.app.sendCrashAction({
                    type: 'relaunch',
                    folderName: this.ddlc_crash_dialog.folderName
                });
            }
            this.closeCrashDialog();
        },

        "backToMenu": function() {
            console.log("Going back to menu after crash");
            if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.sendCrashAction) {
                ddmm.app.sendCrashAction({
                    type: 'back-to-menu'
                });
            }
            this.closeCrashDialog();
        },

        "getCrashTypeDescription": function() {
            if (!this.ddlc_crash_dialog.crashInfo) return "Unknown error";

            const crashInfo = this.ddlc_crash_dialog.crashInfo;
            switch (crashInfo.type) {
                case 'process_error':
                    return `Process error: ${crashInfo.error}`;
                case 'abnormal_exit':
                    if (crashInfo.signal) {
                        return `Terminated by signal: ${crashInfo.signal}`;
                    } else {
                        return `Abnormal exit with code: ${crashInfo.exitCode}`;
                    }
                default:
                    return "Unknown crash type";
           }
       },

       // Maintenance mode methods
       "showMaintenanceMode": function(maintenanceData) {
           console.log("Showing maintenance mode dialog:", maintenanceData);
           this.maintenance_cover = {
               display: true,
               title: "Sayonika Maintenance",
               message: "Sayonika is temporarily unavailable for maintenance. You can still browse and manage your installed mods while we work on getting the store back online.",
               estimatedTime: maintenanceData.estimatedTime
           };
       },

       "closeMaintenanceMode": function() {
           this.maintenance_cover.display = false;
       },

       "getMaintenanceTimeText": function() {
           if (!this.maintenance_cover.estimatedTime) return null;
           try {
               const estimatedTime = new Date(this.maintenance_cover.estimatedTime);
               return `Expected completion: ${estimatedTime.toLocaleString()}`;
           } catch (error) {
               return `Expected completion: ${this.maintenance_cover.estimatedTime}`;
           }
       },
        "showInstallMod": function (mod) {
            this.tab = "mods";
            this.$nextTick(() => {
                ddmm.emit("create install", mod);
            });
        },

        "showUserMenu": function (ev) {
            ddmm.app.showUserMenu(ev.clientX, ev.clientY);
        },
        "showSayonikaLogin": function () {
            // Switch to store tab first
            this.tab = 'store';
            this.$nextTick(() => {
                // Find the store tab component by looking for the component with showLogin method
                const findStoreTab = (component) => {
                    if (component && component.showLogin && typeof component.showLogin === 'function') {
                        return component;
                    }
                    if (component.$children) {
                        for (let child of component.$children) {
                            const found = findStoreTab(child);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const storeTab = findStoreTab(this);
                if (storeTab) {
                    storeTab.showLogin();
                } else {
                    console.warn('Could not find Sayonika store tab component');
                }
            });
        },
        "showSayonikaUserMenu": function (ev) {
            // Show a simple user menu for Sayonika
            const user = this.getSayonikaUser();
            if (user) {
                ddmm.window.prompt({
                    title: `Sayonika User: ${user.display_name || user.username}`,
                    description: `Logged in as ${user.username}`,
                    affirmative_style: "danger",
                    button_affirmative: "Logout",
                    button_negative: "Cancel",
                    callback: (logout) => {
                        if (logout) {
                            this.logoutFromSayonika();
                        }
                    }
                });
            }
        },
        "getSayonikaUser": function () {
            try {
                // Use the centralized authentication manager
                if (typeof window.SayonikaAuth !== 'undefined' && window.SayonikaAuth.getUser) {
                    return window.SayonikaAuth.getUser();
                }

                // Fallback to old method if auth manager not available
                const findStoreTab = (component) => {
                    if (component && component.user !== undefined && component.showLogin && typeof component.showLogin === 'function') {
                        return component;
                    }
                    if (component.$children) {
                        for (let child of component.$children) {
                            const found = findStoreTab(child);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const storeTab = findStoreTab(this);
                return storeTab ? storeTab.user : null;
            } catch (error) {
                console.warn('Error getting Sayonika user:', error);
                return null;
            }
        },
        "isSayonikaInMaintenance": function () {
            // Use the reactive maintenance flag for Vue reactivity
            // This is updated by the event listeners when maintenance status changes
            console.log('isSayonikaInMaintenance check (reactive):', this.sayonika_maintenance_mode);
            return Boolean(this.sayonika_maintenance_mode);
        },
        "logoutFromSayonika": function () {
            // Use the centralized authentication manager
            if (typeof window.SayonikaAuth !== 'undefined') {
                window.SayonikaAuth.logout();
                return;
            }

            // Fallback to old method if auth manager not available
            const findStoreTab = (component) => {
                if (component && component.logout && typeof component.logout === 'function' && component.showLogin) {
                    return component;
                }
                if (component.$children) {
                    for (let child of component.$children) {
                        const found = findStoreTab(child);
                        if (found) return found;
                    }
                }
                return null;
            };

            const storeTab = findStoreTab(this);
            if (storeTab) {
                storeTab.logout();
            }
        },
        "viewAnnouncement": function () {
            localStorage.setItem("last_announcement", this.announcement.title);
            ddmm.window.prompt({
                title: this.announcement.title,
                description: this.announcement.description,
                affirmative_style: "primary",
                button_affirmative: ddmm.translate("renderer.announcement.button_open"),
                button_negative: ddmm.translate("renderer.announcement.button_close"),
                callback: (open) => {
                    if (open) {
                        ddmm.app.openURL(this.announcement.url);
                    }
                }
            });
        },


        "getVersionDirectly": function () {
            // Method 0: Try standalone app config (most reliable)
            if (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.version && window.APP_CONFIG.version !== "0.0.0") {
                console.log("Got version from standalone app config:", window.APP_CONFIG.version);
                this.app_version = window.APP_CONFIG.version;
                return true;
            }

            // Method 0.5: Try standalone version file
            if (typeof window.APP_VERSION !== 'undefined' && window.APP_VERSION !== "0.0.0") {
                console.log("Got version from standalone version file:", window.APP_VERSION);
                this.app_version = window.APP_VERSION;
                return true;
            }

            // Method 1: Try ddmm object
            if (typeof ddmm !== 'undefined' && typeof ddmm.version !== 'undefined' && ddmm.version && ddmm.version !== "0.0.0") {
                console.log("Got version from ddmm:", ddmm.version);
                this.app_version = ddmm.version;
                return true;
            }

            // Method 2: Try direct IPC call using require (if available in renderer)
            try {
                if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");
                    const version = ipcRenderer.sendSync("get app version");
                    if (version && version !== "0.0.0") {
                        console.log("Got version from direct IPC:", version);
                        this.app_version = version;
                        return true;
                    }
                }
            } catch (e) {
                console.warn("Direct IPC failed:", e);
            }

            // Method 3: Try accessing electron via window.require (alternative)
            try {
                if (typeof window.require !== 'undefined') {
                    const {ipcRenderer} = window.require("electron");
                    const version = ipcRenderer.sendSync("get app version");
                    if (version && version !== "0.0.0") {
                        console.log("Got version from window.require IPC:", version);
                        this.app_version = version;
                        return true;
                    }
                }
            } catch (e) {
                console.warn("Window.require IPC failed:", e);
            }

            // Method 4: Try accessing via global electron object
            try {
                if (typeof window.electron !== 'undefined' && window.electron.ipcRenderer) {
                    const version = window.electron.ipcRenderer.sendSync("get app version");
                    if (version && version !== "0.0.0") {
                        console.log("Got version from window.electron:", version);
                        this.app_version = version;
                        return true;
                    }
                }
            } catch (e) {
                console.warn("Window.electron IPC failed:", e);
            }

            // Method 5: Use hardcoded version as last resort
            console.error("All version detection methods failed, using fallback version 0.0.0");
            this.app_version = "0.0.0"; // Fallback when all methods fail
            return false; // Return false to indicate failure
        }
    },
    "watch": {
        "onboarding": function(newVal, oldVal) {
            console.log("Vue: onboarding state changed from", oldVal, "to", newVal);
        }
    },
    "mounted": function () {
        console.log("Vue app mounted, trying multiple methods to get version...");
        console.log("Initial onboarding state:", this.onboarding);

        // Try to get version immediately using all available methods
        const success = this.getVersionDirectly();
        console.log("Initial version retrieval success:", success, "Version:", this.app_version);

        // If we didn't get the version, set up periodic retries
        if (!success || this.app_version === "0.0.0") {
            console.log("Setting up periodic version checks...");
            let attempts = 0;
            const maxAttempts = 50;
            const intervalId = setInterval(() => {
                attempts++;
                console.log(`Version check attempt ${attempts}...`);

                const success = this.getVersionDirectly();

                if (success && this.app_version !== "0.0.0") {
                    console.log("Successfully got version:", this.app_version);
                    clearInterval(intervalId);
                } else if (attempts >= maxAttempts) {
                    console.warn("Max attempts reached, final version:", this.app_version);
                    clearInterval(intervalId);
                }
            }, 100);
        }

        // Also listen for the ddmm-ready event as a backup
        window.addEventListener('ddmm-ready', (event) => {
            console.log("Received ddmm-ready event:", event.detail);
            if (event.detail && event.detail.version && event.detail.version !== "0.0.0") {
                console.log("Updating app_version from event to:", event.detail.version);
                this.app_version = event.detail.version;
            }
        });

        // Add a fallback check for onboarding after a delay
        setTimeout(() => {
            console.log("Fallback onboarding check - current state:", this.onboarding);
            if (!this.onboarding) {
                console.log("Onboarding not shown yet, checking if it should be...");
                // This is a fallback - the main process should have already sent the event
                // but if there was a timing issue, we can manually trigger it
                if (typeof ddmm !== 'undefined' && ddmm.emit) {
                    console.log("Manually checking onboarding requirements...");
                    // We can't directly call the main process function, but we can listen for events
                }
            }
        }, 2000); // Wait 2 seconds after mount

        // Initialize tab names with current translations
        this.refreshTabNames();

        // Listen for language changes to update tab names
        if (typeof ddmm !== 'undefined' && ddmm.on) {
            ddmm.on('language-changed', (newLanguage) => {
                console.log("Language changed, refreshing tab names for language:", newLanguage);
                this.refreshTabNames();
                this.$forceUpdate(); // Force Vue to re-render with updated tab names
            });
        }

        // Also listen for the language-changed event on window (fallback)
        window.addEventListener('language-changed', (event) => {
            console.log("Window language-changed event received:", event.detail);
            this.refreshTabNames();
            this.$forceUpdate();
        });
    }
});

// Make the Vue app instance available globally
window.app = app;

// Global Theme Manager
window.ThemeManager = {
    applyUITheme: function(theme) {
        const body = document.body;

        // Remove existing theme classes
        const themeClasses = ['ddlc-theme', 'classic-theme', 'monika-theme', 'sayori-theme',
                            'natsuki-theme', 'yuri-theme', 'cyberpunk-theme', 'retro-theme',
                            'midnight-theme', 'sunset-theme'];
        body.classList.remove(...themeClasses);

        // Add new theme class
        if (theme === 'classic') {
            body.classList.add('classic-theme');
        } else if (theme === 'monika') {
            body.classList.add('monika-theme');
        } else if (theme === 'sayori') {
            body.classList.add('sayori-theme');
        } else if (theme === 'natsuki') {
            body.classList.add('natsuki-theme');
        } else if (theme === 'yuri') {
            body.classList.add('yuri-theme');
        } else if (theme === 'cyberpunk') {
            body.classList.add('cyberpunk-theme');
        } else if (theme === 'retro') {
            body.classList.add('retro-theme');
        } else if (theme === 'midnight') {
            body.classList.add('midnight-theme');
        } else if (theme === 'sunset') {
            body.classList.add('sunset-theme');
        } else {
            body.classList.add('ddlc-theme');
        }

        console.log("ThemeManager: Applied UI theme:", theme);
    },

    loadUITheme: function() {
        try {
            let savedTheme = "ddlc"; // Default to DDLC theme

            if (typeof ddmm !== 'undefined' && ddmm.config) {
                savedTheme = ddmm.config.readConfigValue("uiTheme") || "ddlc";
            } else if (typeof require !== 'undefined') {
                const {ipcRenderer} = require("electron");
                savedTheme = ipcRenderer.sendSync("read config", "uiTheme") || "ddlc";
            }

            this.applyUITheme(savedTheme);
            console.log("ThemeManager: Loaded UI theme:", savedTheme);
            return savedTheme;
        } catch (error) {
            console.error("ThemeManager: Error loading UI theme:", error);
            // Default to DDLC theme on error
            this.applyUITheme("ddlc");
            return "ddlc";
        }
    }
};

// Load theme immediately when the script loads
console.log("Loading initial theme...");
window.ThemeManager.loadUITheme();

// Also try to load theme when ddmm becomes available
function setupThemeLoading(retryCount = 0) {
    const maxRetries = 20; // 2 seconds with 100ms intervals

    if (typeof ddmm !== 'undefined' && ddmm.config) {
        console.log("DDMM config available, reloading theme...");
        window.ThemeManager.loadUITheme();
        return;
    }

    if (retryCount < maxRetries) {
        setTimeout(() => setupThemeLoading(retryCount + 1), 100);
    }
}

// Start theme loading retry
setupThemeLoading();

function allowKeyEvents() {
    return !(document.querySelectorAll(".cover").length > 0);
}

if (typeof ddmm !== 'undefined' && ddmm.env && ddmm.env.DDMM_INCOGNITO) {
    app.app_name = "App Name";
}

// Set up basic event listeners if ddmm is available
if (typeof ddmm !== 'undefined' && ddmm.on) {
    ddmm.on("running cover", cover => {
        app.running_cover.display = cover.display;
        app.running_cover.title = cover.title;
        app.running_cover.description = cover.description;
        app.running_cover.dismissable = cover.dismissable;
        app.running_cover.folder_path = cover.folder_path;
    });

    ddmm.on("error", error => {
        app.crash_cover.display = true;
        app.crash_cover.title = error.title;
        app.crash_cover.description = error.body;
        app.crash_cover.fatal = error.fatal;
        app.crash_cover.stacktrace = error.stacktrace;
    });

    ddmm.on("updating", is => {
        app.app_updating = is;
    });
}

// Set up additional event listeners if ddmm is available
if (typeof ddmm !== 'undefined' && ddmm.on) {
    ddmm.on("prompt", data => {
        app.prompt_cover.display = true;
        app.prompt_cover.title = data.title;
        app.prompt_cover.description = data.description;
        app.prompt_cover.affirmative_style = data.affirmative_style || "primary";
        app.prompt_cover.button_negative = data.button_negative;
        app.prompt_cover.button_affirmative = data.button_affirmative;
        app.prompt_cover.callback = data.callback;
    });

    ddmm.on("input", data => {
        app.input_cover.display = true;
        app.input_cover.title = data.title;
        app.input_cover.description = data.description;
        app.input_cover.button_negative = data.button_negative;
        app.input_cover.button_affirmative = data.button_affirmative;
        app.input_cover.callback = data.callback;
        app.input_cover.input = "";
        app.$nextTick(() => {
            app.$refs.input_cover_field.focus();
        });
    });
}

document.body.addEventListener("dragenter", ev => {
    app.dropping_mod = true;
    ev.preventDefault();
});

// Add keyboard shortcut for DevTools (F12 and Ctrl+Shift+I)
document.addEventListener("keydown", ev => {
    // Check if any modal/cover is open
    if (document.querySelectorAll(".cover").length > 0) {
        return; // Don't handle shortcuts when modals are open
    }

    // F12 key
    if (ev.key === "F12") {
        ev.preventDefault();
        app.toggleDevTools();
    }

    // Ctrl+Shift+I (common DevTools shortcut)
    if (ev.ctrlKey && ev.shiftKey && ev.key === "I") {
        ev.preventDefault();
        app.toggleDevTools();
    }
});

let ready = false;

ready = true;
if (typeof ddmm !== 'undefined' && ddmm.setReady) {
    ddmm.setReady(true);
}

// Onboarding management
window.OnboardingManager = {
    showOnboarding: function() {
        console.log("OnboardingManager: Showing onboarding");
        if (window.app) {
            window.app.onboarding = true;
            window.app.$forceUpdate();
            console.log("OnboardingManager: Onboarding state set to true");
        } else {
            console.warn("OnboardingManager: Vue app not available yet");
        }
    },

    hideOnboarding: function() {
        console.log("OnboardingManager: Hiding onboarding");
        if (window.app) {
            window.app.onboarding = false;
            window.app.$forceUpdate();
            console.log("OnboardingManager: Onboarding state set to false");
        }
    }
};

// Function to set up DDMM event listeners
function setupDDMMEventListeners(retryCount = 0) {
    const maxRetries = 50; // 5 seconds with 100ms intervals

    console.log(`Setting up DDMM event listeners... (attempt ${retryCount + 1}/${maxRetries})`);
    console.log("ddmm available:", typeof ddmm !== 'undefined');
    console.log("ddmm.on available:", typeof ddmm !== 'undefined' && typeof ddmm.on === 'function');

    // Additional debugging information
    if (typeof ddmm !== 'undefined') {
        console.log("ddmm object keys:", Object.keys(ddmm));
        console.log("ddmm.on type:", typeof ddmm.on);
    } else {
        console.log("window object keys:", Object.keys(window));
        console.log("window.ddmm:", typeof window.ddmm);
        console.log("Looking for ddmm in window object...");
    }

    if (typeof ddmm === 'undefined' || typeof ddmm.on !== 'function') {
        if (retryCount >= maxRetries) {
            console.error(`DDMM failed to initialize after ${maxRetries} attempts (${maxRetries * 100}ms). Some features may not work properly.`);
            console.error("This could indicate a problem with the preload script or Electron context isolation.");
            return;
        }

        console.warn(`DDMM not ready, will retry in 100ms (attempt ${retryCount + 1}/${maxRetries})`);
        setTimeout(() => setupDDMMEventListeners(retryCount + 1), 100);
        return;
    }

    console.log("DDMM is ready, setting up event listeners");

    // Critical onboarding event listeners - set up first
    ddmm.on("start onboarding", () => {
        console.log("DDMM Event: Received 'start onboarding' event");
        window.OnboardingManager.showOnboarding();
    });

    ddmm.on("onboarding downloaded", () => {
        console.log("DDMM Event: Received 'onboarding downloaded' event");
        window.OnboardingManager.hideOnboarding();
    });

    // DDLC crash dialog event listener
    ddmm.on("ddlc-crash", (crashData) => {
        console.log("DDMM Event: Received 'ddlc-crash' event", crashData);
        if (window.app && window.app.showCrashDialog) {
            window.app.showCrashDialog(crashData);
        } else {
            console.error("App or showCrashDialog method not available");
        }
    });

    ddmm.on("is appx", is => {
        app.appx = is;
    });

    // Language change event listener
    ddmm.on('language-changed', (newLanguage) => {
        console.log("DDMM Event: Language changed to:", newLanguage);
        if (window.app && window.app.refreshTabNames) {
            window.app.refreshTabNames();
            window.app.$forceUpdate();
        }
    });

    console.log("All DDMM event listeners set up successfully");
}

// Function to set up Sayonika authentication event listeners
function setupSayonikaAuthListeners() {
    if (typeof window.SayonikaAuth !== 'undefined') {
        console.log("Setting up Sayonika authentication event listeners");

        // Listen for authentication state changes
        window.SayonikaAuth.on('auth-status-changed', (user) => {
            console.log('Sayonika auth status changed:', user ? user.username : 'logged out');
            if (window.app) {
                // Force Vue to update the navigation bar
                window.app.$forceUpdate();
            }
        });

        window.SayonikaAuth.on('login', (user) => {
            console.log('Sayonika user logged in:', user.username);
            if (window.app) {
                window.app.$forceUpdate();
            }
        });

        window.SayonikaAuth.on('logout', () => {
            console.log('Sayonika user logged out');
            if (window.app) {
                window.app.$forceUpdate();
            }
        });

        // Listen for maintenance mode events
        window.SayonikaAuth.on('maintenance-mode-blocked', (maintenanceData) => {
            console.log('Sayonika login blocked due to maintenance mode:', maintenanceData);
            if (window.app) {
                // Update the reactive maintenance flag
                window.app.sayonika_maintenance_mode = Boolean(maintenanceData.isInMaintenance);
                console.log('Updated reactive maintenance flag to:', window.app.sayonika_maintenance_mode);
                
                window.app.showMaintenanceMode(maintenanceData);
            }
        });

        window.SayonikaAuth.on('maintenance-mode-changed', (maintenanceData) => {
            console.log('Sayonika maintenance mode status changed:', maintenanceData);
            if (window.app) {
                // Update the reactive maintenance flag
                window.app.sayonika_maintenance_mode = Boolean(maintenanceData.isInMaintenance);
                console.log('Updated reactive maintenance flag to:', window.app.sayonika_maintenance_mode);
                
                if (maintenanceData.isInMaintenance) {
                    window.app.showMaintenanceMode(maintenanceData);
                } else {
                    window.app.closeMaintenanceMode();
                }
                // Force update is no longer needed since we're using reactive data
            }
        });

        window.SayonikaAuth.on('maintenance-mode-detected', (maintenanceData) => {
            console.log('Sayonika maintenance mode detected on startup:', maintenanceData);
            if (window.app) {
                // Update the reactive maintenance flag
                window.app.sayonika_maintenance_mode = Boolean(maintenanceData.isInMaintenance);
                console.log('Updated reactive maintenance flag to:', window.app.sayonika_maintenance_mode);
                
                window.app.showMaintenanceMode(maintenanceData);
            }
        });

        window.SayonikaAuth.on('maintenance-mode-initial-check-complete', (maintenanceData) => {
            console.log('Sayonika initial maintenance check complete:', maintenanceData);
            if (window.app) {
                // Update the reactive maintenance flag based on initial check
                window.app.sayonika_maintenance_mode = Boolean(maintenanceData.isInMaintenance);
                console.log('Updated reactive maintenance flag to:', window.app.sayonika_maintenance_mode);
                console.log('Vue app updated after initial maintenance check');
            }
        });

        console.log("Sayonika authentication event listeners set up successfully");
    } else {
        console.warn("SayonikaAuth not available, retrying in 100ms");
        setTimeout(setupSayonikaAuthListeners, 100);
    }
}

// Try to set up event listeners immediately
setupDDMMEventListeners();
setupSayonikaAuthListeners();

// Also listen for the ddmm-ready event as a backup
window.addEventListener('ddmm-ready', (event) => {
    console.log("Received ddmm-ready event, ensuring event listeners are set up");
    // Reset retry count since ddmm should be ready now
    setupDDMMEventListeners(0);

    // Also reload theme now that ddmm is ready
    console.log("DDMM ready, reloading theme...");
    window.ThemeManager.loadUITheme();
});

// Window animation functionality has been removed

// Simplified titlebar drag functionality
function setupTitlebarDragListeners() {
    const titlebar = document.querySelector('.titlebar');
    if (titlebar) {
        titlebar.addEventListener('mousedown', (e) => {
            // Only trigger on left mouse button and if clicking on draggable area
            if (e.button === 0 && window.getComputedStyle(e.target)['-webkit-app-region'] === 'drag') {
                console.log("Titlebar drag started");
            }
        });
        
        console.log("Titlebar drag listeners set up successfully");
    } else {
        console.log("Titlebar not found, will retry after DOM load...");
        // Try again after DOM is fully loaded
        document.addEventListener('DOMContentLoaded', setupTitlebarDragListeners);
    }
}

// Initialize simplified titlebar functionality
setupTitlebarDragListeners();

// Add global functions for testing onboarding
window.testOnboarding = function() {
    console.log("Manual onboarding test triggered");
    window.OnboardingManager.showOnboarding();
};

window.checkOnboardingStatus = function() {
    if (typeof ddmm !== 'undefined' && ddmm.onboarding && ddmm.onboarding.checkOnboarding) {
        const status = ddmm.onboarding.checkOnboarding();
        console.log("Onboarding status check:", status);
        return status;
    } else {
        console.warn("DDMM onboarding API not available");
        return null;
    }
};

window.triggerOnboardingFromMain = function() {
    if (typeof ddmm !== 'undefined' && ddmm.onboarding && ddmm.onboarding.triggerOnboarding) {
        console.log("Triggering onboarding from main process");
        ddmm.onboarding.triggerOnboarding();
    } else {
        console.warn("DDMM onboarding API not available");
    }
};