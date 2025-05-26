// Sayonika Store Configuration
window.SayonikaConfig = {
    // Default store URL - can be overridden by user settings
    defaultStoreUrl: 'https://sayonika.reconvial.dev',

    // Alternative store URLs to try if default fails
    fallbackUrls: [
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],

    // Get user's preferred server URL from config
    getUserServerUrl: function() {
        if (typeof ddmm !== 'undefined' && ddmm.config) {
            const userUrl = ddmm.config.readConfigValue('sayonikaServerUrl');
            if (userUrl) {
                return userUrl;
            }
        }
        return this.defaultStoreUrl;
    },

    // Set user's preferred server URL
    setUserServerUrl: function(url) {
        if (typeof ddmm !== 'undefined' && ddmm.config) {
            ddmm.config.saveConfigValue('sayonikaServerUrl', url);
        }
    },

    // API endpoints
    endpoints: {
        auth: {
            status: '/api/auth/status',
            login: '/api/auth/login',
            logout: '/api/auth/logout'
        },
        mods: {
            list: '/api/mods',
            download: '/api/mods/{id}/download',
            details: '/api/mods/{id}'
        },
        categories: '/api/categories',
        images: {
            avatar: '/api/images/avatar/{userId}',
            thumbnail: '/api/images/thumbnail/{modId}'
        }
    },

    // OAuth providers
    oauth: {
        github: '/auth/github'
    },

    // Store settings
    settings: {
        modsPerPage: 20,
        searchDebounceMs: 500,
        authCheckIntervalMs: 1000,
        maxAuthCheckAttempts: 30
    },

    // Helper function to get full API URL
    getApiUrl: function(endpoint, storeUrl = null) {
        const baseUrl = storeUrl || this.getUserServerUrl();
        return baseUrl + endpoint;
    },

    // Helper function to get OAuth URL
    getOAuthUrl: function(provider, storeUrl = null) {
        const baseUrl = storeUrl || this.getUserServerUrl();
        return baseUrl + this.oauth[provider];
    },

    // Helper function to get avatar URL
    getAvatarUrl: function(userId, size = '64', storeUrl = null) {
        const baseUrl = storeUrl || this.getUserServerUrl();
        const endpoint = this.endpoints.images.avatar.replace('{userId}', userId);
        return `${baseUrl}${endpoint}?size=${size}`;
    },

    // Helper function to get thumbnail URL
    getThumbnailUrl: function(modId, size = '300x200', storeUrl = null) {
        const baseUrl = storeUrl || this.getUserServerUrl();
        const endpoint = this.endpoints.images.thumbnail.replace('{modId}', modId);
        return `${baseUrl}${endpoint}?size=${size}`;
    },

    // Helper function to test store connectivity
    testStoreConnection: async function(storeUrl) {
        try {
            const response = await fetch(storeUrl + '/api/categories', {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    // Auto-detect working store URL
    detectStoreUrl: async function() {
        // First try user's preferred server
        const userUrl = this.getUserServerUrl();
        if (userUrl) {
            console.log(`Testing user's preferred Sayonika server: ${userUrl}`);
            const isWorking = await this.testStoreConnection(userUrl);
            if (isWorking) {
                console.log(`Successfully connected to user's Sayonika server at: ${userUrl}`);
                return userUrl;
            }
        }

        // If user's server fails, try fallbacks
        const urlsToTest = [this.defaultStoreUrl, ...this.fallbackUrls];

        for (const url of urlsToTest) {
            console.log(`Testing Sayonika store connection to: ${url}`);
            const isWorking = await this.testStoreConnection(url);
            if (isWorking) {
                console.log(`Successfully connected to Sayonika store at: ${url}`);
                return url;
            }
        }

        console.warn('Could not connect to any Sayonika store URLs');
        return userUrl || this.defaultStoreUrl; // Return user's choice or default as fallback
    }
};

// Make it available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.SayonikaConfig;
}
