const DropOverlay = Vue.component("ddmm-drop-overlay", {
    "template": `<div class="drop-overlay" @dragend="end" @dragexit="end" @dragleave="end" @drop="drop" @dragover="start">
    <div class="info">
        <p><i class="fas fa-download fa-2x"></i></p>
        <p>{{_("renderer.drop_cover.text")}}</p>
    </div>
</div>`,
    "methods": {
        "_": ddmm.translate,
        "start": function (ev) {
            ev.dataTransfer.dropEffect = "copy";
            ev.preventDefault();
        },
        "end": function () {
            this.$emit("end");
        },
        "drop": async function (ev) {
            ev.preventDefault();
            
            // Enhanced validation for dropped files
            if (!ev.dataTransfer.files || ev.dataTransfer.files.length === 0) {
                this.$emit("end");
                return;
            }

            const file = ev.dataTransfer.files[0];
            const filePath = file.path;
            
            try {
                // Use comprehensive validation through the main process
                const validationResult = await ddmm.api.validateModArchive(filePath);
                
                if (!validationResult.isValid) {
                    this.showValidationError(
                        `File validation failed:\n${validationResult.errors.join('\n')}`,
                        validationResult.warnings
                    );
                    this.$emit("end");
                    return;
                }

                // Additional client-side file size check for immediate feedback
                const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
                if (file.size > maxSize) {
                    this.showValidationError(
                        `File is too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum size is 2GB.`,
                        []
                    );
                    this.$emit("end");
                    return;
                }

                // Show warnings if any
                if (validationResult.warnings && validationResult.warnings.length > 0) {
                    this.showValidationWarnings(validationResult.warnings);
                }

                // If all validations pass, emit the validated file path
                this.$emit("file", validationResult.sanitized || filePath);
                this.$emit("end");
                
            } catch (error) {
                console.error("Validation error:", error);
                this.showValidationError(
                    "Unable to validate file. Please check if the file is accessible and not corrupted.",
                    []
                );
                this.$emit("end");
            }
        },

        "showValidationError": function(message, warnings = []) {
            // Show user-friendly error message with warnings
            let fullMessage = message;
            if (warnings.length > 0) {
                fullMessage += "\n\nWarnings:\n" + warnings.join('\n');
            }
            
            if (typeof ddmm !== 'undefined' && ddmm.window && ddmm.window.prompt) {
                ddmm.window.prompt({
                    title: "File Validation Error",
                    description: fullMessage,
                    affirmative_style: "danger",
                    button_affirmative: "OK",
                    button_negative: null,
                    callback: () => {}
                });
            } else {
                // Fallback for environments where ddmm is not available
                console.error("File validation error:", fullMessage);
                alert(fullMessage);
            }
        },

        "showValidationWarnings": function(warnings) {
            // Show warnings in a non-blocking way
            if (warnings.length === 0) return;
            
            if (typeof ddmm !== 'undefined' && ddmm.window && ddmm.window.prompt) {
                ddmm.window.prompt({
                    title: "File Validation Warnings",
                    description: "The file passed validation but has some warnings:\n\n" + warnings.join('\n') + "\n\nDo you want to continue?",
                    affirmative_style: "warning",
                    button_affirmative: "Continue",
                    button_negative: "Cancel",
                    callback: (result) => {
                        if (!result) {
                            this.$emit("end");
                        }
                    }
                });
            } else {
                console.warn("File validation warnings:", warnings);
            }
        }
    }
});