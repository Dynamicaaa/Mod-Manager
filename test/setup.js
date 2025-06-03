// Test setup for DDMM
// This file runs before all tests to set up common mocks and configurations

const path = require('path');

// Mock global objects for Node.js environment
global.window = {};
global.document = {
    addEventListener: () => {},
    body: {
        addEventListener: () => {},
        classList: {
            add: () => {},
            remove: () => {},
            contains: () => false
        }
    },
    querySelectorAll: () => [],
    createElement: () => ({
        focus: () => {},
        style: {}
    })
};

global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
};

global.fetch = async (url, options) => {
    // Mock fetch for testing
    if (url.includes('/api/maintenance/status')) {
        if (url.includes('maintenance-test')) {
            return {
                ok: true,
                json: async () => ({
                    maintenance: true,
                    message: "Sayonika is currently undergoing scheduled maintenance. We'll be back soon!",
                    estimatedTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
                })
            };
        } else {
            return {
                ok: true,
                json: async () => ({
                    maintenance: false
                })
            };
        }
    }
    
    if (url.includes('/api/auth/login')) {
        return {
            ok: false,
            status: 503,
            json: async () => ({
                error: "Service temporarily unavailable"
            })
        };
    }
    
    if (url.includes('/api/auth/status')) {
        return {
            ok: false,
            status: 503,
            json: async () => ({
                authenticated: false
            })
        };
    }
    
    if (url.includes('/api/categories')) {
        if (url.includes('maintenance')) {
            return {
                ok: false,
                status: 503,
                json: async () => ({
                    error: "Service temporarily unavailable"
                })
            };
        } else {
            return {
                ok: true,
                json: async () => ([
                    { id: 1, name: "Test Category" }
                ])
            };
        }
    }
    
    return {
        ok: false,
        status: 404,
        json: async () => ({ error: "Not found" })
    };
};

// Store original console methods but don't suppress them
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// Only suppress console output if SILENT_TESTS environment variable is set
if (process.env.SILENT_TESTS) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
}

// Restore console for debugging
global.restoreConsole = () => {
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
};

// Mock timers to prevent hanging tests
const originalSetInterval = global.setInterval;
const originalClearInterval = global.clearInterval;
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;

// Track active timers for cleanup
global._testTimers = {
    intervals: new Set(),
    timeouts: new Set()
};

// Mock setInterval to track and prevent hanging
global.setInterval = function(callback, delay) {
    const id = originalSetTimeout(() => {
        // Only call callback once for tests to prevent infinite loops
        try {
            callback();
        } catch (error) {
            // Ignore timer callback errors in tests
        }
    }, 0);
    global._testTimers.intervals.add(id);
    return id;
};

global.clearInterval = function(id) {
    global._testTimers.intervals.delete(id);
    originalClearTimeout(id);
};

global.setTimeout = function(callback, delay) {
    const id = originalSetTimeout(callback, delay);
    global._testTimers.timeouts.add(id);
    return id;
};

global.clearTimeout = function(id) {
    global._testTimers.timeouts.delete(id);
    originalClearTimeout(id);
};

// Cleanup function for tests
global.cleanupTestTimers = function() {
    // Clear all tracked timers
    global._testTimers.intervals.forEach(id => originalClearTimeout(id));
    global._testTimers.timeouts.forEach(id => originalClearTimeout(id));
    global._testTimers.intervals.clear();
    global._testTimers.timeouts.clear();
};

// Export cleanup function for tests to use
global.cleanupTestEnvironment = function() {
    // Clean up timers first
    global.cleanupTestTimers();
    
    // Reset global state
    global.window = {};
    global.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
    };
};

// Cleanup timers when process exits
process.on('exit', () => {
    global.cleanupTestTimers();
});