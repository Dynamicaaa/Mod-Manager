const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Core Application Tests', function() {
    describe('Project Structure', function() {
        it('should have required package.json', function() {
            const packagePath = path.join(__dirname, '../package.json');
            assert(fs.existsSync(packagePath), 'package.json should exist');
            
            const packageJson = require('../package.json');
            assert.strictEqual(packageJson.name, 'doki-doki-mod-manager', 'Package name should be correct');
            assert.strictEqual(packageJson.productName, 'Doki Doki Mod Manager', 'Product name should be correct');
            assert(packageJson.version, 'Version should be defined');
            assert(packageJson.main, 'Main entry point should be defined');
        });

        it('should have required directories', function() {
            const requiredDirs = [
                'src',
                'src/main',
                'src/renderer',
                'lang',
                'test'
            ];

            requiredDirs.forEach(dir => {
                const dirPath = path.join(__dirname, '..', dir);
                assert(fs.existsSync(dirPath), `Directory ${dir} should exist`);
                assert(fs.statSync(dirPath).isDirectory(), `${dir} should be a directory`);
            });
        });

        it('should have main process entry point', function() {
            const mainPath = path.join(__dirname, '../src/main/index.ts');
            assert(fs.existsSync(mainPath), 'Main process entry point should exist');
        });

        it('should have renderer files', function() {
            const rendererFiles = [
                'src/renderer/html/index.html',
                'src/renderer/js/app.js',
                'src/renderer/css/app.scss'
            ];

            rendererFiles.forEach(file => {
                const filePath = path.join(__dirname, '..', file);
                assert(fs.existsSync(filePath), `Renderer file ${file} should exist`);
            });
        });
    });

    describe('Dependencies', function() {
        let packageJson;

        before(function() {
            packageJson = require('../package.json');
        });

        it('should have core Electron dependencies', function() {
            assert(packageJson.devDependencies.electron, 'Should have Electron as dev dependency');
            assert(packageJson.dependencies['@electron/remote'], 'Should have @electron/remote');
        });

        it('should have build tools', function() {
            assert(packageJson.devDependencies['electron-builder'], 'Should have electron-builder');
            assert(packageJson.devDependencies.sass, 'Should have Sass compiler');
            assert(packageJson.devDependencies.typescript, 'Should have TypeScript');
        });

        it('should have testing framework', function() {
            assert(packageJson.devDependencies.mocha, 'Should have Mocha test framework');
        });

        it('should have UI dependencies', function() {
            assert(packageJson.dependencies.vue, 'Should have Vue.js');
            assert(packageJson.dependencies['@fortawesome/fontawesome-free'], 'Should have FontAwesome');
        });

        it('should have utility dependencies', function() {
            assert(packageJson.dependencies.semver, 'Should have semver for version handling');
            assert(packageJson.dependencies.axios, 'Should have axios for HTTP requests');
            assert(packageJson.dependencies['fs-extra'], 'Should have fs-extra for file operations');
        });
    });

    describe('Build Scripts', function() {
        let packageJson;

        before(function() {
            packageJson = require('../package.json');
        });

        it('should have required npm scripts', function() {
            const requiredScripts = [
                'start',
                'test',
                'build',
                'build-css',
                'clean',
                'dist'
            ];

            requiredScripts.forEach(script => {
                assert(packageJson.scripts[script], `Script '${script}' should be defined`);
            });
        });

        it('should have proper build configuration', function() {
            assert(packageJson.build, 'Build configuration should exist');
            assert(packageJson.build.appId, 'App ID should be defined');
            assert(packageJson.build.productName, 'Product name should be defined in build config');
            assert(packageJson.build.directories, 'Build directories should be defined');
        });

        it('should have cross-platform build targets', function() {
            const build = packageJson.build;
            assert(build.win, 'Windows build configuration should exist');
            assert(build.mac, 'macOS build configuration should exist');
            assert(build.linux, 'Linux build configuration should exist');
        });
    });

    describe('Configuration Files', function() {
        it('should have TypeScript configuration', function() {
            const tsconfigPath = path.join(__dirname, '../tsconfig.json');
            assert(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');
            
            const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
            assert(tsconfig.compilerOptions, 'Compiler options should be defined');
            assert(tsconfig.compilerOptions.target, 'Target should be specified');
        });

        it('should have Sass rebuild utility', function() {
            const rebuildPath = path.join(__dirname, '../rebuild-css.js');
            assert(fs.existsSync(rebuildPath), 'rebuild-css.js should exist');
        });

        it('should have Git configuration', function() {
            const gitignorePath = path.join(__dirname, '../.gitignore');
            assert(fs.existsSync(gitignorePath), '.gitignore should exist');
            
            const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
            assert(gitignoreContent.includes('node_modules'), 'Should ignore node_modules');
            assert(gitignoreContent.includes('dist'), 'Should ignore dist directory');
        });
    });
});