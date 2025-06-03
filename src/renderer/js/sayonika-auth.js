// Sayonika Authentication Manager
// Provides centralized authentication state management for Sayonika integration

window.SayonikaAuth = (function() {
    let user = null;
    let storeUrl = "https://sayonika.dynamicaaa.me";
    let apiUrl = storeUrl + "/api";
    let listeners = [];
    let maintenanceStatus = { isInMaintenance: false, message: '', estimatedTime: null };

    // Event system for authentication state changes
    function emit(event, data) {
        listeners.forEach(listener => {
            if (listener.event === event) {
                try {
                    listener.callback(data);
                } catch (error) {
                    console.error('Error in Sayonika auth listener:', error);
                }
            }
        });
    }

    function on(event, callback) {
        listeners.push({ event, callback });
    }

    function off(event, callback) {
        listeners = listeners.filter(listener =>
            !(listener.event === event && listener.callback === callback)
        );
    }

    // Authentication methods
    async function checkAuthStatus() {
        try {
            const response = await fetch(`${apiUrl}/auth/status`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated && data.user) {
                    const oldUser = user;
                    user = data.user;

                    // Store last successful auth check time
                    localStorage.setItem('sayonika_last_auth_check', Date.now().toString());

                    // Emit login event if user changed from null to logged in
                    if (!oldUser && user) {
                        emit('login', user);
                    }

                    emit('auth-status-changed', user);
                    return user;
                } else {
                    const oldUser = user;
                    user = null;
                    localStorage.removeItem('sayonika_last_auth_check');

                    // Emit logout event if user changed from logged in to null
                    if (oldUser && !user) {
                        emit('logout', null);
                    }

                    emit('auth-status-changed', null);
                    return null;
                }
            } else {
                const oldUser = user;
                user = null;
                localStorage.removeItem('sayonika_last_auth_check');

                if (oldUser && !user) {
                    emit('logout', null);
                }

                emit('auth-status-changed', null);
                return null;
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            const oldUser = user;
            user = null;
            localStorage.removeItem('sayonika_last_auth_check');

            if (oldUser && !user) {
                emit('logout', null);
            }

            emit('auth-status-changed', null);
            return null;
        }
    }

    async function checkMaintenanceMode() {
        if (typeof window.SayonikaConfig !== 'undefined') {
            try {
                const status = await window.SayonikaConfig.checkMaintenanceMode(storeUrl);
                const oldMaintenanceStatus = maintenanceStatus;
                maintenanceStatus = status;
                
                // Log maintenance mode changes
                if (oldMaintenanceStatus.isInMaintenance !== status.isInMaintenance) {
                    const logMessage = status.isInMaintenance
                        ? `Sayonika entered maintenance mode: ${status.message}`
                        : 'Sayonika exited maintenance mode';
                    console.log(logMessage);
                    
                    // Emit maintenance mode change event
                    emit('maintenance-mode-changed', status);
                }
                
                // If we just detected maintenance mode for the first time, show the popup
                if (status.isInMaintenance && !oldMaintenanceStatus.isInMaintenance) {
                    console.log('Showing maintenance mode popup on startup');
                    emit('maintenance-mode-detected', status);
                }
                
                return status;
            } catch (error) {
                console.error('Error checking maintenance mode:', error);
                return { isInMaintenance: false };
            }
        }
        return { isInMaintenance: false };
    }

    async function login(credentials) {
        try {
            // Check maintenance mode before attempting login
            const maintenance = await checkMaintenanceMode();
            if (maintenance.isInMaintenance) {
                console.log('Login blocked: Sayonika is in maintenance mode');
                emit('maintenance-mode-blocked', maintenance);
                return {
                    success: false,
                    error: 'Sayonika is currently in maintenance mode',
                    maintenance: maintenance
                };
            }

            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': `DokiDokiModManager/${(typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.version) ? window.APP_CONFIG.version : '0.0.0'} (Sayonika Integration)`
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                user = data.user;
                localStorage.setItem('sayonika_last_auth_check', Date.now().toString());
                console.log('Sayonika login successful for user:', user.username);
                emit('login', user);
                emit('auth-status-changed', user);
                return { success: true, user: data.user };
            } else {
                console.log('Sayonika login failed:', data.error);
                return { success: false, error: data.error, errors: data.errors };
            }
        } catch (error) {
            console.error('Sayonika login error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    async function logout() {
        try {
            await fetch(`${apiUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        const oldUser = user;
        user = null;
        localStorage.removeItem('sayonika_last_auth_check');

        if (oldUser) {
            emit('logout', null);
        }

        emit('auth-status-changed', null);
    }

    async function validateSessionOnStartup() {
        // Check if we have a recent auth check (within last 5 minutes)
        const lastAuthCheck = localStorage.getItem('sayonika_last_auth_check');
        if (lastAuthCheck) {
            const timeSinceLastCheck = Date.now() - parseInt(lastAuthCheck);
            const fiveMinutes = 5 * 60 * 1000;

            if (timeSinceLastCheck < fiveMinutes) {
                console.log('Recent Sayonika auth check found, skipping validation');
                return user;
            }
        }

        // Perform fresh auth status check
        console.log('Validating Sayonika session on startup...');
        const authUser = await checkAuthStatus();

        if (authUser) {
            console.log('Sayonika session is valid for user:', authUser.username);
        } else {
            console.log('No valid Sayonika session found');
        }

        return authUser;
    }

    async function detectStoreUrl() {
        // Use the global Sayonika configuration if available
        if (typeof window.SayonikaConfig !== 'undefined') {
            try {
                storeUrl = await window.SayonikaConfig.detectStoreUrl();
                apiUrl = storeUrl + "/api";
                console.log('Sayonika store connected:', storeUrl);
                return storeUrl;
            } catch (error) {
                console.error('Error using SayonikaConfig:', error);
            }
        }

        // Fallback to manual detection with new default
        const possibleUrls = [
            'https://sayonika.dynamicaaa.me',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];

        // Try each URL to find a working one
        for (const url of possibleUrls) {
            try {
                const response = await fetch(url + '/api/categories', {
                    method: 'GET',
                    timeout: 5000
                });
                if (response.ok) {
                    storeUrl = url;
                    apiUrl = storeUrl + "/api";
                    console.log('Using working Sayonika store URL:', storeUrl);
                    return storeUrl;
                }
            } catch (error) {
                console.log(`Failed to connect to ${url}:`, error.message);
            }
        }

        // If all fail, use the default
        storeUrl = possibleUrls[0];
        apiUrl = storeUrl + "/api";
        console.log('Using default Sayonika store URL (no connection test):', storeUrl);
        return storeUrl;
    }

    // Initialize on load
    (async function init() {
        await detectStoreUrl();
        await validateSessionOnStartup();
        
        // Initial maintenance mode check
        const initialMaintenanceStatus = await checkMaintenanceMode();
        
        // Emit initial status event to ensure UI updates after startup check
        console.log('Sayonika initialization complete, emitting initial maintenance status');
        emit('maintenance-mode-initial-check-complete', initialMaintenanceStatus);
        
        // Set up periodic maintenance mode checking (every 5 minutes)
        setInterval(async () => {
            await checkMaintenanceMode();
        }, 5 * 60 * 1000);
    })();

    // Public API
    return {
        // State getters
        getUser: () => user,
        getStoreUrl: () => storeUrl,
        getApiUrl: () => apiUrl,
        isLoggedIn: () => !!user,
        getMaintenanceStatus: () => maintenanceStatus,
        isInMaintenanceMode: () => maintenanceStatus.isInMaintenance,

        // Authentication methods
        checkAuthStatus,
        login,
        logout,
        validateSessionOnStartup,
        detectStoreUrl,
        checkMaintenanceMode,

        // Event system
        on,
        off,
        emit,

        // Utility methods
        getUserAvatar: function(userObj, size = '64') {
            const targetUser = userObj || user;
            if (targetUser && targetUser.id) {
                if (typeof window.SayonikaConfig !== 'undefined') {
                    return window.SayonikaConfig.getAvatarUrl(targetUser.id, size, storeUrl);
                } else {
                    return `${storeUrl}/api/images/avatar/${targetUser.id}?size=${size}`;
                }
            }
            return '../images/default-avatar.svg';
        }
    };
})();
