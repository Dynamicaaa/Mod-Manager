// Sayonika Store Configuration
window.SayonikaConfig = {
    // Default store URL - can be overridden by user settings
    defaultStoreUrl: 'https://sayonika.dynamicaaa.me',

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
        },
        maintenance: '/api/maintenance/status'
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
    },

    // Check if Sayonika is in maintenance mode
    checkMaintenanceMode: async function(storeUrl = null) {
        try {
            const baseUrl = storeUrl || this.getUserServerUrl();
            
            // Check the /api/auth endpoint for 503 status as requested
            try {
                console.log('Checking Sayonika maintenance mode via /api/auth endpoint');
                const authResponse = await fetch(baseUrl + '/api/auth', {
                    method: 'GET',
                    timeout: 5000,
                    headers: {
                        'User-Agent': `DokiDokiModManager/${(typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.version) ? window.APP_CONFIG.version : '0.0.0'} (Maintenance Check)`
                    }
                });
                
                console.log('Auth endpoint response status:', authResponse.status);
                
                // If we get a 503 Service Unavailable, service is in maintenance mode
                if (authResponse.status === 503) {
                    console.log('Service returned 503 from /api/auth, treating as maintenance mode');
                    let maintenanceMessage = 'Sayonika is currently undergoing maintenance. Please try again later.';
                    let estimatedTime = null;
                    
                    // Try to get maintenance details from response body
                    try {
                        const data = await authResponse.json();
                        if (data.message) {
                            maintenanceMessage = data.message;
                        }
                        if (data.estimatedTime) {
                            estimatedTime = data.estimatedTime;
                        }
                    } catch (parseError) {
                        console.log('Could not parse maintenance response body, using default message');
                    }
                    
                    return {
                        isInMaintenance: true,
                        message: maintenanceMessage,
                        estimatedTime: estimatedTime
                    };
                }
                
                // If auth endpoint is accessible with other status codes, service is not in maintenance
                console.log('Auth endpoint accessible, service not in maintenance mode');
                return { isInMaintenance: false };
                
            } catch (authError) {
                console.log('Auth endpoint check failed, trying fallback methods:', authError.message);
                
                // Fallback: try the dedicated maintenance endpoint
                try {
                    const maintenanceResponse = await fetch(baseUrl + this.endpoints.maintenance, {
                        method: 'GET',
                        timeout: 5000
                    });
                    
                    if (maintenanceResponse.ok) {
                        const data = await maintenanceResponse.json();
                        return {
                            isInMaintenance: data.maintenance || false,
                            message: data.message || 'Sayonika is currently in maintenance mode.',
                            estimatedTime: data.estimatedTime || null
                        };
                    }
                } catch (maintenanceError) {
                    console.log('Maintenance endpoint also not available');
                }
                
                // Network errors could be connectivity issues, don't assume maintenance
                console.log('Could not determine maintenance status, assuming service is available');
                return { isInMaintenance: false };
            }
        } catch (error) {
            console.warn('Error checking maintenance status:', error);
            return { isInMaintenance: false };
        }
    }
};

// Make it available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.SayonikaConfig;
}
