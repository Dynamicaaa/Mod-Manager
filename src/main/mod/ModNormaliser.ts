import * as yauzl from "yauzl";
import {ModMapper} from "./ModMapper";
import ModManagerFormat from "./mappers/ModManagerFormat";
import NestedGameFolder from "./mappers/NestedGameFolder";
import ModTemplateFormat from "./mappers/ModTemplateFormat";
import InstallAppropriateFiles from "./mappers/InstallAppropriateFiles";
import DumpAndHopeForTheBest from "./mappers/DumpAndHopeForTheBest";
import MacOSAutorunFormat from "./mappers/MacOSAutorunFormat";
import { RenpyVersionDetector, RenpyVersionInfo } from "../version/RenpyVersionDetector";

/*
    This script is intended to take any zip file and try and determine how DDMM should install it, if it is a mod.
    There's so many different ways mods are packaged, so this won't cover every scenario, but DDMM will allow the user
    to install a mod manually if this fails.
 */

/*
    Looks at the file structure of the zip file and attempts to determine what the format of the mod is.
    Also detects Ren'Py version information for compatibility checking.
 */
export async function inferMapper(zipPath: string): Promise<ModMapper> {
    return new Promise((ff, rj) => {
        yauzl.open(zipPath, {lazyEntries: true}, (err, zipfile) => {
            if (err) {
                console.error("Failed to open mod zip file for analysis:", err);
                rj(err);
                return;
            }

            const fileList: string[] = [];
            let hasModJson = false;
            let hasGameFolder = false;
            let hasCharactersFolder = false;
            let hasNestedStructure = false;
            let topLevelDirs = new Set<string>();
            let gameFiles = 0;
            let characterFiles = 0;
            let hasAppFile = false;
            let versionInfo: RenpyVersionInfo | null = null;

            zipfile.readEntry();
            zipfile.on("entry", (entry) => {
                const fileName = entry.fileName;
                fileList.push(fileName);

                // Check for mod.json (indicates ModManagerFormat)
                if (fileName === "mod.json" || fileName.endsWith("/mod.json")) {
                    hasModJson = true;
                }

                // Analyze directory structure
                const pathParts = fileName.split("/");
                if (pathParts.length > 1) {
                    topLevelDirs.add(pathParts[0]);

                    // Check for direct game/characters folders
                    if (pathParts[0] === "game") {
                        hasGameFolder = true;
                    }
                    if (pathParts[0] === "characters") {
                        hasCharactersFolder = true;
                    }

                    // Check for nested structure (folder/game/ or folder/characters/)
                    if (pathParts.length > 2 && (pathParts[1] === "game" || pathParts[1] === "characters")) {
                        hasNestedStructure = true;
                    }
                }

                // Count file types
                const fileExtension = fileName.split(".").pop()?.toLowerCase();
                if (fileExtension === "rpy" || fileExtension === "rpyc" || fileExtension === "rpa") {
                    gameFiles++;
                }
                if (fileExtension === "chr") {
                    characterFiles++;
                }
                
                // Check for .app files (macOS app bundles)
                if (fileName.toLowerCase().endsWith(".app") || fileName.toLowerCase().includes(".app/")) {
                    hasAppFile = true;
                }

                zipfile.readEntry();
            });

            zipfile.on("end", async () => {
                console.log("Analyzing mod structure:", {
                    hasModJson: hasModJson,
                    hasGameFolder,
                    hasCharactersFolder,
                    hasNestedStructure,
                    topLevelDirs: Array.from(topLevelDirs),
                    gameFiles,
                    characterFiles,
                    hasAppFile,
                    totalFiles: fileList.length
                });

                // Attempt to detect Ren'Py version from zip file contents
                try {
                    versionInfo = await detectVersionFromZip(zipPath, fileList);
                    console.log("Detected Ren'Py version:", versionInfo);
                } catch (error) {
                    console.warn("Could not detect Ren'Py version:", error.message);
                }

                let mapper: ModMapper;

                // Final DDLC Mod Template 2.0 detection logic:
                // - No mod.json at root
                // - At least one .exe file anywhere in the mod archive, but not in the "game" folder
                let isDDLCModTemplate2 = false;
                if (!hasModJson) {
                    // Only consider .exe files that are NOT in the top-level "game" folder
                    const hasExeOutsideGame = fileList.some(f => {
                        const lower = f.toLowerCase();
                        if (!lower.endsWith(".exe")) return false;
                        // Check if the .exe is in the top-level game folder
                        const parts = lower.split("/");
                        return !(parts[0] === "game");
                    });
                    if (hasExeOutsideGame) {
                        isDDLCModTemplate2 = true;
                    }
                }
                // On macOS, always prioritize MacOSAutorunFormat for proper app bundle structure
                if (process.platform === "darwin" && (gameFiles > 0 || characterFiles > 0)) {
                    // MacOSAutorunFormat: Use autorun folder and app bundle structure for macOS compatibility
                    mapper = new MacOSAutorunFormat(hasAppFile);
                } else if (isDDLCModTemplate2) {
                    const DDLCModTemplate2Format = require("./mappers/DDLCModTemplate2Format").default;
                    mapper = new DDLCModTemplate2Format();
                } else if (hasModJson && (hasGameFolder || hasCharactersFolder)) {
                    // ModManagerFormat: has mod.json and proper folder structure
                    mapper = new ModManagerFormat();
                } else if (hasNestedStructure && topLevelDirs.size === 1) {
                    // ModTemplateFormat: single top-level folder containing game/characters
                    mapper = new ModTemplateFormat();
                } else if (hasGameFolder || hasCharactersFolder) {
                    // ModManagerFormat: has proper folder structure but no mod.json
                    mapper = new ModManagerFormat();
                } else if (topLevelDirs.size === 1 && !hasGameFolder && !hasCharactersFolder) {
                    // NestedGameFolder: single folder that should be treated as game folder
                    mapper = new NestedGameFolder();
                } else if (gameFiles > 0 || characterFiles > 0) {
                    // InstallAppropriateFiles: has game files but no clear structure
                    mapper = new InstallAppropriateFiles();
                } else {
                    // DumpAndHopeForTheBest: last resort
                    mapper = new DumpAndHopeForTheBest();
                }

                // Attach version information to the mapper if available
                if (versionInfo) {
                    mapper.setVersionInfo(versionInfo);
                }

                console.log("Selected mapper:", mapper.getFriendlyName());
                if (versionInfo) {
                    console.log("Mod version info:", RenpyVersionDetector.getVersionDisplayString(versionInfo));
                }
                ff(mapper);
            });

            zipfile.on("error", (err) => {
                console.error("Error reading zip file:", err);
                rj(err);
            });
        });
    });
}

