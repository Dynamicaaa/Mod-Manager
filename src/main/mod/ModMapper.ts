import { RenpyVersionInfo } from "../version/RenpyVersionDetector";

export abstract class ModMapper {

    private readonly filesToDelete: string[];
    protected versionInfo?: RenpyVersionInfo;

    // no it can't
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    public constructor(filesToDelete?: string[]) {
        this.filesToDelete = filesToDelete || [];
    }

    public abstract mapFile(path: string): string;

    public abstract getFriendlyName(): string;

    public getFilesToDelete(): string[] {
        return this.filesToDelete;
    }

    /**
     * Returns true if this mapper requires app bundle replacement
     * Default implementation returns false
     */
    public requiresAppBundleReplacement(): boolean {
        return false;
    }

    /**
     * Gets the app bundle file that should replace DDLC.app
     * Returns null if no app bundle replacement is needed
     * Default implementation returns null
     */
    public getAppBundleToReplace(fileName: string): string | null {
        return null;
    }

    /**
     * Sets the detected Ren'Py version information for this mod
     */
    public setVersionInfo(versionInfo: RenpyVersionInfo): void {
        this.versionInfo = versionInfo;
    }

    /**
     * Gets the detected Ren'Py version information
     */
    public getVersionInfo(): RenpyVersionInfo | undefined {
        return this.versionInfo;
    }

    /**
     * Checks if this mapper supports the detected Ren'Py version
     * Override in subclasses for version-specific logic
     */
    public supportsVersion(versionInfo: RenpyVersionInfo): boolean {
        // Default implementation: support all versions
        return true;
    }
}