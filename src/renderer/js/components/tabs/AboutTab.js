const AboutTab = Vue.component("ddmm-about-tab", {
    "template": `
<div class="page-content ddlc-about-container">
    <div class="text-container">
        <div class="ddlc-about-header">
            <img src="../images/ddmm.png" width="180" class="ddlc-logo">
            <div class="ddlc-title-section">
                <h1>{{_("renderer.tab_about.title")}}</h1>
                <p class="ddlc-subtitle">{{_("renderer.tab_about.description")}}</p>
            </div>
        </div>

        <div class="ddlc-mod-card">
            <h2>{{_("renderer.tab_about.title_disclaimer")}}</h2>
            <p>{{_("renderer.tab_about.disclaimer_1")}}</p>
            <br>
            <p>{{_("renderer.tab_about.disclaimer_2")}}</p>
        </div>

        <div class="ddlc-mod-card">
            <h2><i class="fas fa-info-circle"></i> Version Information</h2>
            <div class="ddlc-version-info">
                <div class="version-item">
                    <i class="fas fa-tag"></i>
                    <strong>Version:</strong>
                    <span class="version-badge">{{app_version}}</span>
                </div>
                <div class="version-item">
                    <i class="fas fa-cube"></i>
                    <strong>Name:</strong>
                    <span>{{app_name}}</span>
                </div>
            </div>
        </div>

        <div class="ddlc-mod-card">
            <h2><i class="fas fa-external-link-alt"></i> Links</h2>
            <div class="ddlc-links-section">
                <button @click="openRepository" class="primary ddlc-link-button">
                    <i class="fab fa-github fa-fw"></i>
                    GitHub Repository
                </button>
            </div>
        </div>
    </div>
</div>
        `,
    "data": function() {
        return {
            "app_version": (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.version) ? window.APP_CONFIG.version : "0.0.0",
            "app_name": (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.name) ? window.APP_CONFIG.name : "Doki Doki Mod Manager"
        };
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
            const fallbacks = {
                "renderer.tab_about.title": "About Doki Doki Mod Manager",
                "renderer.tab_about.description": "Doki Doki Mod Manager is a mod manager for Doki Doki Literature Club that allows you to easily install, manage, and play mods.",
                "renderer.tab_about.title_disclaimer": "Disclaimer",
                "renderer.tab_about.disclaimer_1": "This software is a fan work and is not affiliated with Team Salvato or Doki Doki Literature Club.",
                "renderer.tab_about.disclaimer_2": "Doki Doki Literature Club is a trademark of Team Salvato. Please support the official game."
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
        "openRepository": function() {
            console.log("Opening repository");
            const url = (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.repository) ? window.APP_CONFIG.repository : "https://github.com/Dynamicaaa/Mod-Manager";
            if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.openURL) {
                ddmm.app.openURL(url);
            } else {
                window.open(url, '_blank');
            }
        }
    },
    "mounted": function() {
        // Listen for ddmm-ready event to update version info
        window.addEventListener('ddmm-ready', () => {
            console.log("AboutTab: ddmm-ready event received");
            if (typeof ddmm !== 'undefined' && ddmm.version) {
                this.app_version = ddmm.version;
            }
            if (typeof ddmm !== 'undefined' && ddmm.appName) {
                this.app_name = ddmm.appName;
            }
            this.$forceUpdate();
        });

        // Check if ddmm is already available
        if (typeof ddmm !== 'undefined') {
            if (ddmm.version) {
                this.app_version = ddmm.version;
            }
            if (ddmm.appName) {
                this.app_name = ddmm.appName;
            }
        }
    }
});