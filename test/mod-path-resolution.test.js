const path = require("path");
const { expect } = require("chai");

const os = require("os");

// Provide a minimal electron.app stub before loading ModInstaller
const electronStubPath = require.resolve("electron");
require.cache[electronStubPath] = {
    exports: {
        app: {
            getPath: () => path.join(os.tmpdir(), "ddmm-test")
        }
    }
};

const ModInstaller = require("../lib/src/main/mod/ModInstaller").default;

describe("Unified Mod path resolution", function() {
    const installPath = path.join(process.cwd(), "tmp-install-root");

    it("routes macOS app bundle contents into DDLC.app", function() {
        const originalSegments = [
            "MeAndYou.app",
            "Contents",
            "Resources",
            "lib",
            "python2.7",
            "email",
            "test_email.pyo"
        ];

        const context = {
            installPath,
            platform: "darwin",
            appDestinationName: "DDLC.app",
            defaultAppName: "DDLC.app"
        };

        const result = ModInstaller.resolveExtractionPath(originalSegments, 1, context);

        expect(result).to.not.be.null;
        expect(result.absolutePath).to.equal(
            path.join(installPath, "DDLC.app", "Contents", "Resources", "lib", "python2.7", "email", "test_email.pyo")
        );
        expect(result.relativePath).to.equal("DDLC.app/Contents/Resources/lib/python2.7/email/test_email.pyo");
    });

    it("keeps non-app files relative to install root on non-mac platforms", function() {
        const originalSegments = ["game", "scripts", "story.rpy"];
        const context = {
            installPath,
            platform: "win32"
        };

    const result = ModInstaller.resolveExtractionPath(originalSegments, 0, context);

    expect(result).to.not.be.null;
    expect(result.relativePath).to.equal("game/scripts/story.rpy");
    });

    it("keeps MacOS lib directories beside the executable", function() {
        const originalSegments = ["lib", "python2.7", "email", "test_email.py"];
        const context = {
            installPath,
            platform: "darwin",
            appDestinationName: "DDLC.app",
            defaultAppName: "DDLC.app"
        };

        const result = ModInstaller.resolveExtractionPath(originalSegments, 0, context);

        expect(result).to.not.be.null;
        expect(result.absolutePath).to.equal(
            path.join(installPath, "DDLC.app", "Contents", "MacOS", "lib", "python2.7", "email", "test_email.py")
        );
    });

    it("routes python-packages into autorun", function() {
        const originalSegments = ["python-packages", "future", "__init__.py"];
        const context = {
            installPath,
            platform: "darwin",
            appDestinationName: "DDLC.app",
            defaultAppName: "DDLC.app"
        };

        const result = ModInstaller.resolveExtractionPath(originalSegments, 0, context);

        expect(result).to.not.be.null;
        expect(result.absolutePath).to.equal(
            path.join(installPath, "DDLC.app", "Contents", "Resources", "autorun", "python-packages", "future", "__init__.py")
        );
    });
});
