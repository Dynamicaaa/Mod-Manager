const ModsTab = Vue.component("ddmm-mods-tab", {
    "template": `
<div class="page-content">
    <div class="mod-viewer-pane">
        <div class="mod-viewer-mod-list">
            <div class="ddlc-search-container">
                <input type="text" class="small ddlc-search" :placeholder="_('renderer.tab_mods.list.placeholder_search') + ' ♡'" autofocus @keydown="_searchEscapeHandler" @input="onSearchInput" @focus="search = ''" v-model="search">
                <i class="fas fa-search ddlc-search-icon"></i>
            </div>
            <br>
            <div class="mod-view-mod-list-title">
                <i class="fas fa-plus-circle"></i>
                {{_("renderer.tab_mods.list.header_new")}}
            </div>
            <div
                :class="{'mod-view-mod-list-entry': true, 'active': selected_item.type === 'create', 'ddlc-create-entry': true}"
                @click="showCreateInstall()">
                <i class="fas fa-download"></i>
                {{_("renderer.tab_mods.list.link_install")}}
            </div>
            <br>
            <div class="mod-view-mod-list-title" v-if="searchResultsInstalls.length > 0">
                <i class="fas fa-heart"></i>
                {{_("renderer.tab_mods.list.header_installed")}}
            </div>
            <div
                :class="{'mod-view-mod-list-entry': true, 'active': selected_item.id === install.folderName && selected_item.type === 'install'}"
                 v-for="install in searchResultsInstalls"
                  @dblclick="launchInstall(install.folderName)"
                  @mouseup="handleInstallClick(install.folderName, install.name, $event)"
                  :title="getPathToInstall(install.folderName)"
                  >
                  <span>{{install.name}}</span>
                  <div class="mod-view-mod-list-entry-buttons">
                      <span class="mod-view-mod-list-entry-button edit-button" @click.stop="editInstall(install)" title="Edit Instance">
                          <i class="fas fa-edit"></i>
                      </span>
                  </div>
            </div>
            <br v-if="searchResultsInstalls.length > 0">
            <div class="mod-view-mod-list-title" v-if="searchResultsMods.length > 0">{{_("renderer.tab_mods.list.header_downloaded")}}</div>
            <div
                :class="{'mod-view-mod-list-entry': true, 'active': selected_item.id === mod.filename && selected_item.type === 'mod', 'disabled': mod.downloading}"
                v-for="mod in searchResultsMods"
                @mouseup="handleModClick(mod.filename, mod.downloading, $event)"
                @dblclick="showCreateInstall(getPathToMod(mod.filename))"
                :title="getPathToMod(mod.filename)"
                >
                <span><i class="fas fa-spinner fa-spin fa-fw" v-if="mod.downloading"></i> {{mod.filename}}</span>
                <span class="mod-view-mod-list-entry-button" @click="handleModSettingsClick(mod.filename, $event)"><i class="fas fa-cog"></i></span>
                </div>
        </div>
        <div class="mod-viewer-mod-display">
            <div v-if="selected_item.type === 'install' && selectedInstall">
                <h1>{{selectedInstall.name}} <span class="tag" v-if="selectedInstall.globalSave">{{_("renderer.tab_mods.install.tag_global_save")}}</span> <span class="tag" v-if="selectedInstall.mod && selectedInstall.mod.uses_sdk">{{_("renderer.tab_mods.install.tag_sdk")}}</span></h1>
                <p>{{getPathToInstall(selectedInstall.folderName)}} <a href="javascript:;" @click="openFolder(getPathToInstall(selectedInstall.folderName))"  :title="_('renderer.tab_mods.mod.description_external')"><i class="fas fa-external-link-alt"></i></a></p>

                <br>

                <p>
                    <button class="success" @click="launchInstall(selectedInstall.folderName)"><i class="fas fa-play fa-fw"></i> {{_("renderer.tab_mods.install.button_launch")}}</button>
                    <button class="primary" @click="editInstall(selectedInstall)"><i class="fas fa-edit fa-fw"></i> Edit Instance</button>
                </p>

                <br>

                <template v-if="selectedInstall.mod">
                    <h2>{{selectedInstall.mod.name}}</h2>
                    <p><strong>{{_("renderer.tab_mods.install.description_author", selectedInstall.mod.author)}}</strong></p>
                    <br>
                    <p>{{selectedInstall.mod.description}}</p>

                    <template v-if="selectedInstall.mod.website || selectedInstall.mod.discord">
                        <br>

                        <p v-if="selectedInstall.mod.website"><a href="javascript:;" @click="openURL(selectedInstall.mod.website)"><i class="fas fa-fw fa-globe"></i> {{_("renderer.tab_mods.install.link_website", selectedInstall.mod.website)}}</a></p>
                        <p v-if="selectedInstall.mod.discord"><a href="javascript:;" @click="openURL('https://discord.gg/' + selectedInstall.mod.discord)"><i class="fab fa-fw fa-discord"></i> {{_("renderer.tab_mods.install.link_discord", "discord.gg/" + selectedInstall.mod.discord)}}</a></p>
                    </template>

                    <br>
                </template>

                <h2 v-if="selectedInstall.screenshots.length > 1">{{_("renderer.tab_mods.install.title_screenshots", selectedInstall.screenshots.length)}}</h2>
                <h2 v-else-if="selectedInstall.screenshots.length === 1">{{_("renderer.tab_mods.install.title_screenshots_one")}}</h2>
                <h2 v-else>{{_("renderer.tab_mods.install.title_screenshots_none")}}</h2>
                <p>{{_("renderer.tab_mods.install.description_screenshots")}}</p>

                <br>

                <div class="screenshots" v-if="selectedInstall.screenshots.length > 0">
                    <!--suppress RequiredAttributes, HtmlRequiredAltAttribute -->
                    <img v-for="img in selectedInstall.screenshots" :alt="img" :src="getURLToScreenshot(selectedInstall.folderName, img)" @click="openScreenshot(selectedInstall.folderName, img)" width="150">
                </div>

                <template v-if="selectedInstall.achievements">
                    <h2>{{_("renderer.tab_mods.install.title_achievements", selectedInstall.achievements.filter(a => a.earned).length, selectedInstall.achievements.length)}}</h2>
                    <p v-if="selectedInstall.achievements.filter(a => a.earned).length < selectedInstall.achievements.length">{{_("renderer.tab_mods.install.description_achievements")}}</p>
                    <p v-else>{{_("renderer.tab_mods.install.description_achievements_complete")}}</p>

                    <template v-for="achievement in selectedInstall.achievements">
                        <br>

                        <div :style="{'color': !achievement.earned ? '#777' : 'inherit'}">
                            <p><strong>{{achievement.name}}</strong></p>
                            <p>{{achievement.description}}</p>
                        </div>

                    </template>

                    <br>
                </template>
            </div>
            <div v-else-if="selected_item.type === 'mod'">
                <h1>{{selected_item.id}}</h1>
                <p>{{getPathToMod(selected_item.id)}} <a href="javascript:;" @click="openFolder(getPathToMod(selected_item.id))" :title="_('renderer.tab_mods.mod.description_external')"><i class="fas fa-external-link-alt"></i></a></p>

                <br>

                <p>
                    <button class="success" @click="showCreateInstall(getPathToMod(selected_item.id))"><i class="fas fa-bolt fa-fw"></i>  {{_("renderer.tab_mods.mod.button_install")}}</button>
                    <button class="secondary" @click="handleModSettingsClick(selected_item.id, $event)"><i class="fas fa-cog fa-fw"></i>  {{_("renderer.tab_mods.mod.button_settings")}}</button>
                </p>
            </div>
            <div v-else-if="selected_item.type === 'create'">
                <h1>{{_("renderer.tab_mods.install_creation.title")}}</h1>

                <p></p>

                <div class="form-group">
                    <p><label>{{_("renderer.tab_mods.install_creation.label_install_name")}}</label></p>
                    <p><input type="text" :placeholder="_('renderer.tab_mods.install_creation.label_install_name')" v-model="install_creation.install_name" @keyup="generateInstallFolderName"></p>
                </div>

                <div class="form-group">
                    <p><label>{{_("renderer.tab_mods.install_creation.label_folder_name")}}</label></p>
                    <p><input type="text" :placeholder="_('renderer.tab_mods.install_creation.label_folder_name')" v-model="install_creation.folder_name"></p>
                </div>

                <p v-if="!is_installing && install_creation.folder_name.length > 2 && installExists(install_creation.folder_name)">
                    <strong>{{_("renderer.tab_mods.install_creation.status_exists")}}</strong>
                </p>

                <div class="form-group">
                    <p><label><input type="checkbox" v-model="install_creation.has_mod"> {{_("renderer.tab_mods.install_creation.label_has_mod")}}</label></p>
                </div>

                <div class="form-group" v-if="install_creation.has_mod">
                    <p><label>{{_("renderer.tab_mods.install_creation.label_mod")}}</label></p>
                    <p><input type="text" :placeholder="_('renderer.tab_mods.install_creation.description_mod')" v-model="install_creation.mod" readonly @click="installCreationSelectMod" style="cursor: pointer;"></p>
                </div>

                <!-- Cloud save option removed -->

                <div class="form-group">
                    <p><label><input type="checkbox" v-model="install_creation.global_save"> {{_("renderer.tab_mods.install_creation.label_global_save")}}</label></p>
                </div>

                <p>
                    <strong>{{_("renderer.tab_mods.install_creation.header_summary")}}</strong>
                    <br>
                    <template v-if="install_creation.has_mod">
                        <span v-if="install_creation.global_save">{{_("renderer.tab_mods.install_creation.description_modded_global_save")}}</span>
                        <span v-else>{{_("renderer.tab_mods.install_creation.description_modded")}}</span>
                    </template>
                    <template v-else>
                        <span v-if="install_creation.global_save">{{_("renderer.tab_mods.install_creation.description_vanilla_global_save")}}</span>
                        <span v-else>{{_("renderer.tab_mods.install_creation.description_vanilla")}}</span>
                    </template>

                </p>

                <div v-if="is_installing" class="form-group"><button class="primary" disabled><i class="fas fa-spinner fa-spin fa-fw"></i> {{_("renderer.tab_mods.install_creation.button_installing")}}</button></div>

                <div v-else class="form-group"><button class="primary" @click="createInstallSubmit" :disabled="shouldDisableCreation"><i class="fas fa-bolt fa-fw"></i> {{_("renderer.tab_mods.install_creation.button_install")}}</button></div>
            </div>
        </div>
    </div>
</div>
   `,
    "data": function () {
        return {
            "installs": [],
            "mods": [],
            "is_installing": false,
            "selected_item": {
                "id": "",
                "type": ""
            },
            "install_creation": {
                "install_name": "",
                "folder_name": "",
                "global_save": false,
                "has_mod": false,
                "mod": ""
            },
            "search": "",
            "searchTimeout": null,
            "_fuseMods": null,
            "_fuseInstalls": null
        }
    },
    "methods": {
        "_": function(key, ...args) {
            if (typeof ddmm !== 'undefined' && ddmm.translate) {
                try {
                    return ddmm.translate(key, ...args);
                } catch (e) {
                    console.warn("Translation failed for", key, e);
                    return this.getFallbackTranslation(key);
                }
            }
            return this.getFallbackTranslation(key);
        },
        "getFallbackTranslation": function(key) {
            const fallbacks = {
                "renderer.tab_mods.list.placeholder_search": "Search mods...",
                "renderer.tab_mods.list.header_new": "Get Started",
                "renderer.tab_mods.list.link_install": "Install DDLC",
                "renderer.tab_mods.list.header_installed": "Installed",
                "renderer.tab_mods.list.header_downloaded": "Downloads",
                "renderer.tab_mods.install.button_launch": "Launch",
                "renderer.tab_mods.install.button_settings": "Settings",

                "renderer.tab_mods.install.tag_global_save": "Global Save",
                "renderer.tab_mods.install.tag_sdk": "SDK",
                "renderer.tab_mods.install.description_author": "Created by {0}",
                "renderer.tab_mods.install.link_website": "Website ({0})",
                "renderer.tab_mods.install.link_discord": "Discord ({0})",
                "renderer.tab_mods.install.title_screenshots": "{0} screenshots",
                "renderer.tab_mods.install.title_screenshots_one": "1 screenshot",
                "renderer.tab_mods.install.title_screenshots_none": "No screenshots",
                "renderer.tab_mods.install.description_screenshots": "Press S while playing to take a screenshot.",
                "renderer.tab_mods.install.title_achievements": "Achievements ({0} / {1})",
                "renderer.tab_mods.install.description_achievements": "Keep playing to unlock more achievements.",
                "renderer.tab_mods.install.description_achievements_complete": "You've unlocked all achievements. Congratulations!",
                "renderer.tab_mods.mod.button_install": "Install",
                "renderer.tab_mods.mod.button_settings": "Settings",
                "renderer.tab_mods.mod.description_external": "Show in folder",
                "renderer.tab_mods.install_creation.title": "Install DDLC",
                "renderer.tab_mods.install_creation.label_install_name": "Install Name",
                "renderer.tab_mods.install_creation.label_folder_name": "Folder Name",
                "renderer.tab_mods.install_creation.label_has_mod": "Install Mod",
                "renderer.tab_mods.install_creation.label_mod": "Mod",
                "renderer.tab_mods.install_creation.description_mod": "Click to browse for a mod.",
                // Cloud save translations removed
                "renderer.tab_mods.install_creation.label_existing_saves": "Existing Save Files",
                "renderer.tab_mods.install_creation.label_global_save": "Global Save",
                "renderer.tab_mods.install_creation.header_summary": "Summary",
                "renderer.tab_mods.install_creation.description_vanilla": "A clean copy of DDLC will be created. The save data will be separate from any other copy of the game.",
                "renderer.tab_mods.install_creation.description_vanilla_global_save": "A clean copy of DDLC will be created. The save data will be shared with other copies of the game (e.g. Steam)",

                "renderer.tab_mods.install_creation.description_modded": "A copy of DDLC will be created, and the mod will be installed. The save data will be separate from any other copy of the game.",
                "renderer.tab_mods.install_creation.description_modded_global_save": "A copy of DDLC will be created, and the mod will be installed. The save data will be shared with other copies of the game (e.g. Steam)",

                "renderer.tab_mods.install_creation.button_install": "Install",
                "renderer.tab_mods.install_creation.button_installing": "Installing...",
                "renderer.tab_mods.install_creation.status_exists": "That folder already exists. Pick another folder name.",
                // Cloud save launch confirmations removed
                // Cloud save offline confirmation translations removed
            };
            return fallbacks[key] || key;
        },
        "installExists": (typeof ddmm !== 'undefined' && ddmm.mods) ? ddmm.mods.installExists : () => false,
        "browseForMod": (typeof ddmm !== 'undefined' && ddmm.mods) ? ddmm.mods.browseForMod : () => null,
        "openURL": (typeof ddmm !== 'undefined' && ddmm.app) ? ddmm.app.openURL : () => {},
        // isSaveLocked function removed - cloud saves disabled
        "showCreateInstall": function (mod) {
            this.install_creation.has_mod = !!mod;
            this.install_creation.mod = mod || "";
            if (this.selected_item.type === "create") return;
            this.install_creation.install_name = "";
            this.install_creation.folder_name = "";
            this.install_creation.global_save = false;
            this.selectItem("", "create");
        },
        "selectItem": function (id, type) {
            if (this.selected_item.id === id && this.selected_item.type === type) return;
            this.selected_item.id = id;
            this.selected_item.type = type;
            sessionStorage.setItem("mod_list_last_id", id);
            sessionStorage.setItem("mod_list_last_type", type);
        },
        "handleInstallClick": function (installFolder, installName, ev) {
            this.selectItem(installFolder, "install");
            if (ev.button === 2) {
                ddmm.window.handleInstallRightClick(installFolder, installName, ev.clientX, ev.clientY);
            }
        },
        "editInstall": function(install) {
            console.log("editInstall called with:", install);
            // Navigate to edit instance page
            if (typeof window.app !== 'undefined' && window.app.showEditInstance) {
                window.app.showEditInstance(install);
            } else {
                console.error("window.app or showEditInstance not available");
            }
        },
        "handleModClick": function (filename, downloading, ev) {
            if (downloading) return;
            this.selectItem(filename, "mod");
            if (ev.button === 2) {
                ddmm.window.handleModRightClick(filename, ev.clientX, ev.clientY);
            }
        },
        "handleModSettingsClick": function (filename, ev) {
            ddmm.window.handleModRightClick(filename, ev.clientX, ev.clientY);
        },
        "getPathToInstall": function (installFolder) {
            return ddmm.joinPath(ddmm.config.readConfigValue("installFolder"), "installs", installFolder);
        },
        "getPathToMod": function (mod) {
            return ddmm.isAbsolute(mod) ? mod : ddmm.joinPath(ddmm.config.readConfigValue("installFolder"), "mods", mod);
        },
        "getURLToScreenshot": function (installFolder, filename) {
            return ddmm.pathToFile(ddmm.joinPath(ddmm.config.readConfigValue("installFolder"), "installs", installFolder, "install", filename)) + "?" + Math.random();
        },
        "openScreenshot": function (installFolder, filename) {
            ddmm.app.showFile(ddmm.joinPath(ddmm.config.readConfigValue("installFolder"), "installs", installFolder, "install", filename));
        },
        "openFolder": function (folder) {
            ddmm.app.showFile(folder);
        },
        "launchInstall": function (install) {
            // Cloud save logic removed - launch directly
            ddmm.mods.launchInstall(install);
        },
        "generateInstallFolderName": function () {
            this.install_creation.folder_name = this.install_creation.install_name
                .trim()
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-+/g, "-")
                .substring(0, 32);
        },
        "installCreationSelectMod": function () {
            const mod = ddmm.mods.browseForMod();
            if (mod) {
                this.install_creation.mod = mod;
            }
        },
        "createInstallSubmit": function () {
            if (this.shouldDisableCreation) return;
            this.is_installing = true;

            ddmm.mods.createInstall({
                folderName: this.install_creation.folder_name,
                installName: this.install_creation.install_name,
                globalSave: this.install_creation.global_save,
                mod: (this.install_creation.has_mod ? this.install_creation.mod : null)
            });
            ddmm.once("install list", () => {
                this.is_installing = false;
                if (this.installs.find(i => i.folderName === this.install_creation.folder_name)) {
                    this.selectItem(this.install_creation.folder_name, "install");
                }
            });
        },
        "promptDeleteMod": function () {
            ddmm.window.prompt({
                title: ddmm.translate("renderer.tab_mods.mod_delete_confirmation.message"),
                description: ddmm.translate("renderer.tab_mods.mod_delete_confirmation.details"),
                affirmative_style: "danger",
                button_affirmative: ddmm.translate("renderer.tab_mods.mod_delete_confirmation.button_affirmative"),
                button_negative: ddmm.translate("renderer.tab_mods.mod_delete_confirmation.button_negative"),
                callback: (del) => {
                    if (del) {
                        ddmm.mods.deleteMod(this.selected_item.id);
                        this.selectItem(null, "create");
                    }
                }
            });
        },
        "_refreshInstallList": function (installs) {
            // Event handler for refreshed install list
            this.installs = installs;

            // select something to avoid leaving a blank area
            if (!this.selected_item.type) {
                if (installs.length > 0) {
                    // select the first install
                    this.selectItem(installs[0].folderName, "install");
                } else {
                    // select the install creation page
                    this.selectItem("", "create");
                }
            }

            this._fuseInstalls = new Fuse(installs, {
                shouldSort: true,
                threshold: 0.5,
                keys: ["name", "folderName", "mod.name"]
            });
        },
        "_refreshModList": function (mods) {
            // Event handler for refreshed mod list
            this.mods = mods;

            this._fuseMods = new Fuse(mods, {
                shouldSort: true,
                threshold: 0.5,
                keys: ["filename"]
            });
        },
        "_keyPressHandler": function (e) {
            if (!allowKeyEvents()) {
                return;
            }
            // Handles key press events for installs / mods
            if (this.selectedInstall) {
                if (e.key === "Enter") {
                    this.launchInstall(this.selectedInstall.folderName);
                } else if (e.key === "F2") {
                    ddmm.window.input({
                        title: ddmm.translate("renderer.tab_mods.rename_input.message"),
                        description: ddmm.translate("renderer.tab_mods.rename_input.details", this.selectedInstall.name),
                        button_affirmative: ddmm.translate("renderer.tab_mods.rename_input.button_affirmative"),
                        button_negative: ddmm.translate("renderer.tab_mods.rename_input.button_negative"),
                        callback: (newName) => {
                            if (newName) {
                                ddmm.mods.renameInstall(this.selectedInstall.folderName, newName);
                            }
                        }
                    });
                } else if (e.key === "Delete") {
                    ddmm.window.prompt({
                        title: ddmm.translate("renderer.tab_mods.uninstall_confirmation.message"),
                        description: ddmm.translate("renderer.tab_mods.uninstall_confirmation.details", this.selectedInstall.name),
                        affirmative_style: "danger",
                        button_affirmative: ddmm.translate("renderer.tab_mods.uninstall_confirmation.button_affirmative"),
                        button_negative: ddmm.translate("renderer.tab_mods.uninstall_confirmation.button_negative"),
                        callback: (uninstall) => {
                            if (uninstall) {
                                ddmm.mods.deleteInstall(this.selectedInstall.folderName);
                                ddmm.emit("create install");
                            }
                        }
                    });
                }
            } else if (this.selected_item.type === "mod") {
                if (e.key === "Enter") {
                    this.showCreateInstall(this.getPathToMod(this.selected_item.id));
                } else if (e.key === "Delete") {
                    this.promptDeleteMod();
                }
            }
        },
        "_searchEscapeHandler": function (e) {
            if (e.key === "Escape") {
                this.search = "";
            }
        },
        "onSearchInput": function(e) {
            // Real-time search as user types
            this.search = e.target.value;

            // Debounce the search to avoid excessive filtering
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                // Force Vue to update the computed properties
                this.$forceUpdate();

                // If we have search results and no item is selected, select the first result
                if (this.search.length > 0) {
                    if (this.searchResultsInstalls.length > 0 &&
                        (!this.selected_item.type ||
                         (this.selected_item.type === 'install' && !this.searchResultsInstalls.find(i => i.folderName === this.selected_item.id)))) {
                        this.selectItem(this.searchResultsInstalls[0].folderName, "install");
                    } else if (this.searchResultsMods.length > 0 && this.searchResultsInstalls.length === 0 &&
                               (!this.selected_item.type ||
                                (this.selected_item.type === 'mod' && !this.searchResultsMods.find(m => m.filename === this.selected_item.id)))) {
                        this.selectItem(this.searchResultsMods[0].filename, "mod");
                    }
                } else {
                    // If search is cleared, select first install or create page
                    if (this.installs.length > 0) {
                        this.selectItem(this.installs[0].folderName, "install");
                    } else {
                        this.selectItem("", "create");
                    }
                }
            }, 150); // 150ms debounce for smooth real-time search
        },
        // getSaveFiles function removed - cloud saves disabled
    },
    "computed": {
        "selectedInstall": function () {
            return this.installs.find(i => i.folderName === this.selected_item.id);
        },
        "shouldDisableCreation": function () {
            return this.is_installing || (this.install_creation.has_mod && !this.install_creation.mod)
                || this.install_creation.install_name.length < 2 || this.install_creation.folder_name.length < 2
                || ddmm.mods.installExists(this.install_creation.folder_name);
        },
        "searchResultsMods": function () {
            return this.search.length > 0 ? this._fuseMods.search(this.search) : this.mods;
        },
        "searchResultsInstalls": function () {
            return this.search.length > 0 ? this._fuseInstalls.search(this.search) : this.installs;
        }
    },
    "mounted": function () {
        // Check if ddmm is available before using it
        if (typeof ddmm !== 'undefined' && ddmm.mods) {
            ddmm.mods.refreshInstallList();
            ddmm.mods.refreshModList();
            ddmm.on("install list", this._refreshInstallList);
            ddmm.on("mod list", this._refreshModList);
            ddmm.on("create install", (mod) => {
                this.showCreateInstall(mod ? this.getPathToMod(mod) : null);
            });
        } else {
            console.warn("ModsTab: ddmm not available in mounted hook, will retry");
            // Retry after a short delay
            setTimeout(() => {
                if (typeof ddmm !== 'undefined' && ddmm.mods) {
                    ddmm.mods.refreshInstallList();
                    ddmm.mods.refreshModList();
                    ddmm.on("install list", this._refreshInstallList);
                    ddmm.on("mod list", this._refreshModList);
                    ddmm.on("create install", (mod) => {
                        this.showCreateInstall(mod ? this.getPathToMod(mod) : null);
                    });
                }
            }, 100);
        }

        if (!this.selected_item.type) {
            this.selected_item.id = sessionStorage.getItem("mod_list_last_id");
            this.selected_item.type = sessionStorage.getItem("mod_list_last_type");
        }
        document.body.addEventListener("keyup", this._keyPressHandler);
    },
    "destroyed": function () {
        if (typeof ddmm !== 'undefined' && ddmm.off) {
            ddmm.off("install list", this._refreshInstallList);
            ddmm.off("mod list", this._refreshModList);
        }
        document.body.removeEventListener("keyup", this._keyPressHandler);
    }
});