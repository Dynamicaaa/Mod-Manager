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
            "originalData": {}
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
