#!/usr/bin/env node

/**
 * CSS Rebuild Utility for Doki Doki Mod Manager
 * 
 * This script provides an easy way to rebuild CSS from SCSS files.
 * It can be run directly or through npm scripts.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkSassInstalled() {
    try {
        execSync('sass --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

function installSass() {
    log('Installing SASS...', 'yellow');
    try {
        execSync('npm install', { stdio: 'inherit' });
        log('✓ SASS installed successfully!', 'green');
        return true;
    } catch (error) {
        log('✗ Failed to install SASS', 'red');
        log('Please run: npm install', 'yellow');
        return false;
    }
}

function buildCSS(production = false) {
    const cssDir = path.join(__dirname, 'src', 'renderer', 'css');
    
    if (!fs.existsSync(cssDir)) {
        log('✗ CSS directory not found: ' + cssDir, 'red');
        return false;
    }

    log('Building CSS from SCSS files...', 'cyan');
    
    try {
        const command = production 
            ? 'sass src/renderer/css:src/renderer/css --style compressed --no-source-map'
            : 'sass src/renderer/css:src/renderer/css --no-source-map';
            
        execSync(command, { stdio: 'inherit' });
        log('✓ CSS built successfully!', 'green');
        return true;
    } catch (error) {
        log('✗ Failed to build CSS', 'red');
        log('Error: ' + error.message, 'red');
        return false;
    }
}

function watchCSS() {
    log('Starting CSS watch mode...', 'cyan');
    log('Press Ctrl+C to stop watching', 'yellow');
    
    try {
        execSync('sass src/renderer/css:src/renderer/css --watch --no-source-map', { stdio: 'inherit' });
    } catch (error) {
        if (error.signal !== 'SIGINT') {
            log('✗ CSS watch failed', 'red');
            log('Error: ' + error.message, 'red');
        }
    }
}

function showHelp() {
    log('\n' + colors.bright + 'CSS Rebuild Utility for Doki Doki Mod Manager' + colors.reset);
    log('Usage: node rebuild-css.js [options]\n');
    log('Options:');
    log('  --help, -h        Show this help message');
    log('  --production, -p  Build CSS for production (compressed)');
    log('  --watch, -w       Watch for changes and rebuild automatically');
    log('  --check, -c       Check if SASS is installed');
    log('\nExamples:');
    log('  node rebuild-css.js              # Build CSS once');
    log('  node rebuild-css.js --production  # Build compressed CSS');
    log('  node rebuild-css.js --watch       # Watch for changes');
    log('  npm run rebuild-css               # Using npm script');
    log('  npm run build-css                 # Watch mode via npm');
    log('  npm run build-css-prod            # Production build via npm\n');
}

function main() {
    const args = process.argv.slice(2);
    
    // Parse command line arguments
    const options = {
        help: args.includes('--help') || args.includes('-h'),
        production: args.includes('--production') || args.includes('-p'),
        watch: args.includes('--watch') || args.includes('-w'),
        check: args.includes('--check') || args.includes('-c')
    };

    if (options.help) {
        showHelp();
        return;
    }

    if (options.check) {
        if (checkSassInstalled()) {
            log('✓ SASS is installed and available', 'green');
        } else {
            log('✗ SASS is not installed', 'red');
            log('Run: npm install', 'yellow');
        }
        return;
    }

    // Check if SASS is available
    if (!checkSassInstalled()) {
        log('SASS not found. Installing dependencies...', 'yellow');
        if (!installSass()) {
            process.exit(1);
        }
    }

    // Execute the appropriate action
    if (options.watch) {
        watchCSS();
    } else {
        const success = buildCSS(options.production);
        if (!success) {
            process.exit(1);
        }
    }
}

// Run the script if called directly
if (require.main === module) {
    main();
}

module.exports = {
    buildCSS,
    watchCSS,
    checkSassInstalled,
    installSass
};
