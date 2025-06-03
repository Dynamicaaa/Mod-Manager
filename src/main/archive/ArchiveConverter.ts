import {mkdtempSync, removeSync, createWriteStream, mkdirsSync} from "fs-extra";
import {join as joinPath, extname, dirname} from "path";
import {app} from "electron";
import * as StreamZip from "node-stream-zip";
import * as tar from "tar";
import * as archiver from "archiver";
import {createReadStream} from "fs";

export default class ArchiveConverter {

    public static convertToZip(pathToArchive: string, output: string) {
        return new Promise((ff, rj) => {
            const tempDir: string = mkdtempSync(joinPath(app.getPath("temp"), "ddmm-archive"));
            const fileExt = extname(pathToArchive).toLowerCase();

            console.log("Converting " + pathToArchive + " to " + output);

            // Extract based on file type
            let extractPromise: Promise<void>;

            if (fileExt === '.rar') {
                extractPromise = ArchiveConverter.extractRar(pathToArchive, tempDir);
            } else if (fileExt === '.7z') {
                extractPromise = ArchiveConverter.extract7z(pathToArchive, tempDir);
            } else if (ArchiveConverter.isTarFormat(pathToArchive)) {
                extractPromise = ArchiveConverter.extractTar(pathToArchive, tempDir);
            } else {
                // Default to zip/general extraction using StreamZip
                extractPromise = ArchiveConverter.extractZip(pathToArchive, tempDir);
            }

            extractPromise.then(() => {
                // Create zip from extracted files
                ArchiveConverter.createZip(tempDir, output).then(() => {
                    // Clean up temp directory
                    removeSync(tempDir);
                    ff(undefined);
                }).catch(rj);
            }).catch(rj);
        });
    }

    private static isTarFormat(pathToArchive: string): boolean {
        const filename = pathToArchive.toLowerCase();
        return filename.endsWith('.tar') || 
               filename.endsWith('.tar.gz') || 
               filename.endsWith('.tgz') ||
               filename.endsWith('.tar.bz2') ||
               filename.endsWith('.tar.xz') ||
               filename.endsWith('.tar.Z');
    }

    private static extractRar(pathToArchive: string, tempDir: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // Try to use node-rar if available, otherwise try unrar command line tool
            try {
                const rar = require('node-rar');
                const archive = rar.createReadStream(pathToArchive);
                let entriesProcessed = 0;
                let totalEntries = 0;
                
                // First pass to count entries
                archive.on('entry', () => {
                    totalEntries++;
                });
                
                archive.on('end', () => {
                    // Second pass to extract
                    const extractArchive = rar.createReadStream(pathToArchive);
                    
                    extractArchive.on('entry', (entry: any) => {
                        if (entry.type === 'File') {
                            const outputPath = joinPath(tempDir, entry.name);
                            const outputDir = dirname(outputPath);
                            
                            // Ensure directory exists
                            mkdirsSync(outputDir);
                            
                            const writeStream = createWriteStream(outputPath);
                            entry.pipe(writeStream);
                            
                            writeStream.on('close', () => {
                                entriesProcessed++;
                                if (entriesProcessed >= totalEntries) {
                                    resolve();
                                }
                            });
                            
                            writeStream.on('error', reject);
                        } else {
                            entriesProcessed++;
                            if (entriesProcessed >= totalEntries) {
                                resolve();
                            }
                        }
                    });
                    
                    extractArchive.on('error', reject);
                });
                
                archive.on('error', reject);
            } catch (error) {
                // Fallback: Try using command line unrar if available
                const { spawn } = require('child_process');
                const unrar = spawn('unrar', ['x', '-y', pathToArchive, tempDir + '/']);
                
                unrar.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`RAR extraction failed. Please install unrar or convert the RAR file to ZIP format. Error code: ${code}`));
                    }
                });
                
                unrar.on('error', () => {
                    reject(new Error('RAR extraction failed. RAR support requires additional dependencies. Please convert the RAR file to ZIP, 7Z, or TAR format.'));
                });
            }
        });
    }

    private static extract7z(pathToArchive: string, tempDir: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const zip = new StreamZip.async({file: pathToArchive});
                zip.extract(null, tempDir).then(() => {
                    zip.close();
                    resolve();
                }).catch((error) => {
                    zip.close();
                    reject(new Error(`7z extraction failed: ${error.message}`));
                });
            } catch (error) {
                reject(new Error(`7z extraction failed: ${error.message}`));
            }
        });
    }

    private static extractTar(pathToArchive: string, tempDir: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                tar.x({
                    file: pathToArchive,
                    cwd: tempDir,
                    preservePaths: false,
                    onentry: (entry) => {
                        console.log('Extracting:', entry.path);
                    }
                }).then(() => {
                    resolve();
                }).catch((error) => {
                    reject(new Error(`TAR extraction failed: ${error.message}`));
                });
            } catch (error) {
                reject(new Error(`TAR extraction failed: ${error.message}`));
            }
        });
    }

    private static extractZip(pathToArchive: string, tempDir: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const zip = new StreamZip.async({file: pathToArchive});
                zip.extract(null, tempDir).then(() => {
                    zip.close();
                    resolve();
                }).catch((error) => {
                    zip.close();
                    reject(new Error(`ZIP extraction failed: ${error.message}`));
                });
            } catch (error) {
                reject(new Error(`ZIP extraction failed: ${error.message}`));
            }
        });
    }

    private static createZip(sourceDir: string, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const output = createWriteStream(outputPath);
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