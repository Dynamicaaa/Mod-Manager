/**
 * Test script for container activation/deactivation functionality
 * Tests the core Phase 2 container-based mod management features
 */

const { ModContainerManager } = require('../src/main/container/ModContainerManager');
const { ModInstaller } = require('../src/main/mod/ModInstaller');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');

/**
 * Test suite for container functionality
 */
class ContainerTestSuite {
    constructor() {
        this.testDir = path.join(os.tmpdir(), 'ddmm-container-test');
        this.mockInstallPath = path.join(this.testDir, 'install');
        this.mockModPath = path.join(this.testDir, 'test-mod');
    }

    /**
     * Set up test environment
     */
    async setup() {
        console.log('🔧 Setting up test environment...');
        
        // Clean up any existing test directory
        if (fs.existsSync(this.testDir)) {
            fs.removeSync(this.testDir);
        }
        
        // Create test directories
        fs.mkdirpSync(this.mockInstallPath);
        fs.mkdirpSync(this.mockModPath);
        
        // Create a mock mod structure
        const mockGameDir = path.join(this.mockModPath, 'game');
        fs.mkdirpSync(mockGameDir);
        
        // Create some mock mod files
        fs.writeFileSync(path.join(mockGameDir, 'script.rpy'), '# Mock mod script');
        fs.writeFileSync(path.join(mockGameDir, 'options.rpy'), '# Mock options');
        fs.writeFileSync(path.join(this.mockModPath, 'README.md'), '# Test Mod');
        
        console.log('✅ Test environment created');
    }

    /**
     * Test container manager initialization
     */
    async testContainerInitialization() {
        console.log('\n📦 Testing container manager initialization...');
        
        try {
            // Initialize container manager with test directory
            ModContainerManager.initialize(this.testDir);
            
            // Test that we can get an empty list of containers
            const containers = ModContainerManager.listContainers();
            if (containers.length === 0) {
                console.log('✅ Container manager initialized successfully');
                return true;
            } else {
                console.log('❌ Expected empty container list, got:', containers.length);
                return false;
            }
        } catch (error) {
            console.log('❌ Container initialization failed:', error.message);
            return false;
        }
    }

    /**
     * Test container creation
     */
    async testContainerCreation() {
        console.log('\n🏗️ Testing container creation...');
        
        try {
            // Create a mock manifest
            const manifest = ModContainerManager.createModManifest({
                name: 'Test Mod',
                version: '1.0.0',
                author: 'Test Author',
                description: 'A test mod for container functionality',
                files: ['game/script.rpy', 'game/options.rpy', 'README.md'],
                originalModPath: this.mockModPath,
                mapper: 'TestMapper'
            });

            // Create container
            const container = await ModContainerManager.createContainer(
                this.mockModPath,
                this.mockInstallPath,
                manifest,
                'partial'
            );

            if (container && container.id && container.name === 'Test Mod') {
                console.log('✅ Container created successfully:', container.id);
                return container;
            } else {
                console.log('❌ Container creation failed');
                return null;
            }
        } catch (error) {
            console.log('❌ Container creation failed:', error.message);
            return null;
        }
    }

    /**
     * Test container activation
     */
    async testContainerActivation(container) {
        console.log('\n🚀 Testing container activation...');
        
        try {
            // Activate the container
            await ModContainerManager.activateContainer(container.id, this.mockInstallPath);
            
            // Check if container is marked as active
            const activeContainer = ModContainerManager.getActiveContainer();
            
            if (activeContainer && activeContainer.id === container.id && activeContainer.isActive) {
                console.log('✅ Container activated successfully');
                return true;
            } else {
                console.log('❌ Container activation failed - not marked as active');
                return false;
            }
        } catch (error) {
            console.log('❌ Container activation failed:', error.message);
            return false;
        }
    }

    /**
     * Test container deactivation
     */
    async testContainerDeactivation(container) {
        console.log('\n⏹️ Testing container deactivation...');
        
        try {
            // Deactivate the container
            await ModContainerManager.deactivateContainer(container.id);
            
            // Check if no container is active
            const activeContainer = ModContainerManager.getActiveContainer();
            
            if (!activeContainer) {
                console.log('✅ Container deactivated successfully');
                return true;
            } else {
                console.log('❌ Container deactivation failed - still has active container');
                return false;
            }
        } catch (error) {
            console.log('❌ Container deactivation failed:', error.message);
            return false;
        }
    }

    /**
     * Test container conflict detection
     */
    async testContainerConflicts(container) {
        console.log('\n⚠️ Testing container conflict detection...');
        
        try {
            // Check for conflicts with the container
            const conflicts = await ModContainerManager.checkContainerConflicts(container);
            
            // Should have no conflicts since it's the only container
            if (Array.isArray(conflicts) && conflicts.length === 0) {
                console.log('✅ Conflict detection working (no conflicts found)');
                return true;
            } else {
                console.log('❌ Unexpected conflicts detected:', conflicts);
                return false;
            }
        } catch (error) {
            console.log('❌ Conflict detection failed:', error.message);
            return false;
        }
    }

