import * as yauzl from "yauzl";
import {ModMapper} from "./ModMapper";
import ModManagerFormat from "./mappers/ModManagerFormat";
import NestedGameFolder from "./mappers/NestedGameFolder";
import ModTemplateFormat from "./mappers/ModTemplateFormat";
import InstallAppropriateFiles from "./mappers/InstallAppropriateFiles";
import DumpAndHopeForTheBest from "./mappers/DumpAndHopeForTheBest";
import MacOSAutorunFormat from "./mappers/MacOSAutorunFormat";

/*
    This script is intended to take any zip file and try and determine how DDMM should install it, if it is a mod.
    There's so many different ways mods are packaged, so this won't cover every scenario, but DDMM will allow the user
    to install a mod manually if this fails.
 */

/*
    Looks at the file structure of the zip file and attempts to determine what the format of the mod is.
 */
export function inferMapper(zipPath: string): Promise<ModMapper> {
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

            zipfile.on("end", () => {
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

                console.log("Selected mapper:", mapper.getFriendlyName());
                ff(mapper);
            });

            zipfile.on("error", (err) => {
                console.error("Error reading zip file:", err);
                rj(err);
            });
        });
    });
}
