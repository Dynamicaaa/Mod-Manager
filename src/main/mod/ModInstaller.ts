import * as yauzl from "yauzl";
import {createWriteStream, unlinkSync, removeSync, readFileSync, writeFileSync, existsSync} from "fs-extra";
import {mkdirsSync} from "fs-extra";
import {join as joinPath, sep as pathSep, dirname} from "path";
import ArchiveConverter from "../archive/ArchiveConverter";
import {UniversalArchiveExtractor} from "../archive/UniversalArchiveExtractor";
import {InstallationProgressManager} from "../progress/InstallationProgressManager";
import {
    ModInstallationError,
    UnsupportedArchiveError,
    ExtractionError,
    FileOperationError,
    PathConflictError,
    ErrorHandlerUtils
} from "../errors/ModInstallationError";
import {app} from "electron";
import {randomBytes} from "crypto";
import MacOSFileCleanup from "../utils/MacOSFileCleanup";
import {CrossPlatformPathResolver} from "../utils/CrossPlatformPathResolver";
import {ModContainerManager} from "../container/ModContainerManager";
import {ModContainer, ModManifest} from "../container/ModContainer";
import { AdvancedBackupManager } from "../backup/BackupManager";
import {InputValidator} from "../utils/InputValidator";
import {SafeFileOperations} from "../utils/SafeFileOperations";

interface ArchiveAnalysisState {
    totalEntries: number;
    topLevelCandidates: Set<string>;
    hasRootFiles: boolean;
    modRootCandidates: Set<string>;
    modRootDir: string | null;
    topLevelAppBundles: Set<string>;
    containsExecutables: boolean;
}

interface ArchiveAnalysisResult {
    totalEntries: number;
    stripSegments: number;
    modRootDir: string | null;
    topLevelAppBundles: Set<string>;
    containsExecutables: boolean;
}

interface ExtractionContext {
    installPath: string;
    platform: NodeJS.Platform;
    appDestinationName?: string;
    defaultAppName?: string;
}

interface ResolutionResult {
    absolutePath: string;
    relativePath: string;
}

export default class ModInstaller {

    /**
     * Installs a mod into a copy of DDLC by guessing which files should go where
     * @param modPath The path to the mod
     * @param installPath The path to the game installation
     * @param instanceName The name of the instance
     * @param createBackup Whether to create a backup before installation
     */
    public static async installMod(modPath: string, installPath: string, instanceName?: string, createBackup: boolean = true): Promise<null> {
        const sessionId = randomBytes(8).toString("hex");
        const progressReporter = InstallationProgressManager.createReporter(sessionId);
        
        try {
            // Validate inputs before proceeding
            progressReporter.updatePhase('analyzing', 'Validating input parameters...', 1);
            
            // Validate mod path
            const modValidation = InputValidator.validateModArchive(modPath);
            if (!modValidation.isValid) {
                const error = new Error(`Invalid mod file: ${modValidation.errors.join(', ')}`);
                progressReporter.error(error, 'analyzing');
                throw error;
            }
            
            // Validate install path
            const installValidation = InputValidator.validateDirectoryPath(installPath, {
                mustBeWritable: true,
                allowRelative: false,
                maxLength: 260
            });
            if (!installValidation.isValid) {
                const error = new Error(`Invalid installation path: ${installValidation.errors.join(', ')}`);
                progressReporter.error(error, 'analyzing');
                throw error;
            }
            
            // Validate instance name if provided
            if (instanceName) {
                const nameValidation = InputValidator.validateInstallationName(instanceName);
                if (!nameValidation.isValid) {
                    const error = new Error(`Invalid instance name: ${nameValidation.errors.join(', ')}`);
                    progressReporter.error(error, 'analyzing');
                    throw error;
                }
                instanceName = nameValidation.sanitized;
            }
            
            console.log(`ModInstaller: Starting installation with validated inputs - Mod: ${modValidation.sanitized}, Install: ${installValidation.sanitized}, Instance: ${instanceName}`);
            // Create automatic backup before mod installation
            if (createBackup && existsSync(installPath)) {
                progressReporter.updatePhase('analyzing', 'Creating pre-installation backup...', 2);
                
                try {
                    const modFileName = modPath.split(pathSep).pop() || 'unknown-mod';
                    await AdvancedBackupManager.createAutomaticBackup(
                        installPath,
                        `Pre-installation backup for ${modFileName} on ${instanceName || 'unnamed instance'}`
                    );
                    console.log(`Created automatic backup before installing mod: ${modFileName}`);
                } catch (backupError) {
                    console.warn('Failed to create pre-installation backup:', backupError.message);
                    // Continue with installation even if backup fails
                }
            }
            
            if (modPath.endsWith(".zip")) {
                return await ModInstaller.installZip(modPath, installPath, instanceName, progressReporter);
            } else if (ModInstaller.isArchive(modPath)) {
                return new Promise((ff, rj) => {
                    const tempDir: string = joinPath(app.getPath("temp"), "ddmm-extract-" + randomBytes(8).toString("hex"));
                    
                    progressReporter.updatePhase('extracting', 'Extracting archive with universal extractor...', 10);
                    
                    // Extract using UniversalArchiveExtractor directly, then process the extracted files
                    UniversalArchiveExtractor.extract(modPath, tempDir).then(() => {
                        progressReporter.updatePhase('installing', 'Processing extracted files...', 30);
                        
                        // Process extracted files directly without zip conversion
                        ModInstaller.installFromDirectory(tempDir, installPath, instanceName, progressReporter).then(() => {
                            removeSync(tempDir);
                            ff(undefined);
                        }).catch(e => {
                            removeSync(tempDir);
                            const wrappedError = ErrorHandlerUtils.wrapError(e, 'installing', modPath);
                            progressReporter.error(wrappedError, 'installing');
                            rj(wrappedError);
                        });
                    }).catch(e => {
                        const wrappedError = new ExtractionError(modPath, e);
                        progressReporter.error(wrappedError, 'extracting');
                        rj(wrappedError);
                    });
                });
            } else {
                const error = new UnsupportedArchiveError(modPath);
                progressReporter.error(error, 'analyzing');
                throw error;
            }
        } catch (error) {
            if (error instanceof ModInstallationError) {
                throw error;
            }
            const wrappedError = ErrorHandlerUtils.wrapError(error, 'analyzing', modPath);
            progressReporter.error(wrappedError);
            throw wrappedError;
        }
    }