    /**
     * Test container validation
     */
    async testContainerValidation(container) {
        console.log('\n🔍 Testing container validation...');
        
        try {
            // Validate the container
            const validation = await ModContainerManager.validateContainer(container.id);
            
            if (validation.isValid) {
                console.log('✅ Container validation passed');
                return true;
            } else {
                console.log('❌ Container validation failed:', validation.issues);
                return false;
            }
        } catch (error) {
            console.log('❌ Container validation failed:', error.message);
            return false;
        }
    }

    /**
     * Test container statistics
     */
    async testContainerStatistics() {
        console.log('\n📊 Testing container statistics...');
        
        try {
            const stats = ModContainerManager.getContainerStatistics();
            
            if (stats.totalContainers === 1 && stats.activeContainers === 0 && stats.inactiveContainers === 1) {
                console.log('✅ Container statistics correct:', stats);
                return true;
            } else {
                console.log('❌ Container statistics incorrect:', stats);
                return false;
            }
        } catch (error) {
            console.log('❌ Container statistics failed:', error.message);
            return false;
        }
    }

    /**
     * Test container removal
     */
    async testContainerRemoval(container) {
        console.log('\n🗑️ Testing container removal...');
        
        try {
            // Remove the container
            await ModContainerManager.removeContainer(container.id);
            
            // Check if container is gone
            const containers = ModContainerManager.listContainers();
            const removedContainer = ModContainerManager.getContainer(container.id);
            
            if (containers.length === 0 && !removedContainer) {
                console.log('✅ Container removed successfully');
                return true;
            } else {
                console.log('❌ Container removal failed - still exists');
                return false;
            }
        } catch (error) {
            console.log('❌ Container removal failed:', error.message);
            return false;
        }
    }

    /**
     * Clean up test environment
     */
    async cleanup() {
        console.log('\n🧹 Cleaning up test environment...');
        
        try {
            if (fs.existsSync(this.testDir)) {
                fs.removeSync(this.testDir);
            }
            console.log('✅ Test environment cleaned up');
        } catch (error) {
            console.log('⚠️ Cleanup warning:', error.message);
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting Container Management Test Suite');
        console.log('==========================================');
        
        const results = {
            passed: 0,
            failed: 0,
            total: 0
        };

        // Setup
        await this.setup();

        // Test container manager initialization
        results.total++;
        if (await this.testContainerInitialization()) {
            results.passed++;
        } else {
            results.failed++;
        }

        // Test container creation
        results.total++;
        const container = await this.testContainerCreation();
        if (container) {
            results.passed++;
        } else {
            results.failed++;
            await this.cleanup();
            return results;
        }

        // Test container activation
        results.total++;
        if (await this.testContainerActivation(container)) {
            results.passed++;
        } else {
            results.failed++;
        }

        // Test container deactivation
        results.total++;
        if (await this.testContainerDeactivation(container)) {
            results.passed++;
        } else {
            results.failed++;
        }

        // Test container conflicts
        results.total++;
        if (await this.testContainerConflicts(container)) {
            results.passed++;
        } else {
            results.failed++;
        }

        // Test container validation
        results.total++;
        if (await this.testContainerValidation(container)) {
            results.passed++;
        } else {
            results.failed++;
        }

        // Test container statistics
        results.total++;
        if (await this.testContainerStatistics()) {
            results.passed++;
        } else {
            results.failed++;
        }

        // Test container removal
        results.total++;
        if (await this.testContainerRemoval(container)) {
            results.passed++;
        } else {
            results.failed++;
        }

        // Cleanup
        await this.cleanup();

        // Print results
        console.log('\n📋 Test Results');
        console.log('===============');
        console.log(`✅ Passed: ${results.passed}/${results.total}`);
        console.log(`❌ Failed: ${results.failed}/${results.total}`);
        console.log(`📊 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);

        if (results.failed === 0) {
            console.log('\n🎉 All container tests passed! Phase 2 implementation is working correctly.');
        } else {
            console.log('\n⚠️ Some tests failed. Please review the implementation.');
        }

        return results;
    }
}

// Export for use in other test files
module.exports = { ContainerTestSuite };

// Run tests if this file is executed directly
if (require.main === module) {
    const testSuite = new ContainerTestSuite();
    testSuite.runAllTests().then(results => {
        process.exit(results.failed === 0 ? 0 : 1);
    }).catch(error => {
        console.error('Test suite failed:', error);
        process.exit(1);
    });
}