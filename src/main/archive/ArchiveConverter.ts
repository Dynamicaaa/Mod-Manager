import { mkdtempSync, removeSync } from "fs-extra";
import { join as joinPath, extname } from "path";
import { app } from "electron";
import * as archiver from "archiver";

export default class ArchiveConverter {

    public static convertToZip(pathToArchive: string, output: string) {
        return new Promise((ff, rj) => {
            const tempDir: string = mkdtempSync(joinPath(app.getPath("temp"), "ddmm-archive"));

            console.log("Converting " + pathToArchive + " to " + output);

            // Use yauzl to extract zip files
            const yauzl = require("yauzl");
            const fs = require("fs");
            const path = require("path");

            yauzl.open(pathToArchive, { lazyEntries: true }, (err: any, zipfile: any) => {
                if (err) return rj(err);

                // First, collect all file entry paths to determine common root
                const entryPaths: string[] = [];
                const entries: any[] = [];

                zipfile.on("entry", (entry: any) => {
                    if (/\/$/.test(entry.fileName)) {
                        // Directory entry, skip
                        zipfile.readEntry();
                    } else {
                        entryPaths.push(entry.fileName);
                        entries.push(entry);
                        zipfile.readEntry();
                    }
                });

                zipfile.on("end", () => {
                    // Determine if all files share a single top-level directory
                    let commonRoot: string | null = null;
                    if (entryPaths.length > 0) {
                        const first = entryPaths[0].split('/')[0];
                        if (entryPaths.every(p => p.startsWith(first + '/'))) {
                            commonRoot = first;
                        }
                    }

                    // Re-open the archive to actually extract files
                    yauzl.open(pathToArchive, { lazyEntries: true }, (err2: any, zipfile2: any) => {
                        if (err2) return rj(err2);
                        zipfile2.readEntry();
                        zipfile2.on("entry", (entry: any) => {
                            if (/\/$/.test(entry.fileName)) {
                                zipfile2.readEntry();
                            } else {
                                let outPath;
                                let relPath = entry.fileName;
                                if (commonRoot && relPath.startsWith(commonRoot + '/')) {
                                    relPath = relPath.substring(commonRoot.length + 1);
                                }
                                outPath = path.join(tempDir, relPath);
                                fs.mkdirSync(path.dirname(outPath), { recursive: true });
                                zipfile2.openReadStream(entry, (err: any, readStream: any) => {
                                    if (err) return rj(err);
                                    const writeStream = fs.createWriteStream(outPath);
                                    readStream.pipe(writeStream);
                                    writeStream.on("finish", () => {
                                        zipfile2.readEntry();
                                    });
                                });
                            }
                        });
                        zipfile2.on("end", () => {
                            // Create zip from extracted files
                            ArchiveConverter.createZip(tempDir, output).then(() => {
                                // Clean up temp directory
                                removeSync(tempDir);
                                ff(undefined);
                            }).catch(rj);
                        });
                        zipfile2.on("error", rj);
                    });
                });

                zipfile.on("error", rj);
                zipfile.readEntry();
            });
        });
    }
    
    private static createZip(sourceDir: string, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const output = require("fs").createWriteStream(outputPath);
                const archive = archiver('zip', {
                    zlib: { level: 9 } // Sets the compression level
                });

                output.on('close', () => {
                    console.log('Archive created: ' + archive.pointer() + ' total bytes');
                    resolve();
                });

                output.on('error', reject);
                archive.on('error', reject);

                archive.pipe(output);
                archive.directory(sourceDir, false);
                archive.finalize();
            } catch (error) {
                reject(new Error(`ZIP creation failed: ${error.message}`));
            }
        });
    }
}