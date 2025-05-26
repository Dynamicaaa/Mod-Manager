// App configuration in JavaScript format
// This replaces the TypeScript version for easier maintenance

const APP_CONFIG = {
    name: "Doki Doki Mod Manager",
    version: "5.0.0",
    description: "Mod Manager for Doki Doki Literature Club",
    author: "Dynamicaaa",

    repository: "https://github.com/Dynamicaaa/Mod-Manager",
    supportEmail: "CanaryZen@proton.me",
    updateUrl: "https://api.github.com/repos/Dynamicaaa/Mod-Manager/releases/latest",

    features: {
        autoUpdates: true,
        cloudSaves: false,
        achievements: true,
        analytics: false,
        crashReporting: true,
        betaFeatures: false
    },
    defaults: {
        sdkMode: "always",
        updateChannel: "stable",
        systemBorders: false,
        sdkDebuggingEnabled: false,
        background: "none",
        language: "en-GB"
    },
    urls: {
        feedback: "mailto:CanaryZen@proton.me",
        ddlcDownload: "https://ddlc.moe",
        modStore: "https://sayonika.reconvial.dev"
    },
    limits: {
        maxInstalls: 50,
        maxMods: 100,
        maxScreenshots: 20,
        maxSaveFiles: 10
    },
    ui: {
        themes: ["ddlc", "classic", "monika", "sayori", "natsuki", "yuri", "cyberpunk", "retro", "midnight", "sunset"],
        defaultTheme: "ddlc",
        animations: true,
        notifications: true,
        sounds: false
    },
    security: {
        allowedDomains: [
            "sayonika.reconvial.dev",
            "ddlc.moe",
            "github.com",
            "githubusercontent.com"
        ],
        requireHttps: false,
        validateMods: true
    },
    experimental: {
        newModFormat: false,
        enhancedGraphics: false,
        cloudSync: false
    }
};

module.exports = { APP_CONFIG };
