import {existsSync} from "fs";
import {join as joinPath} from "path";
import Config from "./Config";

/**
 * Centralizes detection of the DDLC archive that should be used for onboarding
 * and install creation. On macOS we prefer the dedicated mac archive name but
 * fall back to the cross-platform name when necessary.
 */
export default class GameArchiveResolver {
    /**
     * Returns the preferred archive basename for the current platform.
     */
    public static getPreferredArchiveBasename(): string {
        return process.platform === "darwin" ? "ddlc-mac.zip" : "ddlc.zip";
    }

    /**
     * Returns the fallback archive basename for the current platform.
     */
    public static getFallbackArchiveBasename(): string {
        return process.platform === "darwin" ? "ddlc.zip" : "ddlc-mac.zip";
    }

    /**
     * Resolves the absolute path to the archive that should be used for installs.
     * Prefers the platform-specific archive but falls back to the alternate name.
     */
    public static resolveArchivePath(): {path: string; found: boolean; source: "preferred" | "fallback"} {
        const installFolder = Config.readConfigValue("installFolder");
        const preferredBasename = this.getPreferredArchiveBasename();
        const fallbackBasename = this.getFallbackArchiveBasename();

        const preferredPath = joinPath(installFolder, preferredBasename);
        if (existsSync(preferredPath)) {
            return {path: preferredPath, found: true, source: "preferred"};
        }

        const fallbackPath = joinPath(installFolder, fallbackBasename);
        if (existsSync(fallbackPath)) {
            return {path: fallbackPath, found: true, source: "fallback"};
        }

        // Neither exists – return the preferred path so callers know where it should live
        return {path: preferredPath, found: false, source: "preferred"};
    }

    /**
     * Returns the absolute target path that new archives should be copied to.
     */
    public static getWriteTargetPath(): string {
        const installFolder = Config.readConfigValue("installFolder");
        return joinPath(installFolder, this.getPreferredArchiveBasename());
    }
}
