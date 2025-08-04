import * as yauzl from "yauzl";
import {createWriteStream, unlinkSync, removeSync, readFileSync, writeFileSync, existsSync} from "fs-extra";
import {mkdirsSync} from "fs-extra";
import {join as joinPath, sep as pathSep} from "path";
import {inferMapper} from "./ModNormaliser";
import ArchiveConverter from "../archive/ArchiveConverter";
import {app} from "electron";
import {randomBytes} from "crypto";
import DDLCModTemplate2Format from "./mappers/DDLCModTemplate2Format";
import MacOSFileCleanup from "../utils/MacOSFileCleanup";

export default class ModInstaller {

    /**
     * Installs a mod into a copy of DDLC by guessing which files should go where
     * @param modPath The path to the mod
     * @param installPath The path to the game installation
     */
    public static installMod(modPath: string, installPath: string, instanceName?: string): Promise<null> {
        if (modPath.endsWith(".zip")) {
            return ModInstaller.installZip(modPath, installPath, instanceName);
        } else if (ModInstaller.isArchive(modPath)) { // Fix: use class name for static method
            return new Promise((ff, rj) => {
                const tempZipPath: string = joinPath(app.getPath("temp"), "ddmm" + randomBytes(8).toString("hex") + ".zip");
                ArchiveConverter.convertToZip(modPath, tempZipPath).then(() => {
                    ModInstaller.installZip(tempZipPath, installPath, instanceName).then(() => {
                        removeSync(tempZipPath);
                        ff(undefined);
                    }).catch(e => {
                        rj(e);
                    });
                }).catch(e => {
                    rj(e);
                });
            });
        } else {
            return new Promise((ff, rj) => {
                rj(new Error("File was not an archive."));
            })
        }
    }

    private static installZip(modPath: string, installPath: string, instanceName?: string): Promise<null> {
        return new Promise((ff, rj) => {
            mkdirsSync(installPath);
            const installJsonPath = joinPath(installPath, "install.json");
            console.log("Preparing to install mod from " + modPath);
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
                try {
                    const fs = require("fs");
                    const fd = fs.openSync(installJsonPath, "w");
                    fs.writeSync(fd, JSON.stringify(installJson, null, 2), null, "utf8");
                    fs.fsyncSync(fd);
                    fs.closeSync(fd);
                    const dirFd = fs.openSync(installPath, "r");
                    fs.fsyncSync(dirFd);
                    fs.closeSync(dirFd);
                    console.debug("[install.json] install.json written and flushed successfully. Contents:", installJson);
                } catch (e) {
                    console.error("[install.json] Failed to write and flush install.json:", e);
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
                yauzl.open(modPath, {lazyEntries: true}, (err, zipfile) => {
                    if (err) {
                        console.error("Failed to open mod zip file:", err);
                        rj(err);
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
                                
                                const outputPath = joinPath(installPath, mappedPath);
                                console.log("Extracting:", fileName, "->", mappedPath);
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
                                        rj(err);
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
                                            rj(finalErr);
                                            return;
                                        }
                                    }
                                    
                                    readStream.pipe(writeStream);
                                    writeStream.on('close', () => {
                                        console.log(`Progress: ${entriesProcessed}/${totalEntries} entries processed`);
                                        if (entriesProcessed >= totalEntries) {
                                            console.log("Mod installation completed successfully");
                                            // Write mod instance config with mapper info
                                            const configPath = joinPath(installPath, "game", "mod.json");
                                            const configData = {
                                                mapper: mapper.getFriendlyName ? mapper.getFriendlyName() : (mapper.constructor?.name || "unknown")
                                            };
                                            try {
                                                writeFileSync(configPath, JSON.stringify(configData, null, 2));
                                                console.log("Wrote mod instance config:", configPath);
                                            } catch (e) {
                                                console.warn("Failed to write mod instance config:", e.message);
                                            }
                                            
                                            // Clean up macOS resource fork files that can interfere with game execution
                                            MacOSFileCleanup.cleanGameInstallation(installPath);
                                            
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
                                                        rj(retryErr);
                                                        return;
                                                    }
                                                    const retryWriteStream = createWriteStream(outputPath);
                                                    retryReadStream.pipe(retryWriteStream);
                                                    retryWriteStream.on('close', () => {
                                                        console.log("Retry successful for:", outputPath);
                                                        console.log(`Progress: ${entriesProcessed}/${totalEntries} entries processed`);
                                                        if (entriesProcessed >= totalEntries) {
                                                            console.log("Mod installation completed successfully");
                                                            ff(undefined);
                                                        } else {
                                                            processNextEntry();
                                                        }
                                                    });
                                                    retryWriteStream.on('error', (retryWriteErr) => {
                                                        console.error("Retry also failed:", retryWriteErr);
                                                        rj(retryWriteErr);
                                                    });
                                                });
                                            } catch (resolveErr) {
                                                console.error("Conflict resolution failed:", resolveErr);
                                                rj(err);
                                            }
                                        } else {
                                            rj(err);
                                        }
                                    });
                                    readStream.on('error', (err) => {
                                        console.error("Failed to read from zip stream for " + fileName + ":", err);
                                        rj(err);
                                    });
                                });
                            });
                            zipfile2.on("end", () => {
                                if (totalEntries === 0) {
                                    console.log("No entries to process - mod installation completed");
                                    ff(undefined);
                                }
                            });
                            zipfile2.on("error", (err) => {
                                console.error("Error during mod extraction:", err);
                                rj(err);
                            });
                        });
                    });
                    zipfile.on("error", (err) => {
                        console.error("Error counting files in zip:", err);
                        rj(err);
                    });
                });
            }).catch((err) => {
                console.error("Error during mod installation:", err);
                rj(err);
            });
        });
    }

    private static isArchive(filename: string): boolean {
        const lowerFilename = filename.toLowerCase();
        const archiveExtensions = [
            "zip", "rar", "7z",
            "tar", "tar.gz", "tgz", "tar.bz2", "tar.xz", "tar.Z"
        ];
        
        return archiveExtensions.some(ext => lowerFilename.endsWith("." + ext));
    }
}