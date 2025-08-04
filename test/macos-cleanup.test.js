const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Import the compiled JavaScript version
const MacOSFileCleanup = require('../lib/src/main/utils/MacOSFileCleanup').default;

describe('MacOSFileCleanup', function() {
    let testDir;
    
    beforeEach(function() {
        // Create a temporary test directory
        testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ddmm-test-'));
    });
    
    afterEach(function() {
        // Clean up test directory
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });
    
    it('should identify resource fork files correctly', function() {
        // Create test files
        const normalFile = path.join(testDir, 'normal.txt');
        const resourceForkFile = path.join(testDir, '._scripts.rpi');
        const dsStoreFile = path.join(testDir, '.DS_Store');
        
        fs.writeFileSync(normalFile, 'normal content');
        fs.writeFileSync(resourceForkFile, 'resource fork content');
        fs.writeFileSync(dsStoreFile, 'ds store content');
        
        // Verify files exist before cleanup
        assert(fs.existsSync(normalFile), 'Normal file should exist');
        assert(fs.existsSync(resourceForkFile), 'Resource fork file should exist');
        assert(fs.existsSync(dsStoreFile), 'DS_Store file should exist');
        
        // Run cleanup
        MacOSFileCleanup.cleanMacOSFiles(testDir, false);
        
        if (process.platform === 'darwin') {
            // On macOS, problematic files should be removed
            assert(fs.existsSync(normalFile), 'Normal file should remain');
            assert(!fs.existsSync(resourceForkFile), 'Resource fork file should be removed');
            assert(!fs.existsSync(dsStoreFile), 'DS_Store file should be removed');
        } else {
            // On other platforms, all files should remain
            assert(fs.existsSync(normalFile), 'Normal file should remain');
            assert(fs.existsSync(resourceForkFile), 'Resource fork file should remain on non-macOS');
            assert(fs.existsSync(dsStoreFile), 'DS_Store file should remain on non-macOS');
        }
    });
    
    it('should clean recursively when specified', function() {
        // Create nested directory structure
        const subDir = path.join(testDir, 'game');
        fs.mkdirSync(subDir);
        
        const normalFile = path.join(subDir, 'script.rpy');
        const resourceForkFile = path.join(subDir, '._script.rpy');
        
        fs.writeFileSync(normalFile, 'script content');
        fs.writeFileSync(resourceForkFile, 'resource fork content');
        
        // Verify files exist before cleanup
        assert(fs.existsSync(normalFile), 'Normal file should exist');
        assert(fs.existsSync(resourceForkFile), 'Resource fork file should exist');
        
        // Run recursive cleanup
        MacOSFileCleanup.cleanMacOSFiles(testDir, true);
        
        if (process.platform === 'darwin') {
            // On macOS, resource fork should be removed
            assert(fs.existsSync(normalFile), 'Normal file should remain');
            assert(!fs.existsSync(resourceForkFile), 'Resource fork file should be removed');
        } else {
            // On other platforms, all files should remain
            assert(fs.existsSync(normalFile), 'Normal file should remain');
            assert(fs.existsSync(resourceForkFile), 'Resource fork file should remain on non-macOS');
        }
    });
    
    it('should handle missing directories gracefully', function() {
        const nonExistentDir = path.join(testDir, 'does-not-exist');
        
        // Should not throw an error
        assert.doesNotThrow(() => {
            MacOSFileCleanup.cleanMacOSFiles(nonExistentDir, true);
        }, 'Should handle missing directories gracefully');
    });
    
    it('should clean game installation directories', function() {
        // Create a mock game installation structure
        const gameDir = path.join(testDir, 'game');
        const renpyDir = path.join(testDir, 'renpy');
        
        fs.mkdirSync(gameDir);
        fs.mkdirSync(renpyDir);
        
        // Create problematic files in various locations
        const files = [
            path.join(testDir, '._main.exe'),
            path.join(testDir, '.DS_Store'),
            path.join(gameDir, '._script.rpy'),
            path.join(renpyDir, '._bootstrap.py')
        ];
        
        files.forEach(file => fs.writeFileSync(file, 'content'));
        
        // Verify files exist before cleanup
        files.forEach(file => assert(fs.existsSync(file), `File ${file} should exist`));
        
        // Run game installation cleanup
        MacOSFileCleanup.cleanGameInstallation(testDir);
        
        if (process.platform === 'darwin') {
            // On macOS, all problematic files should be removed
            files.forEach(file => assert(!fs.existsSync(file), `File ${file} should be removed on macOS`));
        } else {
            // On other platforms, all files should remain
            files.forEach(file => assert(fs.existsSync(file), `File ${file} should remain on non-macOS`));
        }
    });
});