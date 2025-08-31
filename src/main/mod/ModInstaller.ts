import * as yauzl from "yauzl";
import {createWriteStream, unlinkSync, removeSync, readFileSync, writeFileSync, existsSync} from "fs-extra";
import {mkdirsSync} from "fs-extra";
import {join as joinPath, sep as pathSep} from "path";
import {inferMapper} from "./ModNormaliser";
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
import DDLCModTemplate2Format from "./mappers/DDLCModTemplate2Format";
import MacOSFileCleanup from "../utils/MacOSFileCleanup";
import {ModContainerManager} from "../container/ModContainerManager";
import {ModContainer, ModManifest} from "../container/ModContainer";
import { AdvancedBackupManager } from "../backup/BackupManager";
import {InputValidator} from "../utils/InputValidator";
import {SafeFileOperations} from "../utils/SafeFileOperations";

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
            const mapper = await inferMapper(tempDir);
            
            // Collect mod files
            const modFiles = await ModInstaller.collectModFiles(tempDir);
            
            progressReporter.updatePhase('analyzing', 'Creating mod manifest...', 30);
            
            // Create mod manifest
            const manifest = ModContainerManager.createModManifest({
                name: instanceName,
                version: "1.0.0", // Could be extracted from mod metadata if available
                files: modFiles,
                originalModPath: modPath,
                mapper: mapper.getFriendlyName()
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
        return new Promise((ff, rj) => {
            // Create progress reporter if not provided
            if (!progressReporter) {
                const sessionId = randomBytes(8).toString("hex");
                progressReporter = InstallationProgressManager.createReporter(sessionId);
            }
            
            progressReporter.updatePhase('analyzing', 'Preparing installation directory...', 5);
            mkdirsSync(installPath);
            const installJsonPath = joinPath(installPath, "install.json");
            console.log("Preparing to install mod from " + modPath);
            
            progressReporter.updatePhase('analyzing', 'Detecting mod format...', 10);
            inferMapper(modPath).then(async (mapper) => {
                let modName = instanceName ?? "";
                if (!instanceName && existsSync(installJsonPath)) {
                    try {
                        const parsed = JSON.parse(readFileSync(installJsonPath, "utf8"));
                        if (parsed && parsed.name) {
                            modName = parsed.name;
                        }
                    } catch (e) {}
                }
                if (!modName) {
                    throw new Error("No instance name provided and install.json does not contain a name.");
                }
                const installJson = {
                    name: modName,
                    globalSave: false,
                    mod: null,
                    mapper: ""
                };
                if (process.platform === "linux" && mapper instanceof DDLCModTemplate2Format) {
                    const WineAPI = require("../sdk/WineAPI");
                    console.debug("[Wine] Ensuring Wine is set up for Linux install...");
                    await WineAPI.ensureWine();
                }
                installJson.mapper = mapper.getFriendlyName();
                progressReporter.updatePhase('analyzing', 'Writing installation metadata...', 20);
                try {
                    // Use SafeFileOperations for atomic write with backup
                    SafeFileOperations.writeFile(
                        installJsonPath,
                        JSON.stringify(installJson, null, 2),
                        {
                            createBackup: true,
                            atomicOperation: true,
                            validatePath: true
                        }
                    ).then(() => {
                        console.debug("[install.json] install.json written and flushed successfully. Contents:", installJson);
                    }).catch(e => {
                        console.error("[install.json] Failed to write and flush install.json:", e);
                        // Fallback to synchronous write
                        try {
                            const fs = require("fs");
                            const fd = fs.openSync(installJsonPath, "w");
                            fs.writeSync(fd, JSON.stringify(installJson, null, 2), null, "utf8");
                            fs.fsyncSync(fd);
                            fs.closeSync(fd);
                        } catch (fallbackError) {
                            console.error("[install.json] Fallback write also failed:", fallbackError);
                        }
                    });
                } catch (e) {
                    console.error("[install.json] Failed to initiate safe write:", e);
                }
                for (const file of mapper.getFilesToDelete()) {
                    console.log("Deleting " + file);
                    try {
                        unlinkSync(joinPath(installPath, "game", file));
                    } catch (e) {
                        console.warn("Could not delete file " + file + ":", e.message);
                    }
                }
                console.log("Installing with mapper: " + mapper.getFriendlyName());
                progressReporter.updatePhase('analyzing', 'Opening archive for analysis...', 25);
                yauzl.open(modPath, {lazyEntries: true}, (err, zipfile) => {
                    if (err) {
                        console.error("Failed to open mod zip file:", err);
                        const wrappedError = new ExtractionError(modPath, err);
                        progressReporter.error(wrappedError, 'analyzing');
                        rj(wrappedError);
                        return;
                    }
                    let entriesProcessed = 0;
                    let totalEntries = 0;
                    let topLevelDir: string | null = null;
                    let allShareTopLevel = true;
                    const topLevelCandidates = new Set<string>();
                    let hasRootFiles = false;
                    const modRootCandidates = new Set<string>();
                    const parentToChildren = new Map<string, Set<string>>();
                    // First pass: count total entries and detect top-level dirs
                    zipfile.readEntry();
                    zipfile.on("entry", (entry) => {
                        totalEntries++;
                        const parts = entry.fileName.split("/");
                        if (parts.length > 1) {
                            topLevelCandidates.add(parts[0]);
                            if (!parentToChildren.has(parts[0])) parentToChildren.set(parts[0], new Set());
                            parentToChildren.get(parts[0]).add(parts[1]);
                            if (parts[1] === "game" || parts[1] === "characters") {
                                modRootCandidates.add(parts[0]);
                            }
                            // Detect nested mod root: e.g. CupcakeDelivery-v1.0-Renpy7Mod/CupcakeDelivery-1.0.1-pc/game
                            if (parts.length > 2 && (parts[2] === "game" || parts[2] === "characters")) {
                                if (!parentToChildren.has(parts[0] + "/" + parts[1])) parentToChildren.set(parts[0] + "/" + parts[1], new Set());
                                parentToChildren.get(parts[0] + "/" + parts[1]).add(parts[2]);
                                modRootCandidates.add(parts[0] + "/" + parts[1]);
                            }
                        } else {
                            hasRootFiles = true;
                            allShareTopLevel = false;
                        }
                        zipfile.readEntry();
                    });
                    zipfile.on("end", () => {
                        // Pick the deepest mod root directory if there is one
                        let modRootDir = null;
                        if (modRootCandidates.size > 0) {
                            // Prefer the deepest (longest) candidate
                            modRootDir = Array.from(modRootCandidates).sort((a, b) => b.length - a.length)[0];
                        }
                        console.log("Total entries to process:", totalEntries, "Top-level dirs:", Array.from(topLevelCandidates), "Mod root dir:", modRootDir);
                        progressReporter.updatePhase('installing', `Installing ${totalEntries} files...`, 30);
                        yauzl.open(modPath, {lazyEntries: true}, (err, zipfile2) => {
                            if (err) {
                                console.error("Failed to reopen mod zip file:", err);
                                rj(err);
                                return;
                            }
                            const processNextEntry = () => {
                                zipfile2.readEntry();
                            };
                            let appBundleDeleted = false; // Track if DDLC.app has been deleted for replacement
                            zipfile2.readEntry();
                            zipfile2.on("entry", (entry) => {
                                let fileName = entry.fileName;
                                entriesProcessed++;
                                if (/\/$/.test(fileName)) {
                                    console.log("Skipping directory:", fileName);
                                    if (entriesProcessed >= totalEntries) {
                                        console.log("Mod installation completed successfully");
                                        ff(undefined);
                                    } else {
                                        processNextEntry();
                                    }
                                    return;
                                }
                                // Calculate how many segments to strip
                                let stripSegments = 0;
                                if (modRootDir) {
                                    stripSegments = modRootDir.split("/").length;
                                }
                                // If this file is under the mod root dir, strip it
                                if (modRootDir && fileName.startsWith(modRootDir + "/")) {
                                    fileName = fileName.split("/").slice(stripSegments).join("/");
                                } else {
                                    // For .app bundles at the same level as mod root, also strip
                                    const appDirMatch = entry.fileName.match(/^((?:[^/]+\/){0,})([^/]+\.app)\//);
                                    if (appDirMatch) {
                                        const appPathSegments = appDirMatch[1].split("/").filter(Boolean);
                                        if (appPathSegments.length === stripSegments - 1) {
                                            // Place .app at top level
                                            fileName = fileName.split("/").slice(stripSegments - 1).join("/");
                                        }
                                    }
                                }
                                const mappedPath = mapper.mapFile(fileName);
                                if (mappedPath === null) {
                                    console.log("Ignoring file:", fileName);
                                    if (entriesProcessed >= totalEntries) {
                                        console.log("Mod installation completed successfully");
                                        ff(undefined);
                                    } else {
                                        processNextEntry();
                                    }
                                    return;
                                }
                                
                                // Handle app bundle replacement for macOS (only delete once)
                                if (process.platform === "darwin" && mapper.requiresAppBundleReplacement && mapper.requiresAppBundleReplacement() && !appBundleDeleted) {
                                    const appBundle = mapper.getAppBundleToReplace(fileName);
                                    if (appBundle) {
                                        console.log("App bundle replacement: Deleting existing DDLC.app and will replace with", appBundle);
                                        const ddlcAppPath = joinPath(installPath, "DDLC.app");
                                        try {
                                            if (require("fs").existsSync(ddlcAppPath)) {
                                                console.log("Deleting existing DDLC.app:", ddlcAppPath);
                                                removeSync(ddlcAppPath);
                                                appBundleDeleted = true; // Mark as deleted so we don't delete again
                                            }
                                        } catch (e) {
                                            console.warn("Could not delete existing DDLC.app:", e.message);
                                        }
                                    }
                                }
                                
                                // Validate the mapped path for security
                                const pathValidation = InputValidator.validateFilePath(mappedPath, {
                                    restrictToBasePath: installPath,
                                    allowExecutables: false,
                                    maxFileSize: 100 * 1024 * 1024 // 100MB per file
                                });
                                
                                if (!pathValidation.isValid) {
                                    console.warn("Skipping file with invalid path:", fileName, "->", mappedPath, "Errors:", pathValidation.errors);
                                    if (entriesProcessed >= totalEntries) {
                                        console.log("Mod installation completed successfully");
                                        ff(undefined);
                                    } else {
                                        processNextEntry();
                                    }
                                    return;
                                }
                                
                                const outputPath = joinPath(installPath, pathValidation.sanitized);
                                console.log("Extracting:", fileName, "->", pathValidation.sanitized);
                                const outputDir = outputPath.split(pathSep).slice(0, -1).join(pathSep);
                                
                                // Enhanced conflict resolution function
                                const resolvePathConflicts = (targetDir: string) => {
                                    const fs = require("fs");
                                    const pathParts = targetDir.split(pathSep);
                                    for (let i = 1; i <= pathParts.length; i++) {
                                        const partialPath = pathParts.slice(0, i).join(pathSep);
                                        try {
                                            const stats = fs.statSync(partialPath);
                                            if (stats.isFile()) {
                                                console.warn("Found file blocking directory creation:", partialPath);
                                                console.warn("Removing conflicting file to allow directory creation");
                                                fs.unlinkSync(partialPath);
                                            }
                                        } catch (statErr) {
                                            // Path doesn't exist, continue checking
                                        }
                                    }
                                };
                                
                                // First, resolve any conflicts in the path
                                resolvePathConflicts(outputDir);
                                
                                // Then try to create the directory
                                try {
                                    mkdirsSync(outputDir);
                                } catch (e) {
                                    console.warn("Could not create directory " + outputDir + ":", e.message);
                                    // Try conflict resolution again and retry
                                    resolvePathConflicts(outputDir);
                                    try {
                                        mkdirsSync(outputDir);
                                    } catch (retryErr) {
                                        console.error("Failed to create directory after conflict resolution:", retryErr.message);
                                    }
                                }
                                zipfile2.openReadStream(entry, (err, readStream) => {
                                    if (err) {
                                        console.error("Failed to open read stream for " + fileName + ":", err);
                                        const wrappedError = new FileOperationError("read", fileName, err);
                                        progressReporter.error(wrappedError, 'installing');
                                        rj(wrappedError);
                                        return;
                                    }
                                    let writeStream;
                                    try {
                                        writeStream = createWriteStream(outputPath);
                                    } catch (createErr) {
                                        console.error("Failed to create write stream for " + outputPath + ":", createErr);
                                        // Try resolving conflicts one more time
                                        resolvePathConflicts(outputDir);
                                        try {
                                            mkdirsSync(outputDir);
                                            writeStream = createWriteStream(outputPath);
                                        } catch (finalErr) {
                                            console.error("Final attempt failed for " + outputPath + ":", finalErr);
                                            const wrappedError = new FileOperationError("write", outputPath, finalErr);
                                            progressReporter.error(wrappedError, 'installing');
                                            rj(wrappedError);
                                            return;
                                        }
                                    }
                                    
                                    readStream.pipe(writeStream);
                                    writeStream.on('close', () => {
                                        const fileProgress = Math.round((entriesProcessed / totalEntries) * 60) + 30; // 30-90% range
                                        progressReporter.updateProgress(fileProgress, fileName, `Processing file ${entriesProcessed} of ${totalEntries}`);
                                        console.log(`Progress: ${entriesProcessed}/${totalEntries} entries processed`);
                                        if (entriesProcessed >= totalEntries) {
                                            progressReporter.updatePhase('verifying', 'Finalizing installation...', 90);
                                            console.log("Mod installation completed successfully");
                                            // Write mod instance config with mapper info
                                            const configPath = joinPath(installPath, "game", "mod.json");
                                            const configData = {
                                                mapper: mapper.getFriendlyName ? mapper.getFriendlyName() : (mapper.constructor?.name || "unknown")
                                            };
                                            try {
                                                // Use SafeFileOperations for better error handling
                                                SafeFileOperations.writeFile(
                                                    configPath,
                                                    JSON.stringify(configData, null, 2),
                                                    {
                                                        createBackup: false,
                                                        atomicOperation: true,
                                                        validatePath: true
                                                    }
                                                ).then(() => {
                                                    console.log("Wrote mod instance config:", configPath);
                                                }).catch(e => {
                                                    console.warn("Failed to write mod instance config:", e.message);
                                                    // Fallback to synchronous write
                                                    try {
                                                        writeFileSync(configPath, JSON.stringify(configData, null, 2));
                                                    } catch (fallbackError) {
                                                        console.warn("Fallback config write failed:", fallbackError.message);
                                                    }
                                                });
                                            } catch (e) {
                                                console.warn("Failed to initiate safe config write:", e.message);
                                            }
                                            
                                            // Clean up macOS resource fork files that can interfere with game execution
                                            progressReporter.updatePhase('verifying', 'Cleaning up macOS files...', 95);
                                            MacOSFileCleanup.cleanGameInstallation(installPath);
                                            
                                            progressReporter.complete();
                                            ff(undefined);
                                        } else {
                                            processNextEntry();
                                        }
                                    });
                                    writeStream.on('error', (err) => {
                                        console.error("Failed to write file " + outputPath + ":", err);
                                        // If writing fails, try resolving conflicts and retrying
                                        if (err.code === 'ENOTDIR') {
                                            console.log("ENOTDIR error detected, attempting conflict resolution and retry");
                                            resolvePathConflicts(outputDir);
                                            try {
                                                mkdirsSync(outputDir);
                                                // Restart the extraction for this file
                                                zipfile2.openReadStream(entry, (retryErr, retryReadStream) => {
                                                    if (retryErr) {
                                                        console.error("Failed to retry read stream:", retryErr);
                                                        const wrappedError = new FileOperationError("retry read", fileName, retryErr);
                                                        progressReporter.error(wrappedError, 'installing');
                                                        rj(wrappedError);
                                                        return;
                                                    }
                                                    const retryWriteStream = createWriteStream(outputPath);
                                                    retryReadStream.pipe(retryWriteStream);
                                                    retryWriteStream.on('close', () => {
                                                        console.log("Retry successful for:", outputPath);
                                                        const fileProgress = Math.round((entriesProcessed / totalEntries) * 60) + 30;
                                                        progressReporter.updateProgress(fileProgress, fileName);
                                                        console.log(`Progress: ${entriesProcessed}/${totalEntries} entries processed`);
                                                        if (entriesProcessed >= totalEntries) {
                                                            progressReporter.updatePhase('verifying', 'Finalizing installation...', 90);
                                                            console.log("Mod installation completed successfully");
                                                            progressReporter.complete();
                                                            ff(undefined);
                                                        } else {
                                                            processNextEntry();
                                                        }
                                                    });
                                                    retryWriteStream.on('error', (retryWriteErr) => {
                                                        console.error("Retry also failed:", retryWriteErr);
                                                        const wrappedError = new FileOperationError("retry write", outputPath, retryWriteErr);
                                                        progressReporter.error(wrappedError, 'installing');
                                                        rj(wrappedError);
                                                    });
                                                });
                                            } catch (resolveErr) {
                                                console.error("Conflict resolution failed:", resolveErr);
                                                const wrappedError = new PathConflictError(outputPath);
                                                progressReporter.error(wrappedError, 'installing');
                                                rj(wrappedError);
                                            }
                                        } else {
                                            const wrappedError = new FileOperationError("write", outputPath, err);
                                            progressReporter.error(wrappedError, 'installing');
                                            rj(wrappedError);
                                        }
                                    });
                                    readStream.on('error', (err) => {
                                        console.error("Failed to read from zip stream for " + fileName + ":", err);
                                        const wrappedError = new FileOperationError("read", fileName, err);
                                        progressReporter.error(wrappedError, 'installing');
                                        rj(wrappedError);
                                    });
                                });
                            });
                            zipfile2.on("end", () => {
                                if (totalEntries === 0) {
                                    console.log("No entries to process - mod installation completed");
                                    progressReporter.complete();
                                    ff(undefined);
                                }
                            });
                            zipfile2.on("error", (err) => {
                                console.error("Error during mod extraction:", err);
                                const wrappedError = ErrorHandlerUtils.wrapError(err, 'installing', modPath);
                                progressReporter.error(wrappedError, 'installing');
                                rj(wrappedError);
                            });
                        });
                    });
                    zipfile.on("error", (err) => {
                        console.error("Error counting files in zip:", err);
                        const wrappedError = new ExtractionError(modPath, err);
                        progressReporter.error(wrappedError, 'analyzing');
                        rj(wrappedError);
                    });
                });
            }).catch((err) => {
                console.error("Error during mod installation:", err);
                const wrappedError = ErrorHandlerUtils.wrapError(err, 'analyzing', modPath);
                progressReporter.error(wrappedError);
                rj(wrappedError);
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