    /**
     * Installs a mod using the container system for better isolation and management
     * @param modPath The path to the mod
     * @param installPath The path to the game installation
     * @param instanceName The name of the mod instance
     * @param isolationMode The isolation mode for the container
     * @returns Promise resolving to the created container
     */
    public static async installModWithContainer(
        modPath: string,
        installPath: string,
        instanceName: string,
        isolationMode: 'full' | 'partial' | 'none' = 'partial'
    ): Promise<ModContainer> {
        const sessionId = randomBytes(8).toString("hex");
        const progressReporter = InstallationProgressManager.createReporter(sessionId);
        
        try {
            // Validate all inputs for container installation
            progressReporter.updatePhase('analyzing', 'Validating container installation parameters...', 2);
            
            const modValidation = InputValidator.validateModArchive(modPath);
            if (!modValidation.isValid) {
                throw new Error(`Invalid mod file: ${modValidation.errors.join(', ')}`);
            }
            
            const installValidation = InputValidator.validateDirectoryPath(installPath, {
                mustBeWritable: true,
                allowRelative: false
            });
            if (!installValidation.isValid) {
                throw new Error(`Invalid installation path: ${installValidation.errors.join(', ')}`);
            }
            
            const nameValidation = InputValidator.validateInstallationName(instanceName);
            if (!nameValidation.isValid) {
                throw new Error(`Invalid instance name: ${nameValidation.errors.join(', ')}`);
            }
            
            // Use sanitized values
            modPath = modValidation.sanitized;
            installPath = installValidation.sanitized;
            instanceName = nameValidation.sanitized;
            // Initialize container manager
            ModContainerManager.initialize();
            
            progressReporter.updatePhase('analyzing', 'Analyzing mod structure...', 5);
            
            // Extract mod to temporary directory
            const tempDir: string = joinPath(app.getPath("temp"), "ddmm-container-" + randomBytes(8).toString("hex"));
            
            if (modPath.endsWith(".zip")) {
                progressReporter.updatePhase('extracting', 'Extracting ZIP archive...', 10);
                await ModInstaller.extractZipToDirectory(modPath, tempDir);
            } else if (ModInstaller.isArchive(modPath)) {
                progressReporter.updatePhase('extracting', 'Extracting archive...', 10);
                await UniversalArchiveExtractor.extract(modPath, tempDir);
            } else {
                throw new UnsupportedArchiveError(modPath);
            }
            
            progressReporter.updatePhase('analyzing', 'Detecting mod format...', 20);
            
            // Infer mapper from the extracted files
            // Collect mod files
            const modFiles = await ModInstaller.collectModFiles(tempDir);
            
            progressReporter.updatePhase('analyzing', 'Creating mod manifest...', 30);
            
            // Create mod manifest
            const manifest = ModContainerManager.createModManifest({
                name: instanceName,
                version: "1.0.0", // Could be extracted from mod metadata if available
                files: modFiles,
                originalModPath: modPath,
                mapper: "Unified Extractor"
            });
            
            progressReporter.updatePhase('installing', 'Creating container...', 40);
            
            // Create container
            const container = await ModContainerManager.createContainer(
                tempDir,
                installPath,
                manifest,
                isolationMode
            );
            
            progressReporter.updatePhase('installing', 'Activating container...', 80);
            
            // Activate the container
            await ModContainerManager.activateContainer(container.id, installPath);
            
            progressReporter.updatePhase('verifying', 'Finalizing installation...', 90);
            
            // Clean up temporary directory
            removeSync(tempDir);
            
            progressReporter.updatePhase('verifying', 'Installation complete', 100);
            progressReporter.complete();
            
            console.log(`Mod installed successfully in container: ${container.id}`);
            return container;
            
        } catch (error) {
            const wrappedError = ErrorHandlerUtils.wrapError(error, 'installing', modPath);
            progressReporter.error(wrappedError);
            throw wrappedError;
        }
    }

