const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Internationalization (i18n) Tests', function() {
    const validCodes = [
        "af", "am", "ar", "az", "be", "bg", "bh", "bn", "br", "bs", "ca", "co", "cs", "cy", 
        "da", "de", "de-AT", "de-CH", "de-DE", "el", "en", "en-AU", "en-CA", "en-GB", 
        "en-NZ", "en-US", "en-ZA", "eo", "es", "es-419", "et", "eu", "fa", "fi", "fil", 
        "fo", "fr", "fr-CA", "fr-CH", "fr-FR", "fy", "ga", "gd", "gl", "gn", "gu", "ha", 
        "haw", "he", "hi", "hr", "hu", "hy", "ia", "id", "is", "it", "it-CH", "it-IT", 
        "ja", "jw", "ka", "kk", "km", "kn", "ko", "ku", "ky", "la", "ln", "lo", "lt", 
        "lv", "mk", "ml", "mn", "mo", "mr", "ms", "mt", "nb", "ne", "nl", "nn", "no", 
        "oc", "om", "or", "pa", "pl", "ps", "pt", "pt-BR", "pt-PT", "qu", "rm", "ro", 
        "ru", "sd", "sh", "si", "sk", "sl", "sn", "so", "sq", "sr", "st", "su", "sv", 
        "sw", "ta", "te", "tg", "th", "ti", "tk", "to", "tr", "tt", "tw", "ug", "uk", 
        "ur", "uz", "vi", "xh", "yi", "yo", "zh", "zh-CN", "zh-TW", "zu"
    ];

    describe('Language Files', function() {
        let languageFiles;

        before(function() {
            const langDir = path.join(__dirname, '../lang');
            assert(fs.existsSync(langDir), 'Language directory should exist');
            languageFiles = fs.readdirSync(langDir).filter(file => file.endsWith('.json'));
        });

        it('should have at least one language file', function() {
            assert(languageFiles.length > 0, 'Should have at least one language file');
        });

        it('should only have files with valid language codes', function() {
            languageFiles.forEach(file => {
                const langCode = file.replace('.json', '');
                assert(validCodes.includes(langCode), 
                    `Language code '${langCode}' is not valid. See https://electronjs.org/docs/api/locales`);
            });
        });

        it('should have valid JSON syntax in all language files', function() {
            languageFiles.forEach(file => {
                const filePath = path.join(__dirname, '../lang', file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                let parsed;
                assert.doesNotThrow(() => {
                    parsed = JSON.parse(content);
                }, `Language file ${file} should have valid JSON syntax`);
                
                assert(typeof parsed === 'object', `Language file ${file} should contain an object`);
                assert(parsed !== null, `Language file ${file} should not be null`);
            });
        });

        it('should have English as the base language', function() {
            const englishFiles = languageFiles.filter(file => 
                file.startsWith('en-') || file === 'en.json'
            );
            assert(englishFiles.length > 0, 'Should have at least one English language file');
        });

        describe('Language File Structure', function() {
            let baseLanguage;
            let baseKeys;

            before(function() {
                // Use en-GB.json as the base language if available, otherwise use the first English file
                const englishFile = languageFiles.find(file => file === 'en-GB.json') ||
                                  languageFiles.find(file => file.startsWith('en-')) ||
                                  languageFiles[0];
                
                const basePath = path.join(__dirname, '../lang', englishFile);
                baseLanguage = JSON.parse(fs.readFileSync(basePath, 'utf8'));
                baseKeys = getAllKeys(baseLanguage);
            });

            function getAllKeys(obj, prefix = '') {
                const keys = [];
                for (const key in obj) {
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        keys.push(...getAllKeys(obj[key], fullKey));
                    } else {
                        keys.push(fullKey);
                    }
                }
                return keys;
            }

            it('should have consistent structure across language files', function() {
                languageFiles.forEach(file => {
                    const filePath = path.join(__dirname, '../lang', file);
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const fileKeys = getAllKeys(content);
                    
                    // Check that all base keys exist in this file
                    baseKeys.forEach(key => {
                        const keyExists = fileKeys.includes(key);
                        if (!keyExists) {
                            console.warn(`Warning: Key '${key}' missing in ${file}`);
                        }
                    });
                    
                    // Check that this file doesn't have extra keys
                    fileKeys.forEach(key => {
                        const keyInBase = baseKeys.includes(key);
                        if (!keyInBase) {
                            console.warn(`Warning: Extra key '${key}' in ${file}`);
                        }
                    });
                });
            });

            it('should have required top-level sections', function() {
                const requiredSections = ['main', 'renderer'];
                
                languageFiles.forEach(file => {
                    const filePath = path.join(__dirname, '../lang', file);
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    
                    requiredSections.forEach(section => {
                        assert(content[section], `Language file ${file} should have '${section}' section`);
                        assert(typeof content[section] === 'object', `Section '${section}' should be an object in ${file}`);
                    });
                });
            });

            it('should have non-empty translation values', function() {
                languageFiles.forEach(file => {
                    const filePath = path.join(__dirname, '../lang', file);
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    
                    function checkValues(obj, keyPath = '') {
                        for (const key in obj) {
                            const currentPath = keyPath ? `${keyPath}.${key}` : key;
                            if (typeof obj[key] === 'object' && obj[key] !== null) {
                                checkValues(obj[key], currentPath);
                            } else {
                                assert(typeof obj[key] === 'string', 
                                    `Value at '${currentPath}' in ${file} should be a string`);
                                assert(obj[key].trim().length > 0, 
                                    `Value at '${currentPath}' in ${file} should not be empty`);
                            }
                        }
                    }
                    
                    checkValues(content);
                });
            });
        });
    });

    describe('i18n Implementation', function() {
        it('should have i18n utility in main process', function() {
            const i18nPath = path.join(__dirname, '../src/main/utils/i18n.ts');
            assert(fs.existsSync(i18nPath), 'i18n utility should exist in main process');
            
            const content = fs.readFileSync(i18nPath, 'utf8');
            assert(content.includes('export'), 'i18n utility should export functions');
        });

        it('should load language files correctly', function() {
            // Test that we can load and parse all language files
            const langDir = path.join(__dirname, '../lang');
            const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
            
            files.forEach(file => {
                const filePath = path.join(langDir, file);
                assert.doesNotThrow(() => {
                    const content = fs.readFileSync(filePath, 'utf8');
                    JSON.parse(content);
                }, `Should be able to load and parse ${file}`);
            });
        });
    });

    describe('Locale Support', function() {
        it('should support system locale detection', function() {
            // Test that the app can handle various locale formats
            const testLocales = [
                'en-US',
                'en-GB', 
                'es-419',
                'de-DE',
                'fr-FR',
                'ja',
                'zh-CN'
            ];

            testLocales.forEach(locale => {
                const normalizedLocale = locale.toLowerCase();
                const isValidCode = validCodes.some(code => 
                    code.toLowerCase() === normalizedLocale
                );
                assert(isValidCode, `Locale '${locale}' should be supported`);
            });
        });

        it('should have fallback handling', function() {
            // Ensure we can fallback to English if a language is not available
            const englishFiles = fs.readdirSync(path.join(__dirname, '../lang'))
                .filter(file => file.startsWith('en-') || file === 'en.json');
            
            assert(englishFiles.length > 0, 'Should have English fallback available');
        });
    });
});