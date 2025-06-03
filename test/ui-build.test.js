const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('UI Build System Tests', function() {
    this.timeout(30000); // Increase timeout for build operations

    const cssDir = path.join(__dirname, '../src/renderer/css');
    const appScssPath = path.join(cssDir, 'app.scss');
    const appCssPath = path.join(cssDir, 'app.css');
    const fontsScssPath = path.join(cssDir, 'fonts.scss');
    const fontsCssPath = path.join(cssDir, 'fonts.css');
    const sayonikaScssPath = path.join(cssDir, 'sayonika-store.scss');
    const sayonikaCssPath = path.join(cssDir, 'sayonika-store.css');

    describe('Source Files', function() {
        it('should have SCSS source files', function() {
            assert(fs.existsSync(appScssPath), 'app.scss should exist');
            assert(fs.existsSync(fontsScssPath), 'fonts.scss should exist');
            assert(fs.existsSync(sayonikaScssPath), 'sayonika-store.scss should exist');
        });

        it('should have valid SCSS syntax in source files', function() {
            const scssFiles = [appScssPath, fontsScssPath, sayonikaScssPath];
            
            scssFiles.forEach(filePath => {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Basic SCSS syntax validation
                const openBraces = (content.match(/{/g) || []).length;
                const closeBraces = (content.match(/}/g) || []).length;
                assert.strictEqual(openBraces, closeBraces, 
                    `SCSS file ${path.basename(filePath)} should have matching braces`);
                
                // Should not contain CSS-only syntax errors
                assert(!content.includes('/**/'), 
                    `SCSS file ${path.basename(filePath)} should not contain empty CSS comments`);
            });
        });

        it('should have SCSS variables and features', function() {
            const appScssContent = fs.readFileSync(appScssPath, 'utf8');
            
            // Check for SCSS variables
            assert(appScssContent.includes('$'), 'app.scss should contain SCSS variables');
            
            // Check for SCSS nesting (common pattern)
            const nestedPatterns = [
                /\w+\s*{\s*\w+\s*{/,  // Basic nesting pattern
                /&\s*:/,               // Pseudo-selector nesting
                /&\.\w+/               // Class nesting
            ];
            
            const hasNesting = nestedPatterns.some(pattern => pattern.test(appScssContent));
            assert(hasNesting, 'app.scss should use SCSS nesting features');
        });
    });

    describe('Compiled Files', function() {
        it('should have compiled CSS files', function() {
            assert(fs.existsSync(appCssPath), 'app.css should exist');
            assert(fs.existsSync(fontsCssPath), 'fonts.css should exist');
            assert(fs.existsSync(sayonikaCssPath), 'sayonika-store.css should exist');
        });

        it('should have valid CSS syntax in compiled files', function() {
            const cssFiles = [appCssPath, fontsCssPath, sayonikaCssPath];
            
            cssFiles.forEach(filePath => {
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // Basic CSS syntax validation
                    const openBraces = (content.match(/{/g) || []).length;
                    const closeBraces = (content.match(/}/g) || []).length;
                    assert.strictEqual(openBraces, closeBraces, 
                        `CSS file ${path.basename(filePath)} should have matching braces`);
                    
                    // Should not contain SCSS syntax
                    assert(!content.includes('$'), 
                        `CSS file ${path.basename(filePath)} should not contain SCSS variables`);
                    assert(!content.includes('@use'), 
                        `CSS file ${path.basename(filePath)} should not contain SCSS @use statements`);
                    assert(!content.includes('@import'), 
                        `CSS file ${path.basename(filePath)} should not contain @import statements in final CSS`);
                }
            });
        });

        it('should compile SCSS variables correctly', function() {
            if (fs.existsSync(appCssPath)) {
                const cssContent = fs.readFileSync(appCssPath, 'utf8');

                // Check that SCSS variables have been compiled to actual values
                // Look for common UI colors (flexible matching for different CSS formatting)
                const hasCompiledColors = [
                    /#[0-9a-fA-F]{3,6}/, // Hex colors
                    /rgb\(\s*\d+,\s*\d+,\s*\d+\s*\)/, // RGB colors
                    /rgba\(\s*\d+,\s*\d+,\s*\d+,\s*[\d.]+\s*\)/ // RGBA colors
                ].some(pattern => pattern.test(cssContent));
                
                assert(hasCompiledColors, 'CSS should contain compiled color values');
            }
        });
    });

    describe('Build Scripts', function() {
        it('should be able to rebuild CSS using npm script', function() {
            const initialStat = fs.existsSync(appCssPath) ? fs.statSync(appCssPath) : null;

            try {
                execSync('npm run build-css-once', {
                    cwd: path.join(__dirname, '..'),
                    stdio: 'pipe',
                    timeout: 20000
                });

                assert(fs.existsSync(appCssPath), 'CSS file should exist after build');
                
                if (initialStat) {
                    const newStat = fs.statSync(appCssPath);
                    assert(newStat.mtime >= initialStat.mtime, 'CSS file should be updated');
                }
            } catch (error) {
                // If npm script fails, check if it's due to missing sass
                if (error.message.includes('sass')) {
                    console.warn('Warning: Sass not available for build test');
                } else {
                    throw error;
                }
            }
        });

        it('should have rebuild utility script', function() {
            const rebuildScript = path.join(__dirname, '../rebuild-css.js');
            assert(fs.existsSync(rebuildScript), 'rebuild-css.js should exist');
            
            const rebuildContent = fs.readFileSync(rebuildScript, 'utf8');
            assert(rebuildContent.includes('sass'), 'Rebuild script should reference sass');
            assert(rebuildContent.includes('checkSassInstalled'), 'Rebuild script should check for sass installation');
        });

        it('should support production build', function() {
            try {
                const initialStat = fs.existsSync(appCssPath) ? fs.statSync(appCssPath) : null;

                execSync('npm run build-css-prod', {
                    cwd: path.join(__dirname, '..'),
                    stdio: 'pipe',
                    timeout: 20000
                });

                assert(fs.existsSync(appCssPath), 'CSS file should exist after production build');
                
                if (initialStat) {
                    const newStat = fs.statSync(appCssPath);
                    assert(newStat.mtime >= initialStat.mtime, 'CSS file should be updated');
                }

                // Production build might be compressed
                const cssContent = fs.readFileSync(appCssPath, 'utf8');
                assert(cssContent.length > 0, 'CSS file should not be empty');
            } catch (error) {
                if (error.message.includes('sass')) {
                    console.warn('Warning: Sass not available for production build test');
                } else {
                    throw error;
                }
            }
        });
    });

    describe('Font Integration', function() {
        it('should include font definitions', function() {
            if (fs.existsSync(fontsCssPath)) {
                const cssContent = fs.readFileSync(fontsCssPath, 'utf8');

                assert(cssContent.includes('@font-face'), 'Should contain font-face declarations');
                assert(cssContent.includes('Open Sans'), 'Should include Open Sans font family');
            }
        });

        it('should have font files available', function() {
            const fontDir = path.join(__dirname, '../src/renderer/fonts');
            if (fs.existsSync(fontDir)) {
                const fontFiles = fs.readdirSync(fontDir).filter(file => 
                    file.endsWith('.ttf') || file.endsWith('.woff') || file.endsWith('.woff2')
                );
                assert(fontFiles.length > 0, 'Should have font files available');
            }
        });
    });

    describe('Sayonika Store Styles', function() {
        it('should have Sayonika-specific styles', function() {
            if (fs.existsSync(sayonikaCssPath)) {
                const cssContent = fs.readFileSync(sayonikaCssPath, 'utf8');

                const expectedClasses = [
                    '.sayonika-store',
                    '.mod-card',
                    '.modal-overlay'
                ];

                expectedClasses.forEach(className => {
                    assert(cssContent.includes(className), 
                        `Sayonika CSS should contain ${className} styles`);
                });
            }
        });

        it('should be included in HTML', function() {
            const htmlPath = path.join(__dirname, '../src/renderer/html/index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            
            assert(htmlContent.includes('sayonika-store.css'), 
                'HTML should include Sayonika store CSS');
        });
    });

    describe('CSS Asset Management', function() {
        it('should handle background images correctly', function() {
            const backgroundDir = path.join(__dirname, '../src/renderer/images/backgrounds');
            if (fs.existsSync(backgroundDir)) {
                const backgroundFiles = fs.readdirSync(backgroundDir);
                assert(backgroundFiles.length > 0, 'Should have background image files');
                
                // Check that at least one background file is a valid image format
                const imageFiles = backgroundFiles.filter(file => 
                    /\.(png|jpg|jpeg|gif|svg)$/i.test(file)
                );
                assert(imageFiles.length > 0, 'Should have valid image files');
            }
        });

        it('should handle icon assets', function() {
            const imagesDir = path.join(__dirname, '../src/renderer/images');
            if (fs.existsSync(imagesDir)) {
                const requiredImages = [
                    'ddmm.png',
                    'default-avatar.svg',
                    'default-mod-thumbnail.svg'
                ];

                requiredImages.forEach(image => {
                    const imagePath = path.join(imagesDir, image);
                    if (fs.existsSync(imagePath)) {
                        const content = fs.readFileSync(imagePath);
                        assert(content.length > 0, `Image ${image} should not be empty`);
                    }
                });
            }
        });
    });

    describe('CSS Performance', function() {
        it('should not have excessive file sizes', function() {
            const cssFiles = [appCssPath, fontsCssPath, sayonikaCssPath];
            
            cssFiles.forEach(filePath => {
                if (fs.existsSync(filePath)) {
                    const stats = fs.statSync(filePath);
                    const sizeMB = stats.size / (1024 * 1024);
                    
                    // CSS files should generally be under 5MB
                    assert(sizeMB < 5, 
                        `CSS file ${path.basename(filePath)} should be under 5MB (current: ${sizeMB.toFixed(2)}MB)`);
                }
            });
        });

        it('should not have redundant CSS rules', function() {
            if (fs.existsSync(appCssPath)) {
                const cssContent = fs.readFileSync(appCssPath, 'utf8');
                
                // Check for common redundant patterns
                const redundantPatterns = [
                    /\*\s*{\s*\*\s*{/, // Nested universal selectors
                    /\.[\w-]+\s*{\s*}\s*\.[\w-]+\s*{\s*}/ // Multiple empty rules
                ];
                
                redundantPatterns.forEach(pattern => {
                    assert(!pattern.test(cssContent), 
                        'CSS should not contain redundant patterns');
                });
            }
        });
    });
});