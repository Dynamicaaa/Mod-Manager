const assert = require("assert");
const fs = require("fs");
const path = require("path");

describe('Sayonika Integration', function () {

    it('should have the Sayonika store CSS file', function () {
        const cssPath = path.join(__dirname, '../src/renderer/css/sayonika-store.css');
        assert(fs.existsSync(cssPath), 'Sayonika store CSS file should exist');

        const cssContent = fs.readFileSync(cssPath, 'utf8');
        assert(cssContent.includes('.sayonika-store'), 'CSS should contain Sayonika store styles');
        assert(cssContent.includes('.mod-card'), 'CSS should contain mod card styles');
        assert(cssContent.includes('.modal-overlay'), 'CSS should contain modal styles');
    });

    it('should have the Sayonika configuration file', function () {
        const configPath = path.join(__dirname, '../src/renderer/js/sayonika-config.js');
        assert(fs.existsSync(configPath), 'Sayonika config file should exist');

        const configContent = fs.readFileSync(configPath, 'utf8');
        assert(configContent.includes('window.SayonikaConfig'), 'Config should define SayonikaConfig');
        assert(configContent.includes('defaultStoreUrl'), 'Config should have default store URL');
        assert(configContent.includes('detectStoreUrl'), 'Config should have store detection function');
    });

    it('should have the updated StorePlaceholderTab component', function () {
        const componentPath = path.join(__dirname, '../src/renderer/js/components/tabs/StorePlaceholderTab.js');
        assert(fs.existsSync(componentPath), 'StorePlaceholderTab component should exist');

        const componentContent = fs.readFileSync(componentPath, 'utf8');
        assert(componentContent.includes('SayonikaStoreTab'), 'Component should be renamed to SayonikaStoreTab');
        assert(componentContent.includes('checkAuthStatus'), 'Component should have authentication methods');
        assert(componentContent.includes('loadMods'), 'Component should have mod loading functionality');
        assert(componentContent.includes('downloadMod'), 'Component should have mod download functionality');
    });

    it('should have the default mod thumbnail', function () {
        const thumbnailPath = path.join(__dirname, '../src/renderer/images/default-mod-thumbnail.svg');
        assert(fs.existsSync(thumbnailPath), 'Default mod thumbnail should exist');

        const thumbnailContent = fs.readFileSync(thumbnailPath, 'utf8');
        assert(thumbnailContent.includes('<svg'), 'Thumbnail should be a valid SVG');
        assert(thumbnailContent.includes('DDLC MOD'), 'Thumbnail should contain DDLC MOD text');
    });

    it('should have updated HTML to include Sayonika assets', function () {
        const htmlPath = path.join(__dirname, '../src/renderer/html/index.html');
        assert(fs.existsSync(htmlPath), 'Main HTML file should exist');

        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        assert(htmlContent.includes('sayonika-store.css'), 'HTML should include Sayonika store CSS');
        assert(htmlContent.includes('sayonika-config.js'), 'HTML should include Sayonika config JS');
    });

    it('should have updated app.js with Sayonika store tab name', function () {
        const appPath = path.join(__dirname, '../src/renderer/js/app.js');
        assert(fs.existsSync(appPath), 'App.js file should exist');

        const appContent = fs.readFileSync(appPath, 'utf8');
        assert(appContent.includes('Sayonika Store'), 'App should reference Sayonika Store in tab name');
    });

    // Integration documentation test removed as per user preference

    describe('Component Structure', function () {
        let componentContent;

        before(function () {
            const componentPath = path.join(__dirname, '../src/renderer/js/components/tabs/StorePlaceholderTab.js');
            componentContent = fs.readFileSync(componentPath, 'utf8');
        });

        it('should have authentication methods', function () {
            assert(componentContent.includes('checkAuthStatus'), 'Should have checkAuthStatus method');
            assert(componentContent.includes('loginWithCredentials'), 'Should have loginWithCredentials method');
            assert(componentContent.includes('loginWithDiscord'), 'Should have loginWithDiscord method');
            assert(componentContent.includes('loginWithGitHub'), 'Should have loginWithGitHub method');
            assert(componentContent.includes('logout'), 'Should have logout method');
        });

        it('should support username or email login', function () {
            assert(componentContent.includes('Username or Email'), 'Should have username/email field label');
            assert(componentContent.includes('username'), 'Should reference username in login form');
            assert(componentContent.includes('trimmedUsername'), 'Should trim username input');
            assert(componentContent.includes('inputType'), 'Should detect input type (email vs username)');
        });

        it('should have mod management methods', function () {
            assert(componentContent.includes('loadMods'), 'Should have loadMods method');
            assert(componentContent.includes('loadCategories'), 'Should have loadCategories method');
            assert(componentContent.includes('searchMods'), 'Should have searchMods method');
            assert(componentContent.includes('downloadMod'), 'Should have downloadMod method');
            assert(componentContent.includes('showModDetails'), 'Should have showModDetails method');
        });

        it('should have utility methods', function () {
            assert(componentContent.includes('getModThumbnail'), 'Should have getModThumbnail method');
            assert(componentContent.includes('formatNumber'), 'Should have formatNumber method');
            assert(componentContent.includes('formatDate'), 'Should have formatDate method');
            assert(componentContent.includes('detectStoreUrl'), 'Should have detectStoreUrl method');
        });

        it('should have proper Vue component structure', function () {
            assert(componentContent.includes('Vue.component'), 'Should be a Vue component');
            assert(componentContent.includes('"data"'), 'Should have data section');
            assert(componentContent.includes('"methods"'), 'Should have methods section');
            assert(componentContent.includes('"mounted"'), 'Should have mounted lifecycle hook');
            assert(componentContent.includes('"computed"'), 'Should have computed properties');
        });
    });

    describe('CSS Structure', function () {
        let cssContent;

        before(function () {
            const cssPath = path.join(__dirname, '../src/renderer/css/sayonika-store.css');
            cssContent = fs.readFileSync(cssPath, 'utf8');
        });

        it('should have main store styles', function () {
            assert(cssContent.includes('.sayonika-store'), 'Should have main store container styles');
            assert(cssContent.includes('.store-header'), 'Should have header styles');
            assert(cssContent.includes('.store-filters'), 'Should have filter styles');
            assert(cssContent.includes('.mods-grid'), 'Should have grid styles');
        });

        it('should have mod card styles', function () {
            assert(cssContent.includes('.mod-card'), 'Should have mod card styles');
            assert(cssContent.includes('.mod-thumbnail'), 'Should have thumbnail styles');
            assert(cssContent.includes('.mod-info'), 'Should have mod info styles');
            assert(cssContent.includes('.mod-actions'), 'Should have action button styles');
        });

        it('should have modal styles', function () {
            assert(cssContent.includes('.modal-overlay'), 'Should have modal overlay styles');
            assert(cssContent.includes('.modal-content'), 'Should have modal content styles');
            assert(cssContent.includes('.login-options'), 'Should have login modal styles');
            assert(cssContent.includes('.mod-details-modal'), 'Should have mod details modal styles');
        });

        it('should have responsive design', function () {
            assert(cssContent.includes('@media'), 'Should have responsive media queries');
            assert(cssContent.includes('max-width: 768px'), 'Should have mobile breakpoint');
        });
    });

    describe('Image API Integration', function () {
        let configContent;

        before(function () {
            // Mock window object for Node.js testing
            global.window = {};

            // Load the SayonikaConfig
            require('../src/renderer/js/sayonika-config.js');
            configContent = global.window.SayonikaConfig;
        });

        it('should have image API endpoints defined', function () {
            assert(configContent.endpoints.images, 'Should have images endpoints');
            assert(configContent.endpoints.images.avatar, 'Should have avatar endpoint');
            assert(configContent.endpoints.images.thumbnail, 'Should have thumbnail endpoint');
        });

        it('should generate correct avatar URLs', function () {
            const avatarUrl = configContent.getAvatarUrl(1, '64', 'http://localhost:3000');
            assert.strictEqual(avatarUrl, 'http://localhost:3000/api/images/avatar/1?size=64', 'Should generate correct avatar URL');
        });

        it('should generate correct thumbnail URLs', function () {
            const thumbnailUrl = configContent.getThumbnailUrl(2, '300x200', 'http://localhost:3000');
            assert.strictEqual(thumbnailUrl, 'http://localhost:3000/api/images/thumbnail/2?size=300x200', 'Should generate correct thumbnail URL');
        });

        it('should use default parameters when not specified', function () {
            const defaultAvatarUrl = configContent.getAvatarUrl(1);
            assert(defaultAvatarUrl.includes('size=64'), 'Should use default avatar size');

            const defaultThumbnailUrl = configContent.getThumbnailUrl(2);
            assert(defaultThumbnailUrl.includes('size=300x200'), 'Should use default thumbnail size');
        });
    });
});
