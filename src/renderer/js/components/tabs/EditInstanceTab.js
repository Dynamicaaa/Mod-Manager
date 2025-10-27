const EditInstanceTab = Vue.component("ddmm-edit-instance-tab", {
    "name": "ddmm-edit-instance-tab",
    "template": `
<div class="page-content">
    <div class="edit-instance-container">
        <div class="edit-header">
            <button class="secondary back-button" @click="goBack">
                <i class="fas fa-arrow-left"></i>
                Back to Mods
            </button>
            <h1><i class="fas fa-edit"></i> Edit Instance: {{instanceData.name || 'Unknown'}}</h1>
        </div>

        <div class="edit-content" v-if="instanceData.folderName">
            <div class="ddlc-mod-card">
                <h2><i class="fas fa-cog"></i> Instance Settings</h2>

                <div class="form-group">
                    <label for="instance-name">Instance Name:</label>
                    <input
                        id="instance-name"
                        type="text"
                        v-model="editableData.name"
                        placeholder="Enter instance name"
                    >
                </div>

                <div class="form-group">
                    <label for="instance-folder">Folder Name:</label>
                    <input
                        id="instance-folder"
                        type="text"
                        v-model="editableData.folderName"
                        placeholder="Enter folder name"
                        :disabled="true"
                    >
                    <small>Folder name cannot be changed after creation</small>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" v-model="editableData.globalSave" disabled>
                        Use Global Save Data
                    </label>
                    <small>Share save data across all instances (currently not supported for editing)</small>
                </div>
            </div>

            <div class="ddlc-mod-card" v-if="instanceData.mod">
                <h2><i class="fas fa-puzzle-piece"></i> Mod Information</h2>

                <div class="mod-info-grid">
                    <div class="mod-info-item">
                        <strong>Mod Name:</strong>
                        <span>{{instanceData.mod.name || 'Unknown'}}</span>
                    </div>

                    <div class="mod-info-item">
                        <strong>Author:</strong>
                        <span>{{instanceData.mod.author || 'Unknown'}}</span>
                    </div>

                    <div class="mod-info-item">
                        <strong>Version:</strong>
                        <span>{{instanceData.mod.version || 'Unknown'}}</span>
                    </div>

                    <div class="mod-info-item" v-if="instanceData.mod.description">
                        <strong>Description:</strong>
                        <span>{{instanceData.mod.description}}</span>
                    </div>
                </div>
            </div>

            <div class="ddlc-mod-card">
                <h2><i class="fas fa-tools"></i> Actions</h2>

                <div class="action-buttons">
                    <button class="success" @click="launchInstance">
                        <i class="fas fa-play"></i>
                        Launch Instance
                    </button>

                    <button class="primary" @click="saveChanges" :disabled="!hasChanges">
                        <i class="fas fa-save"></i>
                        Save Changes
                    </button>

                    <button class="secondary" @click="openInstanceFolder">
                        <i class="fas fa-folder-open"></i>
                        Open Folder
                    </button>

                    <button class="secondary" @click="backupInstance">
                        <i class="fas fa-download"></i>
                        Backup Instance
                    </button>

                    <button class="secondary" @click="restoreInstance">
                        <i class="fas fa-upload"></i>
                        Restore Instance
                    </button>

                    <button class="warning" @click="resetInstance">
                        <i class="fas fa-undo"></i>
                        Reset Instance
                    </button>

                    <button class="danger" @click="deleteInstance">
                        <i class="fas fa-trash"></i>
                        Delete Instance
                    </button>
                </div>
            </div>

            <div class="ddlc-mod-card">
                <h2><i class="fas fa-file-code"></i> Decompile Mod</h2>
                <p class="card-subtitle">Use the bundled RPX toolchain to extract archives and rebuild readable scripts.</p>

                <div class="decompile-menu">
                    <label class="decompile-option">
                        <input type="checkbox" v-model="decompileOptions.deleteRpa">
                        <div>
                            <span class="option-title">Delete .rpa archives after extraction</span>
                            <small>Removes packed archives once their contents are unpacked.</small>
                        </div>
                    </label>
                    <label class="decompile-option">
                        <input type="checkbox" v-model="decompileOptions.deleteRpyc">
                        <div>
                            <span class="option-title">Delete .rpyc files after decompiling</span>
                            <small>Keeps only the recovered .rpy sources to simplify editing.</small>
                        </div>
                    </label>
                    <label class="decompile-option">
                        <input type="checkbox" v-model="decompileOptions.overwriteExistingRpy">
                        <div>
                            <span class="option-title">Overwrite existing .rpy files</span>
                            <small>Refreshes any scripts that were previously decompiled.</small>
                        </div>
                    </label>
                    <label class="decompile-option">
                        <input type="checkbox" v-model="decompileOptions.tryHarder">
                        <div>
                            <span class="option-title">Use try-harder mode</span>
                            <small>Enables slower heuristics for stubborn or legacy Ren&rsquo;Py builds.</small>
                        </div>
                    </label>
                </div>

                <div class="decompile-actions">
                    <button class="primary glass" :disabled="decompileInProgress" @click="decompileInstance">
                        <i class="fas fa-magic"></i>
                        {{ decompileInProgress ? 'Preparing…' : 'Start Decompilation' }}
                    </button>
                </div>
            </div>
        </div>

        <div class="edit-content" v-else>
            <div class="ddlc-mod-card">
                <h2><i class="fas fa-exclamation-triangle"></i> No Instance Selected</h2>
                <p>Please select an instance from the mods tab to edit.</p>
                <button class="primary" @click="goBack">
                    <i class="fas fa-arrow-left"></i>
                    Go Back to Mods
                </button>
            </div>
        </div>
    </div>
</div>
    `,
    "data": function() {
        return {
            "instanceData": {},
            "editableData": {},
            "originalData": {},
            "decompileOptions": {
                "deleteRpa": false,
                "deleteRpyc": false,
                "tryHarder": false,
                "overwriteExistingRpy": true
            },
            "decompileInProgress": false
        }
    },
    "computed": {
        "hasChanges": function() {
            return JSON.stringify(this.editableData) !== JSON.stringify(this.originalData);
        }
    },
    "methods": {
        "setInstanceData": function(data) {
            this.instanceData = data || {};
            this.editableData = {
                name: data.name || '',
                folderName: data.folderName || '',
                globalSave: data.globalSave || false
            };
            this.originalData = JSON.parse(JSON.stringify(this.editableData));
        },

        "goBack": function() {
            if (typeof window.app !== 'undefined' && window.app.goBackFromEdit) {
                window.app.goBackFromEdit();
            }
        },

        "launchInstance": function() {
            if (this.instanceData.folderName && typeof ddmm !== 'undefined' && ddmm.mods) {
                ddmm.mods.launchInstall(this.instanceData.folderName);
            }
        },

        "saveChanges": function() {
            if (!this.hasChanges) return;

            try {
                if (typeof ddmm !== 'undefined' && ddmm.mods) {
                    let changesMade = false;

                    // Save the name change
                    if (this.editableData.name !== this.originalData.name) {
                        ddmm.mods.renameInstall(this.instanceData.folderName, this.editableData.name);
                        changesMade = true;
                    }

                    // Note: Global save setting change is not currently supported by the API
                    if (this.editableData.globalSave !== this.originalData.globalSave) {
                        console.warn("Global save setting change is not currently supported by the API");
                        alert("Note: Global save setting changes are not currently supported. Only the name change has been saved.");
                    }

                    if (changesMade) {
                        this.originalData = JSON.parse(JSON.stringify(this.editableData));
                        alert("Changes saved successfully!");

                        // Refresh the install list to show updated name
                        if (ddmm.mods.refreshInstallList) {
                            ddmm.mods.refreshInstallList();
                        }
                    } else if (this.editableData.globalSave === this.originalData.globalSave) {
                        alert("No changes to save.");
                    }
                }
            } catch (error) {
                console.error("Error saving changes:", error);
                alert("Error saving changes: " + error.message);
            }
        },

        "openInstanceFolder": function() {
            if (this.instanceData.folderName && typeof ddmm !== 'undefined' && ddmm.app) {
                const installPath = ddmm.joinPath(
                    ddmm.config.readConfigValue("installFolder"),
                    "installs",
                    this.instanceData.folderName
                );
                ddmm.app.showFile(installPath);
            }
        },

        "resetInstance": function() {
            if (confirm("Are you sure you want to reset this instance? This will remove all save data.")) {
                try {
                    if (typeof ddmm !== 'undefined' && ddmm.mods && ddmm.mods.deleteSaveData) {
                        ddmm.mods.deleteSaveData(this.instanceData.folderName);
                        alert("Instance save data reset successfully!");
                    } else {
                        alert("Reset functionality is not available in this version.");
                    }
                } catch (error) {
                    console.error("Error resetting instance:", error);
                    alert("Error resetting instance: " + error.message);
                }
            }
        },

        "deleteInstance": function() {
            if (confirm(`Are you sure you want to delete the instance "${this.instanceData.name}"? This action cannot be undone.`)) {
                try {
                    if (typeof ddmm !== 'undefined' && ddmm.mods) {
                        ddmm.mods.deleteInstall(this.instanceData.folderName);
                        alert("Instance deleted successfully!");
                        this.goBack();
                    }
                } catch (error) {
                    console.error("Error deleting instance:", error);
                    alert("Error deleting instance: " + error.message);
                }
            }
        },

        "backupInstance": function() {
            if (!this.instanceData.folderName || !window.ddmm || !window.ddmm.app || !window.ddmm.app.showSaveDialog) {
                alert('Backup not supported in this environment.');
                return;
            }
            window.ddmm.app.showSaveDialog({
                title: 'Backup Mod Instance',
                defaultPath: this.instanceData.folderName + '-backup.zip',
                filters: [{ name: 'Zip Files', extensions: ['zip'] }]
            }).then(result => {
                if (!result.canceled && result.filePath) {
                    const res = ddmm.mods.backupInstall(this.instanceData.folderName, result.filePath);
                    if (res.success) {
                        alert('Backup completed!');
                    } else {
                        alert('Backup failed: ' + res.error);
                    }
                }
            });
        },

        "restoreInstance": function() {
            if (!this.instanceData.folderName || !window.ddmm || !window.ddmm.app || !window.ddmm.app.showOpenDialog) {
                alert('Restore not supported in this environment.');
                return;
            }
            window.ddmm.app.showOpenDialog({
                title: 'Restore Mod Instance',
                filters: [{ name: 'Zip Files', extensions: ['zip'] }],
                properties: ['openFile']
            }).then(result => {
                if (!result.canceled && result.filePaths && result.filePaths[0]) {
                    const res = ddmm.mods.restoreInstall(result.filePaths[0], this.instanceData.folderName);
                    if (res.success) {
                        alert('Restore completed!');
                        if (ddmm.mods.refreshInstallList) ddmm.mods.refreshInstallList();
                    } else {
                        alert('Restore failed: ' + res.error);
                    }
                }
            });
        },

        "decompileInstance": function() {
            if (!this.instanceData.folderName) {
                alert('No instance selected.');
                return;
            }

            if (typeof ddmm === 'undefined' || !ddmm.mods || !ddmm.mods.decompileInstall) {
                alert('Decompilation is not supported in this environment.');
                return;
            }

            const destructive = this.decompileOptions.deleteRpa || this.decompileOptions.deleteRpyc;
            const confirmationMessage = destructive
                ? 'This will remove the selected archive or compiled script files after decompiling. Continue?'
                : 'Start decompiling this mod? This may take several minutes.';

            if (!confirm(confirmationMessage)) {
                return;
            }

            const requestOptions = {
                deleteRpa: this.decompileOptions.deleteRpa,
                deleteRpyc: this.decompileOptions.deleteRpyc,
                tryHarder: this.decompileOptions.tryHarder,
                overwriteExistingRpy: this.decompileOptions.overwriteExistingRpy
            };

            this.decompileInProgress = true;

            ddmm.mods.decompileInstall(this.instanceData.folderName, requestOptions).then((result) => {
                if (result && result.success) {
                    if (window.app && window.app.showProgressOverlay) {
                        window.app.showProgressOverlay(result.sessionId, {
                            phase: 'analyzing',
                            progress: 0,
                            message: 'Preparing mod decompilation...',
                            currentFile: null,
                            cancellable: false
                        });
                    }
                } else {
                    const message = (result && result.error) ? result.error : 'Unknown error';
                    alert('Failed to start decompilation: ' + message);
                }
            }).catch((error) => {
                console.error("Error starting decompilation:", error);
                alert("Error starting decompilation: " + error.message);
            }).finally(() => {
                this.decompileInProgress = false;
            });
        }
    },

    "mounted": function() {
        // Component is ready
        console.log("EditInstanceTab mounted");

        // Register this component with the main app for easy access
        if (typeof window.app !== 'undefined') {
            window.app.editInstanceComponent = this;
            console.log("EditInstanceTab registered with main app");

            // Try to set any pending instance data
            window.app.trySetInstanceData();
        }
    },

    "beforeDestroy": function() {
        // Clean up the reference when component is destroyed
        if (typeof window.app !== 'undefined' && window.app.editInstanceComponent === this) {
            window.app.editInstanceComponent = null;
        }
    }
});
