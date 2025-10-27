const ModsTab = Vue.component("ddmm-mods-tab", {
    "template": `
<div class="page-content">
    <div class="mod-viewer-pane">
        <div class="mod-viewer-mod-list">
            <div class="ddlc-search-container">
                <input type="text" class="small ddlc-search" :placeholder="_('renderer.tab_mods.list.placeholder_search') + ' ♡'" autofocus @keydown="_searchEscapeHandler" @input="onSearchInput" v-model="search">
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
                    <img v-for="img in visibleScreenshots"
                         :key="img"
                         :alt="img"
                         :src="getURLToScreenshot(selectedInstall.folderName, img)"
                         @click="openScreenshot(selectedInstall.folderName, img)"
                         width="150"
                         loading="lazy"
                         @load="onImageLoad(img)"
                         @error="onImageError(img)">
                    <div v-if="selectedInstall.screenshots.length > visibleScreenshots.length" class="load-more-screenshots">
                        <button @click="loadMoreScreenshots" class="secondary">
                            <i class="fas fa-images"></i> Load More Screenshots ({{selectedInstall.screenshots.length - visibleScreenshots.length}} remaining)
                        </button>
                    </div>
                </div>
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
                    <p>
                        <input type="text"
                               :placeholder="_('renderer.tab_mods.install_creation.label_install_name')"
                               v-model="install_creation.install_name"
                               @input="handleInstallNameInput"
                               :class="{'validation-error': install_creation.validation.installName.errors.length > 0}">
                    </p>
                    <div v-if="install_creation.validation.installName.errors.length > 0" class="validation-errors">
                        <div v-for="error in install_creation.validation.installName.errors" class="validation-error-message">
                            <i class="fas fa-exclamation-triangle"></i> {{error}}
                        </div>
                    </div>
                    <div v-if="install_creation.validation.installName.warnings.length > 0" class="validation-warnings">
                        <div v-for="warning in install_creation.validation.installName.warnings" class="validation-warning-message">
                            <i class="fas fa-exclamation-circle"></i> {{warning}}
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <p><label>{{_("renderer.tab_mods.install_creation.label_folder_name")}}</label></p>
                    <p>
                        <input type="text"
                               :placeholder="_('renderer.tab_mods.install_creation.label_folder_name')"
                               v-model="install_creation.folder_name"
                               @input="handleFolderNameInput"
                               :class="{'validation-error': install_creation.validation.folderName.errors.length > 0}">
                    </p>
                    <div v-if="install_creation.validation.folderName.errors.length > 0" class="validation-errors">
                        <div v-for="error in install_creation.validation.folderName.errors" class="validation-error-message">
                            <i class="fas fa-exclamation-triangle"></i> {{error}}
                        </div>
                    </div>
                    <div v-if="install_creation.validation.folderName.warnings.length > 0" class="validation-warnings">
                        <div v-for="warning in install_creation.validation.folderName.warnings" class="validation-warning-message">
                            <i class="fas fa-exclamation-circle"></i> {{warning}}
                        </div>
                    </div>
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
                    <div v-if="install_creation.mod && install_creation.version_info" class="version-compatibility-info">
                        <div class="compatibility-detected">
                            <i class="fas fa-info-circle"></i>
                            <strong>Detected Ren'Py Version:</strong> {{install_creation.version_info.version}}
                            <span class="confidence-badge" :class="'confidence-' + install_creation.version_info.confidence">
                                {{install_creation.version_info.confidence}} confidence
                            </span>
                        </div>
                        <div v-if="install_creation.version_info.compatibilityNotes && install_creation.version_info.compatibilityNotes.length > 0" class="compatibility-notes">
                            <div v-for="note in install_creation.version_info.compatibilityNotes" class="compatibility-note">
                                <i class="fas fa-lightbulb"></i> {{note}}
                            </div>
                        </div>
                        <div v-if="install_creation.compatibility_check" class="compatibility-check">
                            <div v-if="!install_creation.compatibility_check.isCompatible" class="compatibility-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <strong>Compatibility Issues Detected:</strong>
                                <ul>
                                    <li v-for="issue in install_creation.compatibility_check.issues">{{issue}}</li>
                                </ul>
                                <div v-if="install_creation.compatibility_check.recommendations && install_creation.compatibility_check.recommendations.length > 0">
                                    <strong>Recommendations:</strong>
                                    <ul>
                                        <li v-for="rec in install_creation.compatibility_check.recommendations">{{rec}}</li>
                                    </ul>
                                </div>
                            </div>
                            <div v-else-if="install_creation.compatibility_check.confidence === 'medium' || install_creation.compatibility_check.confidence === 'low'" class="compatibility-caution">
                                <i class="fas fa-info-circle"></i>
                                <strong>Compatibility Notes:</strong>
                                <ul v-if="install_creation.compatibility_check.issues.length > 0">
                                    <li v-for="issue in install_creation.compatibility_check.issues">{{issue}}</li>
                                </ul>
                                <ul v-if="install_creation.compatibility_check.recommendations.length > 0">
                                    <li v-for="rec in install_creation.compatibility_check.recommendations">{{rec}}</li>
                                </ul>
                            </div>
                            <div v-else class="compatibility-good">
                                <i class="fas fa-check-circle"></i>
                                <strong>Good compatibility expected</strong>
                            </div>
                        </div>
                    </div>
                </div>

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

                <div v-if="is_installing" class="form-group">
                    <button class="primary" disabled>
                        <i class="fas fa-spinner fa-spin fa-fw"></i> {{_("renderer.tab_mods.install_creation.button_installing")}} {{ installation_progress > 0 ? installation_progress + '%' : '' }}
                    </button>
                </div>

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
            "installation_progress": 0, // New data property for installation progress
            "selected_item": {
                "id": "",
                "type": ""
            },
            "install_creation": {
                "install_name": "",
                "folder_name": "",
                "global_save": false,
                "has_mod": false,
                "mod": "",
                "version_info": null,
                "compatibility_check": null,
                "validation": {
                    "installName": { errors: [], warnings: [] },
                    "folderName": { errors: [], warnings: [] },
                    "mod": { errors: [], warnings: [] }
                }
            },
            "search": "",
            "searchTimeout": null,
            "_fuseMods": null,
            "_fuseInstalls": null,
            "screenshotsPerLoad": 6, // Number of screenshots to load at once
            "loadedScreenshots": new Set(), // Track loaded screenshots
            "visibleScreenshotCount": 6 // Initial number of visible screenshots
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
                "renderer.tab_mods.mod.button_install": "Install",
                "renderer.tab_mods.mod.button_settings": "Settings",
                "renderer.tab_mods.mod.description_external": "Show in folder",
                "renderer.tab_mods.install_creation.title": "Install DDLC",
                "renderer.tab_mods.install_creation.label_install_name": "Install Name",
                "renderer.tab_mods.install_creation.label_folder_name": "Folder Name",
                "renderer.tab_mods.install_creation.label_has_mod": "Install Mod",
                "renderer.tab_mods.install_creation.label_mod": "Mod",
                "renderer.tab_mods.install_creation.description_mod": "Click to browse for a mod.",
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
            };
            return fallbacks[key] || key;
        },
        "installExists": (typeof ddmm !== 'undefined' && ddmm.mods) ? ddmm.mods.installExists : () => false,
        "browseForMod": (typeof ddmm !== 'undefined' && ddmm.mods) ? ddmm.mods.browseForMod : () => null,
        "openURL": (typeof ddmm !== 'undefined' && ddmm.app) ? ddmm.app.openURL : () => {},
        "showCreateInstall": function (mod) {
            this.install_creation.has_mod = !!mod;
            this.install_creation.mod = mod || "";
            this.install_creation.version_info = null;
            this.install_creation.compatibility_check = null;
            
            if (this.selected_item.type === "create") {
                // If we're already on the create page, analyze the new mod
                if (mod) {
                    this.analyzeModVersionCompatibility(mod);
                }
                return;
            }
            
            this.install_creation.install_name = "";
            this.install_creation.folder_name = "";
            this.install_creation.global_save = false;
            this.selectItem("", "create");
            
            // Analyze mod version compatibility if a mod is provided
            if (mod) {
                this.analyzeModVersionCompatibility(mod);
            }
        },
        "selectItem": function (id, type) {
            if (this.selected_item.id === id && this.selected_item.type === type) return;
            this.selected_item.id = id;
            this.selected_item.type = type;
            sessionStorage.setItem("mod_list_last_id", id);
            sessionStorage.setItem("mod_list_last_type", type);
            
            // Reset screenshot lazy loading when changing selection
            if (type === 'install') {
                this.resetScreenshotLazyLoading();
            }
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
            ddmm.mods.launchInstall(install);
        },
        "generateInstallFolderName": function () {
            // Always sync folder name with install name unless the user has manually edited it
            if (
                !this.install_creation.folder_name ||
                this.install_creation.folder_name === "" ||
                this.install_creation.folder_name === this.install_creation.install_name_prev ||
                this.install_creation.folder_name === this.install_creation.install_name_prev_folder
            ) {
                // Use the validation system to sanitize the folder name
                if (typeof ddmm !== 'undefined' && ddmm.sanitizeFilename) {
                    ddmm.sanitizeFilename(this.install_creation.install_name).then(sanitized => {
                        const generated = sanitized
                            .toLowerCase()
                            .replace(/\W/g, "-")
                            .replace(/-+/g, "-")
                            .substring(0, 32);
                        this.install_creation.folder_name = generated;
                        this.install_creation.install_name_prev_folder = generated;
                        this.validateFolderName();
                    }).catch(error => {
                        console.warn("Failed to sanitize filename:", error);
                        // Fallback to original logic
                        const generated = this.install_creation.install_name
                            .trim()
                            .toLowerCase()
                            .replace(/\W/g, "-")
                            .replace(/-+/g, "-")
                            .substring(0, 32);
                        this.install_creation.folder_name = generated;
                        this.install_creation.install_name_prev_folder = generated;
                        this.validateFolderName();
                    });
                } else {
                    // Fallback to original logic
                    const generated = this.install_creation.install_name
                        .trim()
                        .toLowerCase()
                        .replace(/\W/g, "-")
                        .replace(/-+/g, "-")
                        .substring(0, 32);
                    this.install_creation.folder_name = generated;
                    this.install_creation.install_name_prev_folder = generated;
                    this.validateFolderName();
                }
            }
            // Track the last install_name used for auto-generation
            this.install_creation.install_name_prev = this.install_creation.install_name;
        },

        "handleInstallNameInput": function(event) {
            this.install_creation.install_name = event.target.value;
            this.validateInstallName();
            this.generateInstallFolderName();
        },

        "handleFolderNameInput": function(event) {
            this.install_creation.folder_name = event.target.value;
            this.validateFolderName();
        },

        "validateInstallName": async function() {
            if (typeof ddmm === 'undefined' || !ddmm.validateString) {
                return;
            }

            try {
                const result = await ddmm.validateString(this.install_creation.install_name, {
                    minLength: 1,
                    maxLength: 100,
                    trimWhitespace: true,
                    normalizeSpaces: true
                });

                this.install_creation.validation.installName = {
                    errors: result.isValid ? [] : result.errors,
                    warnings: result.warnings || []
                };
            } catch (error) {
                console.warn("Install name validation failed:", error);
                this.install_creation.validation.installName = {
                    errors: ["Validation temporarily unavailable"],
                    warnings: []
                };
            }
        },

        "validateFolderName": async function() {
            if (typeof ddmm === 'undefined' || !ddmm.validateString) {
                return;
            }

            try {
                const result = await ddmm.validateString(this.install_creation.folder_name, {
                    minLength: 1,
                    maxLength: 50,
                    allowedCharacters: /^[a-zA-Z0-9\-_]+$/,
                    trimWhitespace: true
                });

                // Check if folder already exists
                const errors = result.isValid ? [] : [...result.errors];
                const warnings = [...(result.warnings || [])];

                if (result.isValid && this.install_creation.folder_name.length > 2 &&
                    this.installExists(this.install_creation.folder_name)) {
                    errors.push("Folder name already exists. Please choose a different name.");
                }

                this.install_creation.validation.folderName = { errors, warnings };
            } catch (error) {
                console.warn("Folder name validation failed:", error);
                this.install_creation.validation.folderName = {
                    errors: ["Validation temporarily unavailable"],
                    warnings: []
                };
            }
        },
        "installCreationSelectMod": function () {
            const mod = ddmm.mods.browseForMod();
            if (mod) {
                this.install_creation.mod = mod;
                this.analyzeModVersionCompatibility(mod);
            }
        },
        "analyzeModVersionCompatibility": function(modPath) {
            // Reset version info
            this.install_creation.version_info = null;
            this.install_creation.compatibility_check = null;
            
            if (!modPath || typeof ddmm === 'undefined' || !ddmm.mods || !ddmm.mods.analyzeModVersion) {
                return;
            }
            
            try {
                // Call backend to analyze the mod's Ren'Py version
                ddmm.mods.analyzeModVersion(modPath).then((result) => {
                    if (result && result.versionInfo) {
                        this.install_creation.version_info = result.versionInfo;
                        
                        // If we have game version info, check compatibility
                        if (result.gameVersion) {
                            this.install_creation.compatibility_check = ddmm.mods.checkVersionCompatibility(
                                result.versionInfo.version,
                                result.gameVersion
                            );
                        }
                        
                        console.log("Mod version analysis complete:", {
                            versionInfo: this.install_creation.version_info,
                            compatibilityCheck: this.install_creation.compatibility_check
                        });
                    }
                }).catch((error) => {
                    console.warn("Failed to analyze mod version compatibility:", error);
                });
            } catch (error) {
                console.warn("Error during mod version analysis:", error);
            }
        },
        "createInstallSubmit": async function () {
            if (this.shouldDisableCreation) return;

            // Perform final validation before submission
            await this.validateInstallName();
            await this.validateFolderName();

            // Check if there are any validation errors
            const hasErrors = this.install_creation.validation.installName.errors.length > 0 ||
                             this.install_creation.validation.folderName.errors.length > 0;

            if (hasErrors) {
                ddmm.window.prompt({
                    title: "Validation Errors",
                    description: "Please fix the validation errors before proceeding.",
                    affirmative_style: "danger",
                    button_affirmative: "OK",
                    button_negative: null,
                    callback: () => {}
                });
                return;
            }

            // Validate the complete installation configuration
            if (typeof ddmm !== 'undefined' && ddmm.validateInstallationConfig) {
                try {
                    const configValidation = await ddmm.validateInstallationConfig({
                        installName: this.install_creation.install_name,
                        folderName: this.install_creation.folder_name,
                        globalSave: this.install_creation.global_save,
                        modPath: this.install_creation.has_mod ? this.install_creation.mod : null
                    });

                    if (!configValidation.isValid) {
                        ddmm.window.prompt({
                            title: "Configuration Validation Failed",
                            description: "Installation configuration errors:\n" + configValidation.errors.join('\n'),
                            affirmative_style: "danger",
                            button_affirmative: "OK",
                            button_negative: null,
                            callback: () => {}
                        });
                        return;
                    }

                    // Show warnings if any
                    if (configValidation.warnings && configValidation.warnings.length > 0) {
                        ddmm.window.prompt({
                            title: "Configuration Warnings",
                            description: "The following warnings were detected:\n" + configValidation.warnings.join('\n') + "\n\nDo you want to continue?",
                            affirmative_style: "warning",
                            button_affirmative: "Continue",
                            button_negative: "Cancel",
                            callback: (proceed) => {
                                if (proceed) {
                                    this.performInstallation(configValidation.sanitized || {
                                        installName: this.install_creation.install_name,
                                        folderName: this.install_creation.folder_name,
                                        globalSave: this.install_creation.global_save,
                                        modPath: this.install_creation.has_mod ? this.install_creation.mod : null
                                    });
                                }
                            }
                        });
                        return;
                    }

                    // Use sanitized values if available
                    const sanitizedConfig = configValidation.sanitized || {
                        installName: this.install_creation.install_name,
                        folderName: this.install_creation.folder_name,
                        globalSave: this.install_creation.global_save,
                        modPath: this.install_creation.has_mod ? this.install_creation.mod : null
                    };

                    this.performInstallation(sanitizedConfig);

                } catch (error) {
                    console.warn("Configuration validation failed:", error);
                    // Proceed with original values if validation fails
                    this.performInstallation({
                        installName: this.install_creation.install_name,
                        folderName: this.install_creation.folder_name,
                        globalSave: this.install_creation.global_save,
                        modPath: this.install_creation.has_mod ? this.install_creation.mod : null
                    });
                }
            } else {
                // Fallback if validation API is not available
                this.performInstallation({
                    installName: this.install_creation.install_name,
                    folderName: this.install_creation.folder_name,
                    globalSave: this.install_creation.global_save,
                    modPath: this.install_creation.has_mod ? this.install_creation.mod : null
                });
            }
        },

        "performInstallation": function(config) {
            this.is_installing = true;

            ddmm.mods.createInstall({
                folderName: config.folderName || this.install_creation.folder_name,
                installName: config.installName || this.install_creation.install_name,
                globalSave: config.globalSave !== undefined ? config.globalSave : this.install_creation.global_save,
                mod: config.modPath || (this.install_creation.has_mod ? this.install_creation.mod : null)
            });
            
            ddmm.once("install list", () => {
                this.is_installing = false;
                this.installation_progress = 0; // Reset progress on completion
                const targetFolder = config.folderName || this.install_creation.folder_name;
                if (this.installs.find(i => i.folderName === targetFolder)) {
                    this.selectItem(targetFolder, "install");
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
            console.log("ModsTab: Refreshed install list with", installs.length, "installs");

            // Check for any active installations and update progress
            if (typeof window.app !== 'undefined' && window.app.active_installations) {
                window.app.active_installations.forEach((progressEvent, sessionId) => {
                    if (progressEvent.progress < 100) {
                        this.is_installing = true;
                        this.installation_progress = progressEvent.progress;
                        // Optionally, you could store the sessionId to track multiple installations
                    }
                });
            }

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

            try {
                if (typeof Fuse !== 'undefined') {
                    this._fuseInstalls = new Fuse(installs, {
                        shouldSort: true,
                        threshold: 0.5,
                        location: 0,
                        distance: 100,
                        minMatchCharLength: 1,
                        keys: [
                            { name: "name", weight: 0.8 },
                            { name: "folderName", weight: 0.6 },
                            { name: "mod.name", weight: 0.7 }
                        ]
                    });
                    console.log("ModsTab: Fuse.js initialized for installs");
                } else {
                    console.warn("ModsTab: Fuse.js not available, using fallback search");
                    this._fuseInstalls = null;
                }
            } catch (error) {
                console.warn("Failed to initialize Fuse.js for installs:", error);
                this._fuseInstalls = null;
            }
        },
        "_refreshModList": function (mods) {
            // Event handler for refreshed mod list
            this.mods = mods;
            console.log("ModsTab: Refreshed mod list with", mods.length, "mods");

            try {
                if (typeof Fuse !== 'undefined') {
                    this._fuseMods = new Fuse(mods, {
                        shouldSort: true,
                        threshold: 0.5,
                        location: 0,
                        distance: 100,
                        minMatchCharLength: 1,
                        keys: [
                            { name: "filename", weight: 1.0 }
                        ]
                    });
                    console.log("ModsTab: Fuse.js initialized for mods");
                } else {
                    console.warn("ModsTab: Fuse.js not available, using fallback search");
                    this._fuseMods = null;
                }
            } catch (error) {
                console.warn("Failed to initialize Fuse.js for mods:", error);
                this._fuseMods = null;
            }
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
            const newSearchValue = e.target.value || "";
            this.search = newSearchValue;

            // Debounce the search to avoid excessive filtering
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                // Force Vue to update the computed properties
                this.$forceUpdate();

                // If we have search results and no item is selected, select the first result
                if (this.search.length > 0) {
                    const searchInstalls = this.searchResultsInstalls;
                    const searchMods = this.searchResultsMods;
                    
                    if (searchInstalls.length > 0 &&
                        (!this.selected_item.type ||
                         (this.selected_item.type === 'install' && !searchInstalls.find(i => i.folderName === this.selected_item.id)))) {
                        this.selectItem(searchInstalls[0].folderName, "install");
                    } else if (searchMods.length > 0 && searchInstalls.length === 0 &&
                               (!this.selected_item.type ||
                                (this.selected_item.type === 'mod' && !searchMods.find(m => m.filename === this.selected_item.id)))) {
                        this.selectItem(searchMods[0].filename, "mod");
                    } else if (searchInstalls.length === 0 && searchMods.length === 0) {
                        // No search results found - keep current selection or show create page
                        if (!this.selected_item.type) {
                            this.selectItem("", "create");
                        }
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

        backupInstall: function(folderName) {
            if (!window.ddmm || !window.ddmm.app || !window.ddmm.app.showSaveDialog) {
                alert('Backup not supported in this environment.');
                return;
            }
            window.ddmm.app.showSaveDialog({
                title: 'Backup Mod Install',
                defaultPath: folderName + '-backup.zip',
                filters: [{ name: 'Zip Files', extensions: ['zip'] }]
            }).then(result => {
                if (!result.canceled && result.filePath) {
                    const res = ddmm.mods.backupInstall(folderName, result.filePath);
                    if (res.success) {
                        alert('Backup completed!');
                    } else {
                        alert('Backup failed: ' + res.error);
                    }
                }
            });
        },
        restoreInstall: function(folderName) {
            if (!window.ddmm || !window.ddmm.app || !window.ddmm.app.showOpenDialog) {
                alert('Restore not supported in this environment.');
                return;
            }
            window.ddmm.app.showOpenDialog({
                title: 'Restore Mod Install',
                filters: [{ name: 'Zip Files', extensions: ['zip'] }],
                properties: ['openFile']
            }).then(result => {
                if (!result.canceled && result.filePaths && result.filePaths[0]) {
                    const res = ddmm.mods.restoreInstall(result.filePaths[0], folderName);
                    if (res.success) {
                        alert('Restore completed!');
                        ddmm.mods.refreshInstallList();
                    } else {
                        alert('Restore failed: ' + res.error);
                    }
                }
            });
        },

        // Lazy loading methods for screenshots
        "loadMoreScreenshots": function() {
            this.visibleScreenshotCount += this.screenshotsPerLoad;
        },

        "onImageLoad": function(imageName) {
            this.loadedScreenshots.add(imageName);
            console.log(`Screenshot loaded: ${imageName}`);
        },

        "onImageError": function(imageName) {
            console.warn(`Failed to load screenshot: ${imageName}`);
        },

        "resetScreenshotLazyLoading": function() {
            this.visibleScreenshotCount = this.screenshotsPerLoad;
            this.loadedScreenshots.clear();
        },
    },
    "computed": {
        "selectedInstall": function () {
            return this.installs.find(i => i.folderName === this.selected_item.id);
        },
        "visibleScreenshots": function () {
            if (!this.selectedInstall || !this.selectedInstall.screenshots) {
                return [];
            }
            return this.selectedInstall.screenshots.slice(0, this.visibleScreenshotCount);
        },
        "shouldDisableCreation": function () {
            // Check for validation errors in addition to existing checks
            const hasValidationErrors = this.install_creation.validation.installName.errors.length > 0 ||
                                       this.install_creation.validation.folderName.errors.length > 0;
            
            return this.is_installing ||
                   hasValidationErrors ||
                   (this.install_creation.has_mod && !this.install_creation.mod) ||
                   this.install_creation.install_name.length < 2 ||
                   this.install_creation.folder_name.length < 2 ||
                   (typeof ddmm !== 'undefined' && ddmm.mods && ddmm.mods.installExists(this.install_creation.folder_name));
        },
        "searchResultsMods": function () {
            if (!this.search || this.search.length === 0) {
                return this.mods;
            }
            if (!this._fuseMods) {
                // Fallback to simple string matching if Fuse.js isn't available
                return this.mods.filter(mod =>
                    mod.filename.toLowerCase().includes(this.search.toLowerCase())
                );
            }
            const searchResults = this._fuseMods.search(this.search);
            // Fuse.js returns objects with 'item' property in v6+
            return searchResults.map ? searchResults.map(result => result.item || result) : searchResults;
        },
        "searchResultsInstalls": function () {
            if (!this.search || this.search.length === 0) {
                return this.installs;
            }
            if (!this._fuseInstalls) {
                // Fallback to simple string matching if Fuse.js isn't available
                return this.installs.filter(install =>
                    install.name.toLowerCase().includes(this.search.toLowerCase()) ||
                    install.folderName.toLowerCase().includes(this.search.toLowerCase()) ||
                    (install.mod && install.mod.name && install.mod.name.toLowerCase().includes(this.search.toLowerCase()))
                );
            }
            const searchResults = this._fuseInstalls.search(this.search);
            // Fuse.js returns objects with 'item' property in v6+
            return searchResults.map ? searchResults.map(result => result.item || result) : searchResults;
        }
    },
    "mounted": function () {
        // Ensure we always remove the same handler reference when the component is destroyed
        if (!this._installationProgressHandler) {
            this._installationProgressHandler = (progressEvent) => {
                // Only update if this is the active installation being tracked by this tab
                // For simplicity, we assume only one installation can be initiated from this tab at a time
                if (this.is_installing) { // && progressEvent.sessionId === this.currentInstallationSessionId
                    this.installation_progress = progressEvent.progress;
                    if (progressEvent.progress >= 100 && progressEvent.phase === 'verifying') {
                        this.is_installing = false;
                        this.installation_progress = 0;
                    } else if (progressEvent.phase === 'error') {
                        this.is_installing = false;
                        this.installation_progress = 0;
                    }
                }
            };
        }

        // Check if ddmm is available before using it
        if (typeof ddmm !== 'undefined' && ddmm.mods) {
            ddmm.mods.refreshInstallList();
            ddmm.mods.refreshModList();
            ddmm.on("install list", this._refreshInstallList);
            ddmm.on("mod list", this._refreshModList);
            ddmm.on("create install", (mod) => {
                this.showCreateInstall(mod ? this.getPathToMod(mod) : null);
            });

            // Listen for installation progress events
            ddmm.on('installation-progress', this._installationProgressHandler);

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
                    // Re-attach progress listener on retry
                    ddmm.on('installation-progress', this._installationProgressHandler);
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
            ddmm.off("installation-progress", this._installationProgressHandler); // Remove progress listener
        }
        document.body.removeEventListener("keyup", this._keyPressHandler);
    }
});
