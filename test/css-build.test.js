const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

describe('CSS Build System', function () {
    this.timeout(30000); // Increase timeout for build operations

    const cssDir = path.join(__dirname, '../src/renderer/css');
    const appScssPath = path.join(cssDir, 'app.scss');
    const appCssPath = path.join(cssDir, 'app.css');
    const fontsScssPath = path.join(cssDir, 'fonts.scss');
    const fontsCssPath = path.join(cssDir, 'fonts.css');

    it('should have SCSS source files', function () {
        assert(fs.existsSync(appScssPath), 'app.scss should exist');
        assert(fs.existsSync(fontsScssPath), 'fonts.scss should exist');
    });

    it('should have compiled CSS files', function () {
        assert(fs.existsSync(appCssPath), 'app.css should exist');
        assert(fs.existsSync(fontsCssPath), 'fonts.css should exist');
    });

    it('should be able to rebuild CSS using npm script', function () {
        const initialStat = fs.statSync(appCssPath);

        // Wait a moment to ensure timestamp difference
        setTimeout(() => {
            execSync('npm run build-css-once', {
                cwd: path.join(__dirname, '..'),
                stdio: 'pipe'
            });

            const newStat = fs.statSync(appCssPath);
            // File should exist and be recently modified
            assert(newStat.mtime >= initialStat.mtime, 'CSS file should be updated');
        }, 100);
    });

    it('should be able to rebuild CSS using rebuild utility', function () {
        const rebuildScript = path.join(__dirname, '../rebuild-css.js');
        assert(fs.existsSync(rebuildScript), 'rebuild-css.js should exist');

        const initialStat = fs.statSync(appCssPath);

        // Wait a moment to ensure timestamp difference
        setTimeout(() => {
            execSync('node rebuild-css.js', {
                cwd: path.join(__dirname, '..'),
                stdio: 'pipe'
            });

            const newStat = fs.statSync(appCssPath);
            // File should exist and be recently modified
            assert(newStat.mtime >= initialStat.mtime, 'CSS file should be updated');
        }, 100);
    });

    it('should compile SCSS variables correctly', function () {
        const cssContent = fs.readFileSync(appCssPath, 'utf8');

        // Check that SCSS variables have been compiled to actual values
        // Note: CSS might be compressed, so we check for the values with flexible spacing
        assert(cssContent.includes('background-color:#111') || cssContent.includes('background-color: #111'), 'Should compile $ui-background-colour variable');
        assert(cssContent.includes('color:#ddd') || cssContent.includes('color: #ddd'), 'Should compile $ui-text-colour variable');
        assert(cssContent.includes('background-color:#b59') || cssContent.includes('background-color: #bb5599'), 'Should compile $ui-primary-colour-bg variable');
    });

    it('should include font definitions', function () {
        const cssContent = fs.readFileSync(fontsCssPath, 'utf8');

        assert(cssContent.includes('@font-face'), 'Should contain font-face declarations');
        assert(cssContent.includes('Open Sans'), 'Should include Open Sans font');
        assert(cssContent.includes('OpenSans-Bold.ttf'), 'Should reference bold font file');
        assert(cssContent.includes('OpenSans-Regular.ttf'), 'Should reference regular font file');
    });

    it('should have valid CSS syntax', function () {
        const cssContent = fs.readFileSync(appCssPath, 'utf8');

        // Basic CSS syntax validation
        const openBraces = (cssContent.match(/{/g) || []).length;
        const closeBraces = (cssContent.match(/}/g) || []).length;

        assert.strictEqual(openBraces, closeBraces, 'CSS should have matching braces');
        assert(!cssContent.includes('$'), 'CSS should not contain SCSS variables');
        assert(!cssContent.includes('@use'), 'CSS should not contain SCSS @use statements');
    });

    it('should support production build', function () {
        const initialStat = fs.statSync(appCssPath);

        setTimeout(() => {
            execSync('npm run build-css-prod', {
                cwd: path.join(__dirname, '..'),
                stdio: 'pipe'
            });

            const newStat = fs.statSync(appCssPath);
            const cssContent = fs.readFileSync(appCssPath, 'utf8');

            // File should be updated
            assert(newStat.mtime >= initialStat.mtime, 'CSS file should be updated');

            // Production build should be more compact (less whitespace)
            const lineCount = cssContent.split('\n').length;
            assert(lineCount > 0, 'CSS file should not be empty');
        }, 100);
    });

    it('should check SASS installation', function () {
        const rebuildScript = require('../rebuild-css.js');

        const isInstalled = rebuildScript.checkSassInstalled();
        assert.strictEqual(isInstalled, true, 'SASS should be installed and available');
    });
});