    /**
     * Activates a specific mod container
     * @param containerId The container ID to activate
     * @param installPath The installation path where the container should be applied
     */
    public static async activateModContainer(containerId: string, installPath: string): Promise<void> {
        try {
            ModContainerManager.initialize();
            await ModContainerManager.activateContainer(containerId, installPath);
            console.log(`Container activated: ${containerId}`);
        } catch (error) {
            console.error(`Failed to activate container ${containerId}:`, error);
            throw error;
        }
    }

    /**
     * Deactivates the currently active container
     * @param containerId Optional specific container to deactivate
     */
    public static async deactivateModContainer(containerId?: string): Promise<void> {
        try {
            ModContainerManager.initialize();
            await ModContainerManager.deactivateContainer(containerId);
            console.log(`Container deactivated: ${containerId || 'current active'}`);
        } catch (error) {
            console.error(`Failed to deactivate container:`, error);
            throw error;
        }
    }

    /**
     * Lists all available mod containers
     * @returns Array of all containers
     */
    public static listModContainers(): ModContainer[] {
        ModContainerManager.initialize();
        return ModContainerManager.listContainers();
    }

    /**
     * Gets the currently active container
     * @returns The active container or undefined
     */
    public static getActiveModContainer(): ModContainer | undefined {
        ModContainerManager.initialize();
        return ModContainerManager.getActiveContainer();
    }

    /**
     * Removes a mod container
     * @param containerId The container ID to remove
     */
    public static async removeModContainer(containerId: string): Promise<void> {
        try {
            ModContainerManager.initialize();
            await ModContainerManager.removeContainer(containerId);
            console.log(`Container removed: ${containerId}`);
        } catch (error) {
            console.error(`Failed to remove container ${containerId}:`, error);
            throw error;
        }
    }

