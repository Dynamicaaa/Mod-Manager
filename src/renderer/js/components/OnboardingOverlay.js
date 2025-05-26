const OnboardingOverlay = Vue.component("ddmm-onboarding", {
    "template": `<div class="cover onboarding-overlay">
    <div class="onboarding-container">
        <div class="onboarding-header">
            <h1>{{_("renderer.onboarding.title")}}</h1>
            <p class="onboarding-subtitle">{{_("renderer.onboarding.subtitle")}}</p>
        </div>

        <div class="onboarding-progress">
            <div class="progress-bar">
                <div class="progress-step" :class="{ active: currentStep >= 0, completed: currentStep > 0 }">
                    <div class="step-number">1</div>
                    <div class="step-label">{{_("renderer.onboarding.step0_label")}}</div>
                </div>
                <div class="progress-line" :class="{ active: currentStep > 0 }"></div>
                <div class="progress-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
                    <div class="step-number">2</div>
                    <div class="step-label">{{_("renderer.onboarding.step1_label")}}</div>
                </div>
                <div class="progress-line" :class="{ active: currentStep > 1 }"></div>
                <div class="progress-step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
                    <div class="step-number">3</div>
                    <div class="step-label">{{_("renderer.onboarding.step2_label")}}</div>
                </div>
                <div class="progress-line" :class="{ active: currentStep > 2 }"></div>
                <div class="progress-step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
                    <div class="step-number">4</div>
                    <div class="step-label">{{_("renderer.onboarding.step3_label")}}</div>
                </div>
            </div>
        </div>

        <div class="onboarding-content">
            <!-- Step 0: Character Selection -->
            <div v-if="currentStep === 0" class="onboarding-step character-selection">
                <div class="step-icon character">
                    <i class="fas fa-heart"></i>
                </div>
                <h2>{{_("renderer.onboarding.step0_title")}}</h2>
                <p class="step-description">{{_("renderer.onboarding.step0_description")}}</p>

                <div class="character-list">
                    <div class="character-option"
                         v-for="character in characters"
                         :key="character.id"
                         :class="{ selected: selectedCharacter === character.id }"
                         @click="selectCharacter(character.id)">
                        <div class="character-radio">
                            <i class="fas fa-check" v-if="selectedCharacter === character.id"></i>
                        </div>
                        <div class="character-info">
                            <div class="character-name">{{character.name}}</div>
                            <div class="character-description">{{character.description}}</div>
                        </div>
                    </div>
                </div>

                <div class="step-actions">
                    <button class="primary huge" @click="confirmCharacterSelection" :disabled="!selectedCharacter">
                        <i class="fas fa-arrow-right"></i>
                        {{_("renderer.onboarding.button_continue")}}
                    </button>
                </div>
            </div>

            <!-- Step 1: Download DDLC -->
            <div v-if="currentStep === 1" class="onboarding-step">
                <div class="step-icon">
                    <i class="fas fa-download"></i>
                </div>
                <h2>{{_("renderer.onboarding.step1_title")}}</h2>
                <p class="step-description">{{_("renderer.onboarding.step1_description")}}</p>

                <div class="step-details">
                    <div class="info-box">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>{{_("renderer.onboarding.step1_info_title")}}</strong>
                            <p>{{_("renderer.onboarding.step1_info_desc", platform === "darwin" ? "Mac" : "Windows")}}</p>
                        </div>
                    </div>
                </div>

                <div class="step-actions">
                    <button class="primary huge" @click="download">
                        <i class="fas fa-external-link-alt"></i>
                        {{_("renderer.onboarding.button_download")}}
                    </button>
                    <button class="secondary" @click="currentStep = 2">
                        {{_("renderer.onboarding.button_already_have")}}
                    </button>
                </div>
            </div>

            <!-- Step 2: Select DDLC File -->
            <div v-if="currentStep === 2" class="onboarding-step">
                <div class="step-icon">
                    <i class="fas fa-file-archive"></i>
                </div>
                <h2>{{_("renderer.onboarding.step2_title")}}</h2>
                <p class="step-description">{{_("renderer.onboarding.step2_description")}}</p>

                <div class="step-details">
                    <div class="info-box">
                        <i class="fas fa-lightbulb"></i>
                        <div>
                            <strong>{{_("renderer.onboarding.step2_tip_title")}}</strong>
                            <p>{{_("renderer.onboarding.step2_tip_desc")}}</p>
                        </div>
                    </div>
                </div>

                <div class="step-actions">
                    <button class="primary huge" @click="open">
                        <i class="fas fa-folder-open"></i>
                        {{_("renderer.onboarding.button_choose")}}
                    </button>
                    <button class="secondary" @click="currentStep = 1">
                        <i class="fas fa-arrow-left"></i>
                        {{_("renderer.onboarding.button_back")}}
                    </button>
                </div>
            </div>

            <!-- Step 3: Setup Complete -->
            <div v-if="currentStep === 3" class="onboarding-step">
                <div class="step-icon success">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>{{_("renderer.onboarding.step3_title")}}</h2>
                <p class="step-description">{{_("renderer.onboarding.step3_description")}}</p>

                <div class="step-details">
                    <div class="info-box success">
                        <i class="fas fa-check"></i>
                        <div>
                            <strong>{{_("renderer.onboarding.step3_success_title")}}</strong>
                            <p>{{_("renderer.onboarding.step3_success_desc")}}</p>
                        </div>
                    </div>
                </div>

                <div class="step-actions">
                    <button class="success huge" @click="completeOnboarding">
                        <i class="fas fa-rocket"></i>
                        {{_("renderer.onboarding.button_get_started")}}
                    </button>
                </div>
            </div>
        </div>

        <div class="onboarding-footer">
            <div class="storage-info">
                <i class="fas fa-folder"></i>
                <span>{{_("renderer.onboarding.storage_location", install_folder)}}</span>
                <a href="javascript:;" @click="changeFolder" class="change-link">{{_("renderer.onboarding.link_change")}}</a>
            </div>
        </div>
    </div>
</div>
    `,
    "data": function () {
        return {
            "install_folder": (typeof ddmm !== 'undefined' && ddmm.config) ? ddmm.config.readConfigValue("installFolder") : "Unknown",
            "platform": (typeof ddmm !== 'undefined') ? ddmm.platform : "unknown",
            "currentStep": 0,
            "selectedCharacter": null,
            "characters": [
                {
                    "id": "monika",
                    "name": "Monika",
                    "description": "The confident club president",
                    "background": "x-base-monika.png"
                },
                {
                    "id": "sayori",
                    "name": "Sayori",
                    "description": "Your cheerful childhood friend",
                    "background": "x-base-sayori.png"
                },
                {
                    "id": "natsuki",
                    "name": "Natsuki",
                    "description": "The feisty manga lover",
                    "background": "x-base-natsuki.png"
                },
                {
                    "id": "yuri",
                    "name": "Yuri",
                    "description": "The mysterious book enthusiast",
                    "background": "x-base-yuri.png"
                },
                {
                    "id": "all",
                    "name": "All of them!",
                    "description": "Can't choose just one? That's okay!",
                    "background": "default.png"
                }
            ]
        }
    },
    "methods": {
        "_": function(key, ...args) {
            if (typeof ddmm !== 'undefined' && ddmm.translate) {
                try {
                    const translation = ddmm.translate(key, ...args);
                    // Check if translation failed (contains error message)
                    if (translation && translation.includes('[ERROR]')) {
                        return this.getFallbackTranslation(key, ...args);
                    }
                    return translation;
                } catch (e) {
                    console.warn("Translation failed for", key, e);
                    return this.getFallbackTranslation(key, ...args);
                }
            }
            return this.getFallbackTranslation(key, ...args);
        },
        "getFallbackTranslation": function(key, ...args) {
            const fallbacks = {
                "renderer.onboarding.title": "Welcome to Doki Doki Mod Manager!",
                "renderer.onboarding.subtitle": "Let's get you set up to start playing DDLC mods",
                "renderer.onboarding.step0_label": "Character",
                "renderer.onboarding.step1_label": "Download",
                "renderer.onboarding.step2_label": "Select File",
                "renderer.onboarding.step3_label": "Complete",
                "renderer.onboarding.step0_title": "Choose Your Favorite Character",
                "renderer.onboarding.step0_description": "Who's your favorite DDLC character? This will set your background theme!",
                "renderer.onboarding.step1_title": "Download Doki Doki Literature Club",
                "renderer.onboarding.step1_description": "First, you'll need a copy of the original Doki Doki Literature Club game.",
                "renderer.onboarding.step1_info_title": "Where to download:",
                "renderer.onboarding.step1_info_desc": "Visit the official DDLC website and download the {0} version as a ZIP file.",
                "renderer.onboarding.step2_title": "Select Your DDLC File",
                "renderer.onboarding.step2_description": "Now, let's locate the DDLC ZIP file you downloaded.",
                "renderer.onboarding.step2_tip_title": "Looking for the file?",
                "renderer.onboarding.step2_tip_desc": "The file is usually named 'DDLC-Win.zip' or 'DDLC-Mac.zip' and can be found in your Downloads folder.",
                "renderer.onboarding.step3_title": "Setup Complete!",
                "renderer.onboarding.step3_description": "Great! You're all set up and ready to start using Doki Doki Mod Manager.",
                "renderer.onboarding.step3_success_title": "Ready to go!",
                "renderer.onboarding.step3_success_desc": "You can now install mods, create game instances, and start your DDLC modding journey.",
                "renderer.onboarding.button_continue": "Continue",
                "renderer.onboarding.button_download": "Visit Official Download Page",
                "renderer.onboarding.button_already_have": "I already have DDLC",
                "renderer.onboarding.button_choose": "Browse for DDLC File",
                "renderer.onboarding.button_back": "Back",
                "renderer.onboarding.button_get_started": "Get Started",
                "renderer.onboarding.storage_location": "Files will be stored at: {0}",
                "renderer.onboarding.link_change": "Change Location"
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
        "download": function () {
            if (typeof ddmm !== 'undefined' && ddmm.app) {
                ddmm.app.openURL("https://ddlc.moe");
            }
        },
        "open": function () {
            if (typeof ddmm !== 'undefined' && ddmm.onboarding) {
                ddmm.onboarding.browseForGame();
            }
        },
        "changeFolder": function () {
            if (typeof ddmm !== 'undefined' && ddmm.app) {
                ddmm.app.beginMoveInstall();
            }
        },
        "selectCharacter": function (characterId) {
            this.selectedCharacter = characterId;
        },
        "confirmCharacterSelection": function () {
            if (this.selectedCharacter) {
                // Find the selected character and set the background
                const character = this.characters.find(c => c.id === this.selectedCharacter);
                if (character && typeof ddmm !== 'undefined' && ddmm.config) {
                    ddmm.config.saveConfigValue("background", character.background);
                    // Update the app background immediately
                    if (window.app) {
                        window.app.background_image = character.background;
                        window.app.$forceUpdate();
                    }
                }
                // Move to next step
                this.currentStep = 1;
            }
        },
        "completeOnboarding": function () {
            // Hide the onboarding overlay
            if (window.OnboardingManager) {
                window.OnboardingManager.hideOnboarding();
            }
        }
    },
    "created": function() {
        console.log("OnboardingOverlay component created");

        // Listen for onboarding completion
        if (typeof ddmm !== 'undefined' && ddmm.on) {
            ddmm.on("onboarding downloaded", () => {
                console.log("OnboardingOverlay: File successfully selected, advancing to step 3");
                this.currentStep = 3;
            });
        }
    },
    "mounted": function() {
        console.log("OnboardingOverlay component mounted and visible");
    }
});