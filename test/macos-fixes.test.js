const assert = require("assert");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Import the classes we're testing
const MacOSAutorunFormat = require("../lib/src/main/mod/mappers/MacOSAutorunFormat").default;

describe("macOS Fixes", function() {
    let tempDir;
    let installsDir;

    beforeEach(function() {
        // Create a temporary directory for testing
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ddmm-test-"));
        installsDir = path.join(tempDir, "installs");
        fs.mkdirSync(installsDir, { recursive: true });
    });

    afterEach(function() {
        // Clean up temporary directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    // Note: InstallList tests are skipped because they require Electron's app object
    // The .DS_Store fix has been implemented in the InstallList.ts file

    describe("MacOSAutorunFormat app bundle paths", function() {
        describe("Standard Mode (no .app file)", function() {
            let mapper;

            beforeEach(function() {
                mapper = new MacOSAutorunFormat(false);
            });

        it("should map .rpy files to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("script.rpy");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/script.rpy");
        });

        it("should map .rpyc files to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("script.rpyc");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/script.rpyc");
        });

        it("should map .chr files to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("character.chr");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/character.chr");
        });

        it("should map .rpa files to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("archive.rpa");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/archive.rpa");
        });

        it("should map game folder files to DDLC.app/Contents/Resources/autorun/ preserving complete directory structure", function() {
            const result = mapper.mapFile("game/options.rpy");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/game/options.rpy");
        });

        it("should map nested game folder files to DDLC.app/Contents/Resources/autorun/ preserving complete directory structure", function() {
            const result = mapper.mapFile("game/scripts/story.rpy");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/game/scripts/story.rpy");
        });

        it("should map non-rpy game folder files to DDLC.app/Contents/Resources/autorun/ preserving complete directory structure", function() {
            const result = mapper.mapFile("game/images/bg.png");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/game/images/bg.png");
        });

        it("should map deeply nested game folder files to autorun preserving complete directory structure", function() {
            const result = mapper.mapFile("game/mod/scripts/chapter1/scene.rpy");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/game/mod/scripts/chapter1/scene.rpy");
        });

        it("should map characters folder files to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("characters/monika.chr");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/characters/monika.chr");
        });

        it("should map asset folders to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("audio/music.ogg");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/audio/music.ogg");
        });

        it("should map executable files to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("DDLC.exe");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/DDLC.exe");
        });

        it("should map Python scripts to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("launcher.py");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/launcher.py");
        });

        it("should map library files to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("library.dll");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/library.dll");
        });

        it("should map documentation files to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("README.txt");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/README.txt");
        });

        it("should map unknown file types to DDLC.app/Contents/Resources/autorun/", function() {
            const result = mapper.mapFile("config.ini");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/config.ini");
        });

        it("should map deeply nested files preserving complete directory structure", function() {
            const result = mapper.mapFile("mod/scripts/chapter1/scenes/intro.rpy");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/mod/scripts/chapter1/scenes/intro.rpy");
        });

        it("should map files with complex paths to autorun", function() {
            const result = mapper.mapFile("custom/assets/images/backgrounds/school.png");
            assert.strictEqual(result, "DDLC.app/Contents/Resources/autorun/custom/assets/images/backgrounds/school.png");
        });

            it("should ignore directories", function() {
                const result = mapper.mapFile("some-folder/");
                assert.strictEqual(result, null);
            });
        });

        describe("App Bundle Mode (.app file present)", function() {
            let mapper;

            beforeEach(function() {
                mapper = new MacOSAutorunFormat(true);
            });

            it("should map .app directories to replace DDLC.app", function() {
                const result = mapper.mapFile("CustomMod.app");
                assert.strictEqual(result, "DDLC.app");
            });

            it("should map files within .app bundle to DDLC.app structure", function() {
                const result = mapper.mapFile("CustomMod.app/Contents/Resources/script.rpy");
                assert.strictEqual(result, "DDLC.app/Contents/Resources/script.rpy");
            });

            it("should map nested .app bundle files to DDLC.app structure", function() {
                const result = mapper.mapFile("CustomMod.app/Contents/MacOS/DDLC");
                assert.strictEqual(result, "DDLC.app/Contents/MacOS/DDLC");
            });

            it("should map game folder files to root install directory", function() {
                const result = mapper.mapFile("game/script.rpy");
                assert.strictEqual(result, "game/script.rpy");
            });

            it("should map characters folder files to root install directory", function() {
                const result = mapper.mapFile("characters/monika.chr");
                assert.strictEqual(result, "characters/monika.chr");
            });

            it("should map other files to root install directory", function() {
                const result = mapper.mapFile("README.txt");
                assert.strictEqual(result, "README.txt");
            });

            it("should map asset folders to root install directory", function() {
                const result = mapper.mapFile("audio/music.ogg");
                assert.strictEqual(result, "audio/music.ogg");
            });

            it("should ignore directories", function() {
                const result = mapper.mapFile("some-folder/");
                assert.strictEqual(result, null);
            });
        });
    });
});