    private static installZip(modPath: string, installPath: string, instanceName?: string, progressReporter?: any): Promise<null> {
        return new Promise((resolve, reject) => {
            if (!progressReporter) {
                const sessionId = randomBytes(8).toString("hex");
                progressReporter = InstallationProgressManager.createReporter(sessionId);
            }

            progressReporter.updatePhase('analyzing', 'Preparing installation directory...', 5);
            mkdirsSync(installPath);
            const installJsonPath = joinPath(installPath, "install.json");
            console.log("Preparing to install mod from " + modPath);

            let modName = instanceName ?? "";
            if (!instanceName && existsSync(installJsonPath)) {
                try {
                    const parsed = JSON.parse(readFileSync(installJsonPath, "utf8"));
                    if (parsed && parsed.name) {
                        modName = parsed.name;
                    }
                } catch (e) {
                    console.warn("Could not read existing install.json:", e.message);
                }
            }

            if (!modName) {
                const error = new Error("No instance name provided and install.json does not contain a name.");
                progressReporter.error(error, 'analyzing');
                reject(error);
                return;
            }

            const installJson: any = {
                name: modName,
                globalSave: false,
                mod: null,
                mapper: "Unified Extractor",
                requiresWine: false
            };

            const analysisState: ArchiveAnalysisState = {
                totalEntries: 0,
                topLevelCandidates: new Set<string>(),
                hasRootFiles: false,
                modRootCandidates: new Set<string>(),
                modRootDir: null,
                topLevelAppBundles: new Set<string>(),
                containsExecutables: false
            };

            const extractionContext: ExtractionContext = {
                installPath,
                platform: process.platform,
                appDestinationName: process.platform === "darwin" ? ModInstaller.locateExistingAppBundleName(installPath) ?? undefined : undefined,
                defaultAppName: process.platform === "darwin" ? "DDLC.app" : undefined
            };

            progressReporter.updatePhase('analyzing', 'Scanning archive contents...', 10);

            yauzl.open(modPath, {lazyEntries: true}, (err, zipfile) => {
                if (err) {
                    const wrappedError = new ExtractionError(modPath, err);
                    progressReporter.error(wrappedError, 'analyzing');
                    reject(wrappedError);
                    return;
                }

                zipfile.readEntry();
                zipfile.on("entry", (entry) => {
                    ModInstaller.handleAnalysisEntry(entry, analysisState);
                    zipfile.readEntry();
                });

                zipfile.on("error", (zipErr) => {
                    const wrappedError = new ExtractionError(modPath, zipErr);
                    progressReporter.error(wrappedError, 'analyzing');
                    reject(wrappedError);
                });

                zipfile.on("end", () => {
                    zipfile.close();
                    const analysis = ModInstaller.finalizeAnalysis(analysisState);

                    (async () => {
                        try {
                            if (process.platform === "linux" && analysis.containsExecutables) {
                                installJson.requiresWine = true;
                                progressReporter.updatePhase('analyzing', 'Preparing Wine compatibility...', 20);
                                const WineAPI = require("../sdk/WineAPI");
                                await WineAPI.ensureWine();
                            }

                            progressReporter.updatePhase('analyzing', 'Writing installation metadata...', 25);
                            await ModInstaller.writeInstallJson(installJsonPath, installJson);

                            if (process.platform === "darwin") {
                                if (!extractionContext.appDestinationName) {
                                    if (analysis.topLevelAppBundles.size > 0) {
                                        extractionContext.appDestinationName = Array.from(analysis.topLevelAppBundles)[0];
                                    } else {
                                        extractionContext.appDestinationName = extractionContext.defaultAppName;
                                    }
                                }
                            }

                            progressReporter.updatePhase('installing', 'Extracting mod files...', 30);
                            await ModInstaller.extractArchive(modPath, analysis, extractionContext, progressReporter);

                            progressReporter.updatePhase('verifying', 'Writing mod configuration...', 85);
                            await ModInstaller.writeModConfiguration(installPath, installJson.mapper);

                            progressReporter.updatePhase('verifying', 'Cleaning up macOS files...', 95);
                            MacOSFileCleanup.cleanGameInstallation(installPath);

                            progressReporter.complete();
                            resolve(undefined);
                        } catch (error) {
                            const wrapped = ErrorHandlerUtils.wrapError(error, 'installing', modPath);
                            progressReporter.error(wrapped, 'installing');
                            reject(wrapped);
                        }
                    })().catch(reject);
                });
            });
        });
    }
    /**
     * Installs a mod from an already extracted directory
     * @param sourceDir The directory containing extracted mod files
     * @param installPath The path to the game installation
     * @param instanceName Optional instance name
     * @param progressReporter Progress reporter instance
     */
    private static installFromDirectory(sourceDir: string, installPath: string, instanceName?: string, progressReporter?: any): Promise<null> {
        return new Promise((ff, rj) => {
            const archiver = require('archiver');
            const fs = require('fs');
            const tempZipPath: string = joinPath(app.getPath("temp"), "ddmm-temp-" + randomBytes(8).toString("hex") + ".zip");
            
            try {
                progressReporter.updatePhase('extracting', 'Preparing extracted files for installation...', 40);
                
                // Create a temporary zip from the extracted directory
                const output = fs.createWriteStream(tempZipPath);
                const archive = archiver('zip', { zlib: { level: 9 } });
                
                output.on('close', () => {
                    // Install the temporary zip file
                    ModInstaller.installZip(tempZipPath, installPath, instanceName, progressReporter).then(() => {
                        // Clean up temporary zip
                        try { unlinkSync(tempZipPath); } catch (e) {}
                        ff(undefined);
                    }).catch(e => {
                        try { unlinkSync(tempZipPath); } catch (cleanupErr) {}
                        rj(e);
                    });
                });
                
                output.on('error', (err) => {
                    const wrappedError = new ExtractionError(sourceDir, err);
                    progressReporter.error(wrappedError, 'extracting');
                    rj(wrappedError);
                });
                
                archive.on('error', (err) => {
                    const wrappedError = new ExtractionError(sourceDir, err);
                    progressReporter.error(wrappedError, 'extracting');
                    rj(wrappedError);
                });
                
                archive.pipe(output);
                archive.directory(sourceDir, false);
                archive.finalize();
                
            } catch (error) {
                const wrappedError = new ExtractionError(sourceDir, error);
                progressReporter.error(wrappedError, 'extracting');
                rj(wrappedError);
            }
        });
    }