/**
 * Detects Ren'Py version information from zip file contents
 */
async function detectVersionFromZip(zipPath: string, fileList: string[]): Promise<RenpyVersionInfo | null> {
    return new Promise((resolve, reject) => {
        yauzl.open(zipPath, {lazyEntries: true}, async (err, zipfile) => {
            if (err) {
                reject(err);
                return;
            }

            let versionInfo: RenpyVersionInfo | null = null;
            const versionDetectionResults: RenpyVersionInfo[] = [];

            // Track files to check for version information
            const filesToCheck = fileList.filter(fileName => {
                const lower = fileName.toLowerCase();
                return lower.endsWith('.rpy') ||
                       lower.endsWith('.json') ||
                       lower.includes('script.') ||
                       lower.includes('options.') ||
                       lower.includes('gui.') ||
                       lower.includes('mod.json') ||
                       lower.includes('manifest.json');
            });

            let filesProcessed = 0;
            const totalFiles = filesToCheck.length;

            if (totalFiles === 0) {
                // No files to check, use heuristic detection
                try {
                    versionInfo = await detectVersionByHeuristics(fileList);
                    resolve(versionInfo);
                } catch (error) {
                    resolve(null);
                }
                return;
            }

            zipfile.readEntry();
            
            zipfile.on("entry", async (entry) => {
                const fileName = entry.fileName;
                
                if (filesToCheck.includes(fileName)) {
                    try {
                        zipfile.openReadStream(entry, (err, readStream) => {
                            if (err) {
                                filesProcessed++;
                                if (filesProcessed >= totalFiles) {
                                    finalizeBestResult();
                                }
                                zipfile.readEntry();
                                return;
                            }

                            let content = '';
                            readStream.on('data', (chunk) => {
                                content += chunk.toString('utf8');
                            });

                            readStream.on('end', async () => {
                                try {
                                    const detectedVersion = await detectVersionFromContent(fileName, content);
                                    if (detectedVersion) {
                                        versionDetectionResults.push(detectedVersion);
                                    }
                                } catch (error) {
                                    console.warn(`Error detecting version from ${fileName}:`, error.message);
                                }

                                filesProcessed++;
                                if (filesProcessed >= totalFiles) {
                                    finalizeBestResult();
                                } else {
                                    zipfile.readEntry();
                                }
                            });

                            readStream.on('error', (error) => {
                                console.warn(`Error reading ${fileName}:`, error.message);
                                filesProcessed++;
                                if (filesProcessed >= totalFiles) {
                                    finalizeBestResult();
                                } else {
                                    zipfile.readEntry();
                                }
                            });
                        });
                    } catch (error) {
                        console.warn(`Error processing ${fileName}:`, error.message);
                        filesProcessed++;
                        if (filesProcessed >= totalFiles) {
                            finalizeBestResult();
                        } else {
                            zipfile.readEntry();
                        }
                    }
                } else {
                    zipfile.readEntry();
                }
            });

            zipfile.on("end", () => {
                if (filesProcessed >= totalFiles) {
                    finalizeBestResult();
                }
            });

            zipfile.on("error", (error) => {
                reject(error);
            });

            function finalizeBestResult() {
                if (versionDetectionResults.length > 0) {
                    // Sort by confidence and return the best result
                    versionDetectionResults.sort((a, b) => {
                        const confidenceScore = { high: 3, medium: 2, low: 1 };
                        return confidenceScore[b.confidence] - confidenceScore[a.confidence];
                    });
                    versionInfo = versionDetectionResults[0];
                } else {
                    // Fallback to heuristic detection
                    detectVersionByHeuristics(fileList).then(heuristicResult => {
                        versionInfo = heuristicResult;
                        resolve(versionInfo);
                    }).catch(() => {
                        resolve(null);
                    });
                    return;
                }
                resolve(versionInfo);
            }
        });
    });
}

