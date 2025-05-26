const {APP_CONFIG} = require("../config/appConfig.js");



interface AppConfigData {
    name: string;
    version: string;
    description: string;
    author: string;
    homepage?: string;
    repository: string;
    supportEmail?: string;
    updateUrl?: string;
    features: {
        autoUpdates: boolean;
        cloudSaves: boolean;
        achievements: boolean;
        analytics?: boolean;
        crashReporting?: boolean;
        betaFeatures?: boolean;
    };
    defaults: {
        sdkMode: string;
        updateChannel: string;
        systemBorders: boolean;
        sdkDebuggingEnabled: boolean;
        background: string;
        language?: string;
    };
    urls?: {
        feedback?: string;
        ddlcDownload?: string;
        modStore?: string;
    };
    limits?: {
        maxInstalls?: number;
        maxMods?: number;
        maxScreenshots?: number;
        maxSaveFiles?: number;
    };
    ui?: {
        themes?: string[];
        defaultTheme?: string;
        animations?: boolean;
        notifications?: boolean;
        sounds?: boolean;
    };
    security?: {
        allowedDomains?: string[];
        requireHttps?: boolean;
        validateMods?: boolean;
    };
    experimental?: {
        newModFormat?: boolean;
        enhancedGraphics?: boolean;
        cloudSync?: boolean;
    };
}

export default class AppConfig {
    private static instance: AppConfig;
    private config: AppConfigData;
    private localConfig: any = null;
    private isLoaded: boolean = false;

    private constructor() {
        // Load local config immediately
        this.loadLocalConfig();
        // Initialize config synchronously so it's available immediately
        if (this.localConfig) {
            this.config = this.createConfigFromLocal(this.localConfig);
            this.isLoaded = true;
        } else {
            this.config = this.getDefaultConfig();
            this.isLoaded = true;
        }
    }

    public static getInstance(): AppConfig {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig();
        }
        return AppConfig.instance;
    }

    private loadLocalConfig(): void {
        try {
            // Load bundled JavaScript configuration
            console.log("Loading bundled JavaScript configuration");
            this.localConfig = APP_CONFIG as any; // Cast to LocalConfig interface
            console.log("Successfully loaded bundled configuration");
            console.log("Config version:", this.localConfig?.version);
            console.log("Config name:", this.localConfig?.name);
        } catch (error) {
            console.error("Error loading bundled config:", error);
            this.localConfig = null;
        }
    }

    public async loadConfig(): Promise<void> {
        // Config is already loaded synchronously in constructor
        if (this.isLoaded) {
            console.log("Configuration already loaded");
            return;
        }

        // This should not happen, but just in case
        try {
            console.log("Initializing configuration...");
            if (this.localConfig) {
                this.config = this.createConfigFromLocal(this.localConfig);
            } else {
                this.config = this.getDefaultConfig();
            }
            this.isLoaded = true;
            console.log("Successfully initialized configuration");
        } catch (error) {
            console.error("Error initializing config:", error);
            this.config = this.getDefaultConfig();
            this.isLoaded = true;
        }
    }

    private createConfigFromLocal(localConfig: any): AppConfigData {
        console.log("createConfigFromLocal called with:", localConfig);
        console.log("localConfig.version:", localConfig?.version);
        console.log("localConfig.name:", localConfig?.name);

        return {
            name: localConfig.name || "Doki Doki Mod Manager",
            version: localConfig.version || "0.0.0",
            description: localConfig.description || "Mod Manager for Doki Doki Literature Club",
            author: localConfig.author || "Dynamicaaa",
            repository: localConfig.repository || "https://github.com/Dynamicaaa/Mod-Manager",
            supportEmail: localConfig.supportEmail,
            updateUrl: localConfig.updateUrl,
            features: {
                autoUpdates: localConfig.features?.autoUpdates !== false,
                cloudSaves: localConfig.features?.cloudSaves !== false,
                achievements: localConfig.features?.achievements !== false,
                analytics: localConfig.features?.analytics,
                crashReporting: localConfig.features?.crashReporting,
                betaFeatures: localConfig.features?.betaFeatures
            },
            defaults: {
                sdkMode: localConfig.defaults?.sdkMode || "always",
                updateChannel: localConfig.defaults?.updateChannel || "stable",
                systemBorders: localConfig.defaults?.systemBorders || false,
                sdkDebuggingEnabled: localConfig.defaults?.sdkDebuggingEnabled || false,
                background: localConfig.defaults?.background || "none",
                language: localConfig.defaults?.language
            },
            urls: localConfig.urls,
            limits: localConfig.limits,
            ui: localConfig.ui,
            security: localConfig.security,
            experimental: localConfig.experimental
        };
    }



    private getDefaultConfig(): AppConfigData {
        // Use the bundled configuration as the default
        return this.createConfigFromLocal(APP_CONFIG as any);
    }

    public get(key: keyof AppConfigData): any {
        return this.config[key];
    }

    public getVersion(): string {
        return this.config.version;
    }

    public getName(): string {
        return this.config.name;
    }



    public getDefault(key: string): any {
        return this.config.defaults[key];
    }

    public getFullConfig(): AppConfigData {
        return { ...this.config };
    }

    public isConfigLoaded(): boolean {
        return this.isLoaded;
    }

    public getLocalConfig(): any {
        return this.localConfig;
    }

    public getLocalValue<T>(path: string): T | undefined {
        if (!this.localConfig) return undefined;

        const keys = path.split('.');
        let current: any = this.localConfig;

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return undefined;
            }
        }

        return current as T;
    }
}
