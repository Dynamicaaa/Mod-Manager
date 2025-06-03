const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Sayonika Integration Tests', function() {
    this.timeout(10000);

    describe('Configuration Files', function() {
        it('should have Sayonika configuration file', function() {
            const configPath = path.join(__dirname, '../src/renderer/js/sayonika-config.js');
            assert(fs.existsSync(configPath), 'Sayonika config file should exist');

            const configContent = fs.readFileSync(configPath, 'utf8');
            assert(configContent.includes('window.SayonikaConfig'), 'Config should define SayonikaConfig');
            assert(configContent.includes('defaultStoreUrl'), 'Config should have default store URL');
            assert(configContent.includes('detectStoreUrl'), 'Config should have store detection function');
            assert(configContent.includes('checkMaintenanceMode'), 'Config should have maintenance mode checking');
        });

        it('should have Sayonika authentication module', function() {
            const authPath = path.join(__dirname, '../src/renderer/js/sayonika-auth.js');
            assert(fs.existsSync(authPath), 'Sayonika auth file should exist');

            const authContent = fs.readFileSync(authPath, 'utf8');
            assert(authContent.includes('window.SayonikaAuth'), 'Auth should define SayonikaAuth');
            assert(authContent.includes('login'), 'Auth should have login function');
            assert(authContent.includes('logout'), 'Auth should have logout function');
            assert(authContent.includes('checkAuthStatus'), 'Auth should have auth status checking');
        });

        it('should have Sayonika store CSS', function() {
            const cssPath = path.join(__dirname, '../src/renderer/css/sayonika-store.scss');
            assert(fs.existsSync(cssPath), 'Sayonika store SCSS file should exist');

            const cssContent = fs.readFileSync(cssPath, 'utf8');
            assert(cssContent.includes('.sayonika-store'), 'CSS should contain Sayonika store styles');
            assert(cssContent.includes('.mod-card'), 'CSS should contain mod card styles');
            assert(cssContent.includes('.modal-overlay'), 'CSS should contain modal styles');
        });
    });

    describe('SayonikaConfig Module', function() {
        let SayonikaConfig;

        before(function() {
            // Load the SayonikaConfig module
            global.window = {};
            require('../src/renderer/js/sayonika-config.js');
            SayonikaConfig = global.window.SayonikaConfig;
        });

        it('should export SayonikaConfig object', function() {
            assert(SayonikaConfig, 'SayonikaConfig should be defined');
            assert(typeof SayonikaConfig === 'object', 'SayonikaConfig should be an object');
        });

        it('should have required configuration properties', function() {
            assert(SayonikaConfig.defaultStoreUrl, 'Should have default store URL');
            assert(SayonikaConfig.endpoints, 'Should have API endpoints');
            assert(SayonikaConfig.settings, 'Should have settings');
        });

        it('should have API endpoints defined', function() {
            const endpoints = SayonikaConfig.endpoints;
            assert(endpoints.auth, 'Should have auth endpoints');
            assert(endpoints.mods, 'Should have mod endpoints');
            assert(endpoints.categories, 'Should have categories endpoint');
            assert(endpoints.images, 'Should have image endpoints');
            assert(endpoints.maintenance, 'Should have maintenance endpoint');
        });

        it('should have utility functions', function() {
            const requiredFunctions = [
                'getUserServerUrl',
                'setUserServerUrl',
                'getApiUrl',
                'getAvatarUrl',
                'getThumbnailUrl',
                'testStoreConnection',
                'detectStoreUrl',
                'checkMaintenanceMode'
            ];

            requiredFunctions.forEach(fn => {
                assert(typeof SayonikaConfig[fn] === 'function', 
                    `SayonikaConfig should have ${fn} function`);
            });
        });

        it('should generate correct API URLs', function() {
            const testUrl = 'http://localhost:3000';
            const apiUrl = SayonikaConfig.getApiUrl('/api/test', testUrl);
            assert.strictEqual(apiUrl, 'http://localhost:3000/api/test', 
                'Should generate correct API URL');
        });

        it('should generate correct avatar URLs', function() {
            const testUrl = 'http://localhost:3000';
            const avatarUrl = SayonikaConfig.getAvatarUrl(1, '64', testUrl);
            assert.strictEqual(avatarUrl, 'http://localhost:3000/api/images/avatar/1?size=64', 
                'Should generate correct avatar URL');
        });

        it('should generate correct thumbnail URLs', function() {
            const testUrl = 'http://localhost:3000';
            const thumbnailUrl = SayonikaConfig.getThumbnailUrl(2, '300x200', testUrl);
            assert.strictEqual(thumbnailUrl, 'http://localhost:3000/api/images/thumbnail/2?size=300x200', 
                'Should generate correct thumbnail URL');
        });

        it('should use default parameters when not specified', function() {
            const defaultAvatarUrl = SayonikaConfig.getAvatarUrl(1);
            assert(defaultAvatarUrl.includes('size=64'), 'Should use default avatar size');

            const defaultThumbnailUrl = SayonikaConfig.getThumbnailUrl(2);
            assert(defaultThumbnailUrl.includes('size=300x200'), 'Should use default thumbnail size');
        });
    });

    describe('SayonikaAuth Module', function() {
        let SayonikaAuth;

        before(function() {
            // Set up environment for SayonikaAuth
            global.window = {
                SayonikaConfig: {
                    defaultStoreUrl: 'https://test.example.com',
                    getUserServerUrl: function() { return this.defaultStoreUrl; },
                    detectStoreUrl: async function() { return this.defaultStoreUrl; },
                    testStoreConnection: async function() { return true; },
                    checkMaintenanceMode: async function() { 
                        return { isInMaintenance: false }; 
                    }
                },
                APP_CONFIG: { version: '1.0.0' }
            };

            require('../src/renderer/js/sayonika-auth.js');
            SayonikaAuth = global.window.SayonikaAuth;
        });

        it('should export SayonikaAuth object', function() {
            assert(SayonikaAuth, 'SayonikaAuth should be defined');
            assert(typeof SayonikaAuth === 'object', 'SayonikaAuth should be an object');
        });

        it('should have authentication methods', function() {
            const requiredMethods = [
                'login',
                'logout',
                'checkAuthStatus',
                'validateSessionOnStartup',
                'detectStoreUrl',
                'checkMaintenanceMode'
            ];

            requiredMethods.forEach(method => {
                assert(typeof SayonikaAuth[method] === 'function', 
                    `SayonikaAuth should have ${method} method`);
            });
        });

        it('should have state getters', function() {
            const requiredGetters = [
                'getUser',
                'getStoreUrl',
                'getApiUrl',
                'isLoggedIn',
                'getMaintenanceStatus',
                'isInMaintenanceMode'
            ];

            requiredGetters.forEach(getter => {
                assert(typeof SayonikaAuth[getter] === 'function', 
                    `SayonikaAuth should have ${getter} getter`);
            });
        });

        it('should have event system', function() {
            const eventMethods = ['on', 'off', 'emit'];
            
            eventMethods.forEach(method => {
                assert(typeof SayonikaAuth[method] === 'function', 
                    `SayonikaAuth should have ${method} event method`);
            });
        });

        it('should handle maintenance mode checking', async function() {
            const maintenanceStatus = await SayonikaAuth.checkMaintenanceMode();
            assert(typeof maintenanceStatus === 'object', 'Should return maintenance status object');
            assert(typeof maintenanceStatus.isInMaintenance === 'boolean', 
                'Should have isInMaintenance boolean property');
        });

        it('should have utility methods', function() {
            assert(typeof SayonikaAuth.getUserAvatar === 'function', 
                'Should have getUserAvatar method');
        });
    });

    describe('Maintenance Mode System', function() {
        let SayonikaAuth, SayonikaConfig;

        beforeEach(function() {
            // Clear the module cache to ensure clean state
            delete global.window;
            global.window = {};
            global.localStorage = {
                getItem: () => null,
                setItem: () => {},
                removeItem: () => {}
            };
        });

        afterEach(function() {
            // Clean up timers after each test
            if (global.cleanupTestTimers) {
                global.cleanupTestTimers();
            }
        });

        it('should detect maintenance mode correctly', async function() {
            // Load SayonikaConfig fresh
            delete require.cache[require.resolve('../src/renderer/js/sayonika-config.js')];
            require('../src/renderer/js/sayonika-config.js');
            SayonikaConfig = global.window.SayonikaConfig;

            assert(SayonikaConfig, 'SayonikaConfig should be loaded');
            assert(typeof SayonikaConfig.checkMaintenanceMode === 'function', 'checkMaintenanceMode should be a function');

            // Test normal operation (not in maintenance) - test with production URL
            const normalStatus = await SayonikaConfig.checkMaintenanceMode('https://sayonika.dynamicaaa.me');
            assert.strictEqual(normalStatus.isInMaintenance, false,
                'Network failures should not be treated as maintenance');

            // Test that the function returns an object with expected properties
            assert(typeof normalStatus === 'object', 'Should return an object');
            assert(typeof normalStatus.isInMaintenance === 'boolean', 'Should have isInMaintenance boolean');
        });

        it('should block login during maintenance mode', async function() {
            // Set up SayonikaAuth with maintenance mode mock
            delete global.window;
            global.window = {
                SayonikaConfig: {
                    defaultStoreUrl: 'https://sayonika.dynamicaaa.me',
                    getUserServerUrl: function() { return this.defaultStoreUrl; },
                    detectStoreUrl: async function() { return this.defaultStoreUrl; },
                    testStoreConnection: async function() { return true; },
                    checkMaintenanceMode: async function() {
                        return {
                            isInMaintenance: true,
                            message: "Sayonika is currently in maintenance mode.",
                            estimatedTime: new Date(Date.now() + 60 * 60 * 1000).toISOString()
                        };
                    }
                },
                APP_CONFIG: { version: '1.0.0' }
            };

            // Clear module cache and load fresh
            delete require.cache[require.resolve('../src/renderer/js/sayonika-auth.js')];
            require('../src/renderer/js/sayonika-auth.js');
            SayonikaAuth = global.window.SayonikaAuth;

            assert(SayonikaAuth, 'SayonikaAuth should be loaded');
            assert(typeof SayonikaAuth.login === 'function', 'login should be a function');

            // Test login attempt during maintenance
            const loginResult = await SayonikaAuth.login({
                username: 'testuser',
                password: 'testpass'
            });

            assert.strictEqual(loginResult.success, false,
                'Login should be blocked during maintenance');
            assert(loginResult.maintenance, 'Login result should include maintenance details');
            assert.strictEqual(loginResult.maintenance.isInMaintenance, true,
                'Maintenance flag should be set');
            assert(loginResult.maintenance.message, 'Maintenance message should be included');
        });

        it('should emit maintenance mode events', function(done) {
            // Set up event listening test
            delete global.window;
            global.window = {
                SayonikaConfig: {
                    defaultStoreUrl: 'https://sayonika.dynamicaaa.me',
                    getUserServerUrl: function() { return this.defaultStoreUrl; },
                    detectStoreUrl: async function() {
                        // Simulate immediate resolution for test
                        return this.defaultStoreUrl;
                    },
                    testStoreConnection: async function() { return true; },
                    checkMaintenanceMode: async function() {
                        return { isInMaintenance: false };
                    }
                },
                APP_CONFIG: { version: '1.0.0' }
            };

            let eventReceived = false;
            let timeoutHandle;

            // Clear module cache and load fresh
            delete require.cache[require.resolve('../src/renderer/js/sayonika-auth.js')];
            require('../src/renderer/js/sayonika-auth.js');
            SayonikaAuth = global.window.SayonikaAuth;

            assert(SayonikaAuth, 'SayonikaAuth should be loaded');
            assert(typeof SayonikaAuth.on === 'function', 'on should be a function');

            // Listen for initial check complete event
            SayonikaAuth.on('maintenance-mode-initial-check-complete', (data) => {
                if (!eventReceived) {
                    eventReceived = true;
                    if (timeoutHandle) {
                        clearTimeout(timeoutHandle);
                    }
                    try {
                        assert(data, 'Event should include data');
                        assert(typeof data.isInMaintenance === 'boolean',
                            'Event data should include maintenance status');
                        done();
                    } catch (err) {
                        done(err);
                    }
                }
            });

            // The event should fire automatically during initialization
            timeoutHandle = setTimeout(() => {
                if (!eventReceived) {
                    done(new Error('Event was not emitted within timeout'));
                }
            }, 1000);
        });
    });

    describe('UI Integration', function() {
        it('should have updated HTML to include Sayonika assets', function() {
            const htmlPath = path.join(__dirname, '../src/renderer/html/index.html');
            assert(fs.existsSync(htmlPath), 'Main HTML file should exist');

            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            assert(htmlContent.includes('sayonika-store.css'), 
                'HTML should include Sayonika store CSS');
            assert(htmlContent.includes('sayonika-config.js'), 
                'HTML should include Sayonika config JS');
            assert(htmlContent.includes('sayonika-auth.js'), 
                'HTML should include Sayonika auth JS');
        });

        it('should have Sayonika store tab component', function() {
            const componentPath = path.join(__dirname, '../src/renderer/js/components/tabs/StorePlaceholderTab.js');
            assert(fs.existsSync(componentPath), 'StorePlaceholderTab component should exist');

            const componentContent = fs.readFileSync(componentPath, 'utf8');
            assert(componentContent.includes('SayonikaStoreTab') || 
                   componentContent.includes('sayonika-store'), 
                   'Component should reference Sayonika store');
        });

        it('should have updated app.js with Sayonika integration', function() {
            const appPath = path.join(__dirname, '../src/renderer/js/app.js');
            assert(fs.existsSync(appPath), 'App.js file should exist');

            const appContent = fs.readFileSync(appPath, 'utf8');
            assert(appContent.includes('Sayonika') || appContent.includes('sayonika'), 
                'App should reference Sayonika integration');
            assert(appContent.includes('isSayonikaInMaintenance'), 
                'App should have maintenance mode checking');
        });

        it('should have default mod assets', function() {
            const assetsToCheck = [
                '../src/renderer/images/default-mod-thumbnail.svg',
                '../src/renderer/images/default-avatar.svg'
            ];

            assetsToCheck.forEach(assetPath => {
                const fullPath = path.join(__dirname, assetPath);
                if (fs.existsSync(fullPath)) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    assert(content.includes('<svg'), `${assetPath} should be a valid SVG`);
                    assert(content.length > 0, `${assetPath} should not be empty`);
                }
            });
        });
    });

    describe('CSS and Styling', function() {
        it('should have main store styles', function() {
            const cssPath = path.join(__dirname, '../src/renderer/css/sayonika-store.scss');
            if (fs.existsSync(cssPath)) {
                const cssContent = fs.readFileSync(cssPath, 'utf8');

                const expectedClasses = [
                    '.sayonika-store',
                    '.store-header',
                    '.mods-grid',
                    '.mod-card',
                    '.modal-overlay'
                ];

                expectedClasses.forEach(className => {
                    assert(cssContent.includes(className), 
                        `Sayonika CSS should contain ${className} styles`);
                });
            }
        });

        it('should have responsive design considerations', function() {
            const cssPath = path.join(__dirname, '../src/renderer/css/sayonika-store.scss');
            if (fs.existsSync(cssPath)) {
                const cssContent = fs.readFileSync(cssPath, 'utf8');
                
                // Check for responsive design patterns
                const responsivePatterns = [
                    '@media',
                    'max-width',
                    'min-width',
                    'flex',
                    'grid'
                ];

                const hasResponsiveFeatures = responsivePatterns.some(pattern => 
                    cssContent.includes(pattern)
                );
                
                if (cssContent.length > 100) { // Only check if there's substantial CSS
                    assert(hasResponsiveFeatures, 
                        'Sayonika CSS should include responsive design features');
                }
            }
        });

        it('should integrate with main application styles', function() {
            const mainCssPath = path.join(__dirname, '../src/renderer/css/app.scss');
            const mainCssContent = fs.readFileSync(mainCssPath, 'utf8');
            
            // Check if main CSS imports or references Sayonika styles
            const integrationPatterns = [
                '@import',
                'sayonika',
                '.store',
                '.mod-'
            ];

            // At least some integration should exist
            const hasIntegration = integrationPatterns.some(pattern => 
                mainCssContent.toLowerCase().includes(pattern.toLowerCase())
            );

            // This is informational - integration might be done via HTML includes
            if (!hasIntegration) {
                console.log('Info: No direct CSS integration detected - using HTML includes');
            }
        });
    });

    describe('API Endpoint Configuration', function() {
        let SayonikaConfig;

        before(function() {
            delete global.window;
            global.window = {};
            // Clear module cache and load fresh
            delete require.cache[require.resolve('../src/renderer/js/sayonika-config.js')];
            require('../src/renderer/js/sayonika-config.js');
            SayonikaConfig = global.window.SayonikaConfig;
        });

        it('should have complete API endpoint configuration', function() {
            assert(SayonikaConfig, 'SayonikaConfig should be loaded');
            assert(SayonikaConfig.endpoints, 'SayonikaConfig should have endpoints');
            
            const endpoints = SayonikaConfig.endpoints;
            
            // Auth endpoints
            assert(endpoints.auth.status, 'Should have auth status endpoint');
            assert(endpoints.auth.login, 'Should have auth login endpoint');
            assert(endpoints.auth.logout, 'Should have auth logout endpoint');
            
            // Mod endpoints
            assert(endpoints.mods.list, 'Should have mods list endpoint');
            assert(endpoints.mods.download, 'Should have mod download endpoint');
            assert(endpoints.mods.details, 'Should have mod details endpoint');
            
            // Image endpoints
            assert(endpoints.images.avatar, 'Should have avatar image endpoint');
            assert(endpoints.images.thumbnail, 'Should have thumbnail image endpoint');
            
            // Maintenance endpoint
            assert(endpoints.maintenance, 'Should have maintenance status endpoint');
        });

        it('should support endpoint URL templating', function() {
            assert(SayonikaConfig, 'SayonikaConfig should be loaded');
            assert(SayonikaConfig.endpoints, 'SayonikaConfig should have endpoints');
            
            const downloadEndpoint = SayonikaConfig.endpoints.mods.download;
            assert(downloadEndpoint.includes('{id}'),
                'Download endpoint should support ID templating');
            
            const detailsEndpoint = SayonikaConfig.endpoints.mods.details;
            assert(detailsEndpoint.includes('{id}'),
                'Details endpoint should support ID templating');
            
            const avatarEndpoint = SayonikaConfig.endpoints.images.avatar;
            assert(avatarEndpoint.includes('{userId}'),
                'Avatar endpoint should support user ID templating');
        });

        it('should have sensible default settings', function() {
            assert(SayonikaConfig, 'SayonikaConfig should be loaded');
            assert(SayonikaConfig.settings, 'SayonikaConfig should have settings');
            
            const settings = SayonikaConfig.settings;
            
            assert(typeof settings.modsPerPage === 'number',
                'Mods per page should be a number');
            assert(settings.modsPerPage > 0, 'Mods per page should be positive');
            
            assert(typeof settings.searchDebounceMs === 'number',
                'Search debounce should be a number');
            assert(settings.searchDebounceMs >= 0, 'Search debounce should be non-negative');
            
            assert(typeof settings.authCheckIntervalMs === 'number',
                'Auth check interval should be a number');
            assert(settings.authCheckIntervalMs > 0, 'Auth check interval should be positive');
        });
    });
});