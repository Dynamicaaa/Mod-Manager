import * as yauzl from "yauzl";
import {createWriteStream, unlinkSync, removeSync, readFileSync, writeFileSync} from "fs-extra";
import {mkdirsSync} from "fs-extra";
import {join as joinPath, sep as pathSep} from "path";
import {inferMapper} from "./ModNormaliser";
import ArchiveConverter from "../archive/ArchiveConverter";
import {app} from "electron";
import {randomBytes} from "crypto";

export default class ModInstaller {

    /**
     * Installs a mod into a copy of DDLC by guessing which files should go where
     * @param modPath The path to the mod
     * @param installPath The path to the game installation
     */
    public static installMod(modPath: string, installPath: string): Promise<null> {
        if (modPath.endsWith(".zip")) {
            return ModInstaller.installZip(modPath, installPath);
        } else if (ModInstaller.isArchive(modPath)) {
            return new Promise((ff, rj) => {
                const tempZipPath: string = joinPath(app.getPath("temp"), "ddmm" + randomBytes(8).toString("hex") + ".zip");
                ArchiveConverter.convertToZip(modPath, tempZipPath).then(() => {
                    ModInstaller.installZip(tempZipPath, installPath).then(() => {
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

    private static installZip(modPath: string, installPath: string): Promise<null> {
        return new Promise((ff, rj) => {
            // flag to prevent reading more than one metadata file
            let hasReadMetadata: boolean = false;

            // determine how we should deal with files
            console.log("Preparing to install mod from " + modPath);
            inferMapper(modPath).then((mapper) => {
                // delete files that need to be removed (e.g. with DDLCtVN)
                for (const file of mapper.getFilesToDelete()) {
                    console.log("Deleting " + file);
                    try {
                        unlinkSync(joinPath(installPath, "game", file));
                    } catch (e) {
                        console.warn("Could not delete file " + file + ":", e.message);
                    }
                }

                console.log("Installing with mapper: " + mapper.getFriendlyName());

                // Extract the zip file using yauzl
                yauzl.open(modPath, {lazyEntries: true}, (err, zipfile) => {
                    if (err) {
                        console.error("Failed to open mod zip file:", err);
                        rj(err);
                        return;
                    }

                    let entriesProcessed = 0;
                    let totalEntries = 0;

                    // First pass: count total entries (files and directories)
                    zipfile.readEntry();
                    zipfile.on("entry", (entry) => {
                        totalEntries++;
                        zipfile.readEntry();
                    });

                    zipfile.on("end", () => {
                        console.log("Total entries to process:", totalEntries);

                        // Second pass: extract files
                        yauzl.open(modPath, {lazyEntries: true}, (err, zipfile2) => {
                            if (err) {
                                console.error("Failed to reopen mod zip file:", err);
                                rj(err);
                                return;
                            }

                            const processNextEntry = () => {
                                zipfile2.readEntry();
                            };

                            zipfile2.readEntry();
                            zipfile2.on("entry", (entry) => {
                                const fileName = entry.fileName;
                                entriesProcessed++;

                                if (/\/$/.test(fileName)) {
                                    // Directory entry - skip
                                    console.log("Skipping directory:", fileName);
                                    if (entriesProcessed >= totalEntries) {
                                        console.log("Mod installation completed successfully");
                                        ff(undefined);
                                    } else {
                                        processNextEntry();
                                    }
                                    return;
                                }

                                // Use mapper to determine where this file should go
                                const mappedPath = mapper.mapFile(fileName);

                                if (mappedPath === null) {
                                    // Mapper says to ignore this file
                                    console.log("Ignoring file:", fileName);
                                    if (entriesProcessed >= totalEntries) {
                                        console.log("Mod installation completed successfully");
                                        ff(undefined);
                                    } else {
                                        processNextEntry();
                                    }
                                    return;
                                }

                                const outputPath = joinPath(installPath, mappedPath);
                                console.log("Extracting:", fileName, "->", mappedPath);

                                // Ensure directory exists
                                const outputDir = outputPath.split(pathSep).slice(0, -1).join(pathSep);
                                try {
                                    mkdirsSync(outputDir);
                                } catch (e) {
                                    console.warn("Could not create directory " + outputDir + ":", e.message);
                                }

                                // Extract the file
                                zipfile2.openReadStream(entry, (err, readStream) => {
                                    if (err) {
                                        console.error("Failed to open read stream for " + fileName + ":", err);
                                        rj(err);
                                        return;
                                    }

                                    const writeStream = createWriteStream(outputPath);
                                    readStream.pipe(writeStream);

                                    writeStream.on('close', () => {
                                        console.log(`Progress: ${entriesProcessed}/${totalEntries} entries processed`);

                                        if (entriesProcessed >= totalEntries) {
                                            console.log("Mod installation completed successfully");
                                            ff(undefined);
                                        } else {
                                            processNextEntry();
                                        }
                                    });

                                    writeStream.on('error', (err) => {
                                        console.error("Failed to write file " + outputPath + ":", err);
                                        rj(err);
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
        return ["zip", "rar", "7z"].filter(ext => filename.endsWith("." + ext)).length > 0;
    }
}