/**
 * Detects version from file content
 */
async function detectVersionFromContent(fileName: string, content: string): Promise<RenpyVersionInfo | null> {
    const VERSION_PATTERNS = {
        script: /version\s*[=:]\s*['"]([\d.]+)['"]/i,
        comment: /#.*Ren'Py\s+(\d+\.\d+(?:\.\d+)?)/i,
        define: /define\s+(?:config\.)?version\s*=\s*['"]([\d.]+)['"]/i,
        metadata: /"version"\s*:\s*"([\d.]+)"/i,
        renpyVersion: /"renpyVersion"\s*:\s*"([\d.]+)"/i
    };

    // Try different patterns based on file type
    if (fileName.toLowerCase().endsWith('.json')) {
        // JSON files - try metadata patterns first
        for (const [patternName, pattern] of Object.entries(VERSION_PATTERNS)) {
            if (patternName.includes('metadata') || patternName.includes('renpyVersion')) {
                const match = content.match(pattern);
                if (match) {
                    return createVersionInfo(match[1], 'manifest', 'high');
                }
            }
        }
    } else if (fileName.toLowerCase().endsWith('.rpy')) {
        // Ren'Py script files
        for (const [patternName, pattern] of Object.entries(VERSION_PATTERNS)) {
            const match = content.match(pattern);
            if (match) {
                const confidence = patternName === 'define' ? 'high' : 'medium';
                return createVersionInfo(match[1], 'script', confidence);
            }
        }
    }

    return null;
}

/**
 * Creates version info object
 */
function createVersionInfo(
    version: string,
    method: 'executable' | 'script' | 'manifest' | 'heuristic',
    confidence: 'high' | 'medium' | 'low'
): RenpyVersionInfo {
    const parts = version.split('.').map(p => parseInt(p) || 0);
    
    return {
        version,
        majorVersion: parts[0] || 0,
        minorVersion: parts[1] || 0,
        patchVersion: parts[2] || 0,
        detectionMethod: method,
        confidence,
        compatibilityNotes: getCompatibilityNotes(parts[0] || 0)
    };
}

/**
 * Gets compatibility notes for a major version
 */
function getCompatibilityNotes(majorVersion: number): string[] {
    const notes: string[] = [];
    
    switch (majorVersion) {
        case 6:
            notes.push('Legacy Ren\'Py version with Python 2.7');
            notes.push('Limited modern feature support');
            break;
        case 7:
            notes.push('Mature Ren\'Py version with good compatibility');
            notes.push('Supports most modern features');
            break;
        case 8:
            notes.push('Latest Ren\'Py version with full Python 3 support');
            notes.push('Best performance and modern features');
            break;
        default:
            notes.push('Unknown or unsupported Ren\'Py version');
    }
    
    return notes;
}

/**
 * Detects version using heuristic analysis of file structure
 */
async function detectVersionByHeuristics(fileList: string[]): Promise<RenpyVersionInfo | null> {
    // Check for Ren'Py 8.x features
    const hasModernFeatures = fileList.some(f =>
        f.includes('tl/') ||
        f.includes('gui.rpy') ||
        f.includes('screens.rpy')
    );
    
    // Check for Ren'Py 7.x features
    const hasGui = fileList.some(f => f.includes('gui.rpy'));
    
    // Check for basic Ren'Py structure
    const hasBasicStructure = fileList.some(f => f.includes('script.rpy'));
    
    if (hasModernFeatures && hasGui) {
        return createVersionInfo('8.0', 'heuristic', 'low');
    } else if (hasGui) {
        return createVersionInfo('7.0', 'heuristic', 'low');
    } else if (hasBasicStructure) {
        return createVersionInfo('6.99', 'heuristic', 'low');
    }
    
    return null;
}