    /**
     * Extracts a ZIP file to a directory
     * @param zipPath The path to the ZIP file
     * @param outputDir The directory to extract to
     */
    private static async extractZipToDirectory(zipPath: string, outputDir: string): Promise<void> {
        return new Promise((resolve, reject) => {
            mkdirsSync(outputDir);
            
            yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
                if (err) {
                    reject(new ExtractionError(zipPath, err));
                    return;
                }
                
                zipfile.readEntry();
                zipfile.on("entry", (entry) => {
                    if (/\/$/.test(entry.fileName)) {
                        // Directory entry
                        const dirPath = joinPath(outputDir, entry.fileName);
                        mkdirsSync(dirPath);
                        zipfile.readEntry();
                    } else {
                        // File entry
                        const filePath = joinPath(outputDir, entry.fileName);
                        const fileDir = filePath.split(pathSep).slice(0, -1).join(pathSep);
                        mkdirsSync(fileDir);
                        
                        zipfile.openReadStream(entry, (err, readStream) => {
                            if (err) {
                                reject(new FileOperationError("read", entry.fileName, err));
                                return;
                            }
                            
                            const writeStream = createWriteStream(filePath);
                            readStream.pipe(writeStream);
                            
                            writeStream.on('close', () => {
                                zipfile.readEntry();
                            });
                            
                            writeStream.on('error', (writeErr) => {
                                reject(new FileOperationError("write", filePath, writeErr));
                            });
                        });
                    }
                });
                
                zipfile.on("end", () => {
                    resolve();
                });
                
                zipfile.on("error", (zipErr) => {
                    reject(new ExtractionError(zipPath, zipErr));
                });
            });
        });
    }

    private static handleAnalysisEntry(entry: yauzl.Entry, state: ArchiveAnalysisState): void {
        state.totalEntries++;

        if (!entry || !entry.fileName) {
            return;
        }

        const normalized = entry.fileName.replace(/\\/g, "/");
        if (!normalized) {
            return;
        }

        const isDirectory = /\/$/.test(normalized);
        const parts = normalized.split("/").filter(part => part && part !== ".");

        if (parts.length === 0) {
            return;
        }

        const firstSegment = parts[0];
        if (firstSegment === "__MACOSX") {
            return;
        }

        if (!isDirectory && parts.length === 1) {
            state.hasRootFiles = true;
        } else if (parts.length > 0) {
            state.topLevelCandidates.add(firstSegment);
        }

        if (parts.length > 1) {
            const second = parts[1].toLowerCase();
            if (["game", "characters", "autorun", "renpy", "lib", "libs", "python-packages"].includes(second)) {
                state.modRootCandidates.add(parts[0]);
            }
            if (parts.length > 2) {
                const third = parts[2].toLowerCase();
                if (["game", "characters"].includes(third)) {
                    state.modRootCandidates.add(parts[0] + "/" + parts[1]);
                }
            }
        }

        const appIndex = parts.findIndex(segment => segment.toLowerCase().endsWith(".app"));
        if (appIndex === 0) {
            state.topLevelAppBundles.add(parts[0]);
        }

        if (!isDirectory) {
            const filename = parts[parts.length - 1].toLowerCase();
            if (filename.endsWith(".exe")) {
                state.containsExecutables = true;
            }
        }
    }

    private static finalizeAnalysis(state: ArchiveAnalysisState): ArchiveAnalysisResult {
        let stripSegments = 0;
        let modRootDir: string | null = null;

        if (state.modRootCandidates.size > 0) {
            modRootDir = Array.from(state.modRootCandidates).sort((a, b) => b.length - a.length)[0];
            stripSegments = modRootDir.split("/").length;
        } else {
            const filteredTopLevel = Array.from(state.topLevelCandidates).filter(name => name && name !== "__MACOSX");
            if (!state.hasRootFiles && filteredTopLevel.length === 1) {
                stripSegments = 1;
            }
        }

        return {
            totalEntries: state.totalEntries,
            stripSegments,
            modRootDir,
            topLevelAppBundles: state.topLevelAppBundles,
            containsExecutables: state.containsExecutables
        };
    }

    private static async writeInstallJson(installJsonPath: string, installJson: any): Promise<void> {
        const payload = JSON.stringify(installJson, null, 2);
        try {
            await SafeFileOperations.writeFile(installJsonPath, payload, {
                createBackup: true,
                atomicOperation: true,
                validatePath: true
            });
            console.debug("[install.json] install.json written:", installJsonPath);
        } catch (error) {
            console.error("[install.json] Safe write failed:", error);
            try {
                writeFileSync(installJsonPath, payload, "utf8");
            } catch (fallbackError) {
                console.error("[install.json] Fallback write failed:", fallbackError);
                throw fallbackError;
            }
        }
    }

    private static async writeModConfiguration(installPath: string, mapperName: string): Promise<void> {
        const configPath = joinPath(installPath, "game", "mod.json");
        try {
            mkdirsSync(dirname(configPath));
        } catch {
            // Ignore errors when directory already exists
        }

        const configData = {
            mapper: mapperName
        };
        const payload = JSON.stringify(configData, null, 2);

        try {
            await SafeFileOperations.writeFile(configPath, payload, {
                createBackup: false,
                atomicOperation: true,
                validatePath: false
            });
            console.log("Wrote mod instance config:", configPath);
        } catch (error) {
            console.warn("Failed to write mod instance config safely:", error.message ?? error);
            try {
                writeFileSync(configPath, payload);
            } catch (fallbackError) {
                console.warn("Fallback mod config write failed:", fallbackError.message ?? fallbackError);
            }
        }
    }

    private static locateExistingAppBundleName(installPath: string): string | null {
        if (process.platform !== "darwin") {
            return null;
        }

        try {
            const fs = require("fs");
            const entries = fs.readdirSync(installPath);
            for (const entry of entries) {
                if (entry.toLowerCase().endsWith(".app")) {
                    const fullPath = joinPath(installPath, entry);
                    try {
                        const stats = fs.statSync(fullPath);
                        if (stats.isDirectory()) {
                            return entry;
                        }
                    } catch {
                        // Ignore stat errors
                    }
                }
            }
        } catch (error) {
            console.warn("Unable to detect existing app bundle:", error.message ?? error);
        }

        return null;
    }

    private static joinPathSegments(base: string, segments: string[]): string {
        return segments.reduce((current, segment) => joinPath(current, segment), base);
    }

    private static resolveMacAppSegments(appName: string, segments: string[]): string[] {
        const sanitized = segments.filter(segment => segment && segment !== ".");

        if (sanitized.length === 0) {
            return [appName];
        }

        const lower = sanitized[0].toLowerCase();

        if (lower === "contents") {
            return [appName, ...sanitized];
        }

        if (lower === "macos") {
            return [appName, "Contents", ...sanitized];
        }

        if (lower === "resources") {
            return [appName, "Contents", ...sanitized];
        }

        const baseResources = [appName, "Contents", "Resources"];
        const baseMacOS = [appName, "Contents", "MacOS"];

        if (lower === "frameworks") {
            return [appName, "Contents", ...sanitized];
        }

        if (lower === "lib") {
            return [...baseMacOS, ...sanitized];
        }

        if (lower === "autorun") {
            return [...baseResources, "autorun", ...sanitized.slice(1)];
        }

        if (["renpy", "game", "python-packages", "update", "updates"].includes(lower)) {
            return [...baseResources, "autorun", ...sanitized];
        }

        // Default: treat as autorun payload
        return [...baseResources, "autorun", ...sanitized];
    }

    public static resolveExtractionPath(originalSegments: string[], stripSegments: number, context: ExtractionContext): ResolutionResult | null {
        if (!originalSegments || originalSegments.length === 0) {
            return null;
        }

        const sanitizedOriginal = originalSegments.filter(segment => segment && segment !== ".");
        if (sanitizedOriginal.length === 0) {
            return null;
        }

        const lowerFirst = sanitizedOriginal[0].toLowerCase();
        if (lowerFirst === "__macosx") {
            return null;
        }

        const relativeSegments = stripSegments > 0 ? sanitizedOriginal.slice(stripSegments) : sanitizedOriginal.slice();

        if (relativeSegments.length === 0 && !sanitizedOriginal.some(segment => segment.toLowerCase().endsWith(".app"))) {
            return null;
        }

        if (relativeSegments.some(segment => segment === "..")) {
            console.warn("[Installer] Skipping path with traversal attempt:", sanitizedOriginal.join("/"));
            return null;
        }

        if (context.platform === "darwin") {
            const appIndex = sanitizedOriginal.findIndex(segment => segment.toLowerCase().endsWith(".app"));
            if (appIndex !== -1) {
                const insideSegments = sanitizedOriginal.slice(appIndex + 1);
                const targetAppName = context.appDestinationName || context.defaultAppName || "DDLC.app";
                const segments = ModInstaller.resolveMacAppSegments(targetAppName, insideSegments);
                return {
                    absolutePath: ModInstaller.joinPathSegments(context.installPath, segments.filter(Boolean)),
                    relativePath: segments.filter(Boolean).join("/")
                };
            }

            const firstRelative = (relativeSegments[0] || "").toLowerCase();
            const targetAppName = context.appDestinationName || context.defaultAppName || "DDLC.app";
            const segments = ModInstaller.resolveMacAppSegments(targetAppName, relativeSegments);

            return {
                absolutePath: ModInstaller.joinPathSegments(context.installPath, segments.filter(Boolean)),
                relativePath: segments.filter(Boolean).join("/")
            };
        }

        const normalizedRelative = relativeSegments.join("/");
        if (!normalizedRelative) {
            return null;
        }

        const destination = CrossPlatformPathResolver.resolveModInstallPath(context.installPath, normalizedRelative);
        return {
            absolutePath: destination,
            relativePath: normalizedRelative
        };
    }

    private static extractArchive(modPath: string, analysis: ArchiveAnalysisResult, context: ExtractionContext, progressReporter: any): Promise<void> {
        return new Promise((resolve, reject) => {
            yauzl.open(modPath, {lazyEntries: true}, (err, zipfile) => {
                if (err) {
                    const wrappedError = new ExtractionError(modPath, err);
                    progressReporter.error(wrappedError, 'installing');
                    reject(wrappedError);
                    return;
                }

                let entriesProcessed = 0;
                const totalEntries = analysis.totalEntries || 0;
                let extractionCompleted = false;

                const finalize = () => {
                    if (extractionCompleted) {
                        return;
                    }
                    extractionCompleted = true;
                    progressReporter.updatePhase('verifying', 'Finalizing installation...', 90);
                    try {
                        zipfile.close();
                    } catch {
                        // ignore
                    }
                    resolve();
                };

                const fail = (error: Error) => {
                    if (extractionCompleted) {
                        return;
                    }
                    extractionCompleted = true;
                    try {
                        zipfile.close();
                    } catch {
                        // ignore
                    }
                    reject(error);
                };

                const processNextEntry = () => {
                    if (!extractionCompleted) {
                        zipfile.readEntry();
                    }
                };

                zipfile.readEntry();
                zipfile.on("entry", (entry) => {
                    if (extractionCompleted) {
                        return;
                    }

                    entriesProcessed++;

                    const normalized = entry.fileName.replace(/\\/g, "/");
                    const originalSegments = normalized.split("/").filter(segment => segment && segment !== ".");

                    if (originalSegments.length === 0 || originalSegments[0] === "__MACOSX") {
                        if (entriesProcessed >= totalEntries) {
                            finalize();
                        } else {
                            processNextEntry();
                        }
                        return;
                    }

                    const resolution = ModInstaller.resolveExtractionPath(originalSegments, analysis.stripSegments, context);
                    if (!resolution) {
                        if (entriesProcessed >= totalEntries) {
                            finalize();
                        } else {
                            processNextEntry();
                        }
                        return;
                    }

                    const isDirectory = /\/$/.test(entry.fileName);

                    if (isDirectory) {
                        try {
                            mkdirsSync(resolution.absolutePath);
                        } catch (dirErr) {
                            console.warn("Failed to ensure directory:", resolution.absolutePath, dirErr.message);
                        }
                        if (entriesProcessed >= totalEntries) {
                            finalize();
                        } else {
                            processNextEntry();
                        }
                        return;
                    }

                    const outputDir = dirname(resolution.absolutePath);
                    const resolvePathConflicts = (targetDir: string) => {
                        const fs = require("fs");
                        const pathParts = targetDir.split(pathSep);
                        for (let i = 1; i <= pathParts.length; i++) {
                            const partialPath = pathParts.slice(0, i).join(pathSep);
                            try {
                                const stats = fs.statSync(partialPath);
                                if (stats.isFile()) {
                                    console.warn("Found file blocking directory creation:", partialPath);
                                    fs.unlinkSync(partialPath);
                                }
                            } catch {
                                // ignore missing paths
                            }
                        }
                    };

                    resolvePathConflicts(outputDir);

                    try {
                        mkdirsSync(outputDir);
                    } catch (dirErr) {
                        console.warn("Could not create directory " + outputDir + ":", dirErr.message);
                        resolvePathConflicts(outputDir);
                        try {
                            mkdirsSync(outputDir);
                        } catch (retryErr) {
                            console.error("Failed to create directory after conflict resolution:", retryErr.message);
                        }
                    }

                    zipfile.openReadStream(entry, (errStream, readStream) => {
                        if (errStream) {
                            fail(new FileOperationError("read", resolution.relativePath, errStream));
                            return;
                        }

                        let writeStream;
                        try {
                            writeStream = createWriteStream(resolution.absolutePath);
                        } catch (createErr) {
                            console.error("Failed to create write stream for " + resolution.absolutePath + ":", createErr);
                            resolvePathConflicts(outputDir);
                            try {
                                mkdirsSync(outputDir);
                                writeStream = createWriteStream(resolution.absolutePath);
                            } catch (finalErr) {
                                fail(new FileOperationError("write", resolution.relativePath, finalErr));
                                return;
                            }
                        }

                        readStream.pipe(writeStream);

                        readStream.on("error", (streamErr) => {
                            fail(new FileOperationError("read", resolution.relativePath, streamErr));
                        });

                        writeStream.on("error", (streamErr) => {
                            fail(new FileOperationError("write", resolution.relativePath, streamErr));
                        });

                        writeStream.on("close", () => {
                            const progressValue = totalEntries > 0
                                ? Math.min(90, Math.round((entriesProcessed / totalEntries) * 60) + 30)
                                : 90;
                            const message = `Processing entry ${entriesProcessed} of ${totalEntries}`;
                            progressReporter.updateProgress(progressValue, resolution.relativePath, message);
                            console.log(`[Installation] ${message}`);
                            if (entriesProcessed >= totalEntries) {
                                finalize();
                            } else {
                                processNextEntry();
                            }
                        });
                    });
                });

                zipfile.on("end", () => {
                    if (!extractionCompleted) {
                        finalize();
                    }
                });

                zipfile.on("error", (zipErr) => {
                    fail(new ExtractionError(modPath, zipErr));
                });
            });
        });
    }

    /**
     * Recursively collects all files in a directory
     * @param dirPath The directory to scan
     * @returns Array of relative file paths
     */
    private static async collectModFiles(dirPath: string): Promise<string[]> {
        const fs = require('fs');
        const path = require('path');
        const files: string[] = [];
        
        function walkDir(currentPath: string, relativePath: string = '') {
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const itemPath = path.join(currentPath, item);
                const itemRelativePath = relativePath ? path.join(relativePath, item) : item;
                
                const stats = fs.statSync(itemPath);
                if (stats.isDirectory()) {
                    walkDir(itemPath, itemRelativePath);
                } else if (stats.isFile()) {
                    files.push(itemRelativePath);
                }
            }
        }
        
        try {
            walkDir(dirPath);
            return files;
        } catch (error) {
            console.error('Error collecting mod files:', error);
            return [];
        }
    }

    private static isArchive(filename: string): boolean {
        return UniversalArchiveExtractor.isSupportedArchive(filename);
    }
}
