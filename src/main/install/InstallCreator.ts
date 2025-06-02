import * as yauzl from "yauzl";
import * as chmodr from "chmodr";
import {createWriteStream, writeFileSync, existsSync, accessSync, constants} from "fs";
import {mkdirsSync} from "fs-extra";
import {join as joinPath, sep as pathSep} from "path";
import Config from "../utils/Config";

export default class InstallCreator {

    /**
     * Ensures DDLC.sh is executable on Linux systems
     * @param installPath The path to the install directory
     * @returns Promise that resolves with success status and error message if any
     */
    private static ensureDDLCExecutable(installPath: string): Promise<{success: boolean, error?: string}> {
        return new Promise((resolve) => {
            if (process.platform !== "linux") {
                resolve({success: true});
                return;
            }

            const ddlcShPath = joinPath(installPath, "DDLC.sh");

            if (!existsSync(ddlcShPath)) {
                resolve({success: false, error: "DDLC.sh not found"});
                return;
            }

            try {
                // Check if file is already executable
                accessSync(ddlcShPath, constants.F_OK | constants.X_OK);
                resolve({success: true});
            } catch (e) {
                // File is not executable, try to make it executable
                chmodr(ddlcShPath, 0o755, (err) => {
                    if (err) {
                        console.error("Failed to make DDLC.sh executable:", err);
                        resolve({success: false, error: err.toString()});
                    } else {
                        console.log("Successfully made DDLC.sh executable");
                        resolve({success: true});
                    }
                });
            }
        });
    }

    /**
     * Creates a install of vanilla DDLC
     * @param folderName The folder name to store the install in
     * @param installName The user facing name of the install
     * @param globalSave Whether it should use the global save
     */
    public static createInstall(folderName: string, installName: string, globalSave: boolean): Promise<null> {
        return new Promise((ff, rj) => {
            console.log("Creating clean install in " + folderName);
            const canonicalPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);

            try {
                // create the install and appdata directories
                mkdirsSync(joinPath(canonicalPath, "appdata"));
                mkdirsSync(joinPath(canonicalPath, "install"));

                if (process.platform === "win32") {
                    mkdirsSync(joinPath(canonicalPath, "appdata", "RenPy"));
                } else if (process.platform === "darwin") {
                    mkdirsSync(joinPath(canonicalPath, "appdata", "Library", "RenPy"));
                    // Create autorun directory for macOS mod support
                    mkdirsSync(joinPath(canonicalPath, "install", "game", "autorun"));
                } else {
                    mkdirsSync(joinPath(canonicalPath, "appdata", ".renpy"));
                }

                // Extract DDLC zip file to install directory
                const ddlcZipPath = joinPath(Config.readConfigValue("installFolder"), "ddlc.zip");
                console.log("Extracting DDLC from:", ddlcZipPath);

                yauzl.open(ddlcZipPath, {lazyEntries: true}, (err, zipfile) => {
                    if (err) {
                        console.error("Failed to open DDLC zip file:", err);
                        rj(err);
                        return;
                    }

                    let topLevelDir: string = null;

                    zipfile.readEntry();
                    zipfile.on("entry", (entry) => {
                        // Detect and strip the top-level directory (e.g., "DDLC-1.1.1-pc/")
                        if (!topLevelDir) {
                            const firstSlash = entry.fileName.indexOf("/");
                            if (firstSlash > 0) {
                                topLevelDir = entry.fileName.substring(0, firstSlash + 1);
                                console.log("Detected top-level directory in zip:", topLevelDir);
                            }
                        }

                        // Strip the top-level directory from the path
                        let relativePath = entry.fileName;
                        if (topLevelDir && relativePath.startsWith(topLevelDir)) {
                            relativePath = relativePath.substring(topLevelDir.length);
                        }

                        // Skip empty paths (top-level directory itself)
                        if (!relativePath) {
                            zipfile.readEntry();
                            return;
                        }

                        if (/\/$/.test(entry.fileName)) {
                            // Directory entry
                            mkdirsSync(joinPath(canonicalPath, "install", relativePath));
                            zipfile.readEntry();
                        } else {
                            // File entry
                            const pathParts = relativePath.split("/");
                            const fileName = pathParts.pop();
                            const dirPath = joinPath(canonicalPath, "install", pathParts.join(pathSep));

                            mkdirsSync(dirPath);

                            zipfile.openReadStream(entry, (err, readStream) => {
                                if (err) {
                                    rj(err);
                                    return;
                                }

                                const writeStream = createWriteStream(joinPath(dirPath, fileName));
                                readStream.pipe(writeStream);

                                writeStream.on('close', () => {
                                    // Make shell scripts and binary files executable on Unix systems
                                    const shouldMakeExecutable = process.platform !== "win32" && (
                                        fileName.endsWith(".sh") ||
                                        fileName === "DDLC" ||
                                        fileName === "python" ||
                                        fileName === "pythonw" ||
                                        (relativePath.includes("lib/linux-x86_64/") &&
                                         (fileName === "zsync" || fileName === "zsyncmake")) ||
                                        // macOS specific executables
                                        (process.platform === "darwin" && (
                                            relativePath.includes("MacOS/") ||
                                            relativePath.includes(".app/Contents/MacOS/") ||
                                            fileName === "DDLC" ||
                                            fileName.endsWith(".dylib") ||
                                            fileName.endsWith(".so")
                                        ))
                                    );

                                    if (shouldMakeExecutable) {
                                        const filePath = joinPath(dirPath, fileName);
                                        chmodr(filePath, 0o755, (err) => {
                                            if (err) {
                                                console.warn("Failed to make file executable:", err);
                                            }
                                            zipfile.readEntry();
                                        });
                                    } else {
                                        zipfile.readEntry();
                                    }
                                });

                                writeStream.on('error', rj);
                            });
                        }
                    });

                    zipfile.on("end", () => {
                        console.log("DDLC extraction completed successfully");

                        // Ensure autorun directory exists for macOS mod support
                        if (process.platform === "darwin") {
                            mkdirsSync(joinPath(canonicalPath, "install", "game", "autorun"));
                            console.log("Created autorun directory for macOS mod support");
                        }

                        // write the install data file
                        writeFileSync(joinPath(canonicalPath, "install.json"), JSON.stringify({
                            globalSave,
                            mod: null,
                            name: installName,
                        }));

                        // Ensure DDLC.sh is executable on Linux
                        this.ensureDDLCExecutable(joinPath(canonicalPath, "install")).then((result) => {
                            if (!result.success) {
                                console.warn("Warning: Could not make DDLC.sh executable:", result.error);
                                // We don't reject here because the install was created successfully,
                                // but we log the warning for potential runtime issues
                            }
                            ff(undefined);
                        }).catch((error) => {
                            console.warn("Warning: Error checking DDLC.sh executable status:", error);
                            // Still resolve successfully as the install was created
                            ff(undefined);
                        });
                    });

                    zipfile.on("error", rj);
                });
            } catch (e) {
                rj(e);
            }
        });
    }
}
