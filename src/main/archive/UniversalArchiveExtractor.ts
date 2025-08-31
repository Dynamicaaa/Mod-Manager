import { extname, join as joinPath, basename } from "path";
import { createReadStream, createWriteStream, mkdirSync, existsSync } from "fs";
import { mkdirsSync } from "fs-extra";
import * as mime from "mime-types";
import * as tar from "tar";
import * as yauzl from "yauzl";
import { UnsupportedArchiveError, ExtractionError } from "../errors/ModInstallationError";
import {InputValidator} from "../utils/InputValidator";
import {SafeFileOperations} from "../utils/SafeFileOperations";

const Seven = require("node-7z");

/**
 * Universal archive extractor supporting multiple archive formats
 * Provides unified interface for extracting .zip, .rar, .7z, .tar, .tar.gz, .tar.bz2, etc.
 */
export class UniversalArchiveExtractor {
    private static readonly SUPPORTED_FORMATS = [
        ".zip",
        ".rar", 
        ".7z",
        ".tar",
        ".tar.gz",
        ".tgz",
        ".tar.bz2",
        ".tar.xz",
        ".tar.Z"
    ];

    /**
     * Detects the archive format based on file extension and MIME type
     * @param filePath Path to the archive file
     * @returns The detected format string
     */
    public static async detectFormat(filePath: string): Promise<string> {
        const fileName = basename(filePath).toLowerCase();
        
        // Check for compound extensions first (.tar.gz, .tar.bz2, etc.)
        if (fileName.endsWith(".tar.gz") || fileName.endsWith(".tgz")) {
            return "tar.gz";
        }
        if (fileName.endsWith(".tar.bz2")) {
            return "tar.bz2";
        }
        if (fileName.endsWith(".tar.xz")) {
            return "tar.xz";
        }
        if (fileName.endsWith(".tar.z")) {
            return "tar.Z";
        }
        
        // Check simple extensions
        const ext = extname(fileName);
        switch (ext) {
            case ".zip":
                return "zip";
            case ".rar":
                return "rar";
            case ".7z":
                return "7z";
            case ".tar":
                return "tar";
            default:
                // Fallback to MIME type detection
                const mimeType = mime.lookup(filePath);
                if (mimeType) {
                    if (mimeType.includes("zip")) return "zip";
                    if (mimeType.includes("rar")) return "rar";
                    if (mimeType.includes("7z")) return "7z";
                    if (mimeType.includes("tar")) return "tar";
                }
                throw new UnsupportedArchiveError(filePath);
        }
    }

    /**
     * Extracts an archive to the specified output directory
     * @param archivePath Path to the archive file
     * @param outputPath Directory to extract files to
     */
    public static async extract(archivePath: string, outputPath: string): Promise<void> {
        // Validate input parameters before extraction
        const archiveValidation = InputValidator.validateFilePath(archivePath, {
            requireExists: true,
            allowedExtensions: this.SUPPORTED_FORMATS,
            maxFileSize: 2 * 1024 * 1024 * 1024 // 2GB limit
        });
        
        if (!archiveValidation.isValid) {
            throw new UnsupportedArchiveError(archivePath,
                `Archive validation failed: ${archiveValidation.errors.join(', ')}`);
        }
        
        const outputValidation = InputValidator.validateDirectoryPath(outputPath, {
            mustBeWritable: true,
            allowRelative: false,
            maxLength: 260
        });
        
        if (!outputValidation.isValid) {
            throw new ExtractionError(archivePath,
                new Error(`Output path validation failed: ${outputValidation.errors.join(', ')}`));
        }
        
        // Use sanitized paths
        const sanitizedArchivePath = archiveValidation.sanitized;
        const sanitizedOutputPath = outputValidation.sanitized;
        
        const format = await this.detectFormat(sanitizedArchivePath);
        
        // Ensure output directory exists safely
        try {
            await SafeFileOperations.ensureDirectoryExists(sanitizedOutputPath);
        } catch (error) {
            throw new ExtractionError(archivePath,
                new Error(`Failed to create output directory: ${error.message}`));
        }

        console.log(`Extracting ${format} archive: ${sanitizedArchivePath} to ${sanitizedOutputPath}`);

        switch (format) {
            case "zip":
                return this.extractZip(sanitizedArchivePath, sanitizedOutputPath);
            case "rar":
                return this.extractRar(sanitizedArchivePath, sanitizedOutputPath);
            case "7z":
                return this.extract7z(sanitizedArchivePath, sanitizedOutputPath);
            case "tar":
                return this.extractTar(sanitizedArchivePath, sanitizedOutputPath);
            case "tar.gz":
            case "tar.bz2":
            case "tar.xz":
            case "tar.Z":
                return this.extractCompressedTar(sanitizedArchivePath, sanitizedOutputPath, format);
            default:
                throw new UnsupportedArchiveError(sanitizedArchivePath, format);
        }
    }

    /**
     * Returns the list of supported archive formats
     */
    public static getSupportedFormats(): string[] {
        return [...this.SUPPORTED_FORMATS];
    }

    /**
     * Checks if a file is a supported archive format
     * @param filename The filename to check
     */
    public static isSupportedArchive(filename: string): boolean {
        const lowerFilename = filename.toLowerCase();
        return this.SUPPORTED_FORMATS.some(ext => lowerFilename.endsWith(ext));
    }

    private static extractZip(archivePath: string, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            yauzl.open(archivePath, { lazyEntries: true }, (err, zipfile) => {
                if (err) return reject(new ExtractionError(archivePath, err));

                zipfile.readEntry();
                zipfile.on("entry", (entry) => {
                    if (/\/$/.test(entry.fileName)) {
                        // Directory entry
                        zipfile.readEntry();
                    } else {
                        // File entry - validate the file path for security
                        const fileValidation = InputValidator.validateFilePath(entry.fileName, {
                            restrictToBasePath: outputPath,
                            allowExecutables: false,
                            maxFileSize: 100 * 1024 * 1024 // 100MB per file
                        });
                        
                        if (!fileValidation.isValid) {
                            console.warn(`Skipping file with invalid path: ${entry.fileName}. Errors: ${fileValidation.errors.join(', ')}`);
                            zipfile.readEntry();
                            return;
                        }
                        
                        const sanitizedFileName = fileValidation.sanitized;
                        const outputFilePath = joinPath(outputPath, sanitizedFileName);
                        const outputDir = joinPath(outputPath, sanitizedFileName.split('/').slice(0, -1).join('/'));
                        
                        // Use Promise-based directory creation with fallback
                        SafeFileOperations.ensureDirectoryExists(outputDir).catch(dirError => {
                            console.warn(`Failed to create directory ${outputDir}:`, dirError);
                            // Fallback to original method
                            if (!existsSync(outputDir)) {
                                mkdirsSync(outputDir);
                            }
                        });

                        zipfile.openReadStream(entry, (err, readStream) => {
                            if (err) return reject(new ExtractionError(archivePath, err));
                            
                            const writeStream = createWriteStream(outputFilePath);
                            readStream.pipe(writeStream);
                            
                            writeStream.on("finish", () => {
                                zipfile.readEntry();
                            });
                            
                            writeStream.on("error", (err) => reject(new ExtractionError(archivePath, err)));
                        });
                    }
                });

                zipfile.on("end", () => {
                    console.log("ZIP extraction completed");
                    resolve();
                });

                zipfile.on("error", (err) => reject(new ExtractionError(archivePath, err)));
            });
        });
    }

    private static extractRar(archivePath: string, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const unrar = require("unrar");
                const archive = new unrar.Archive(archivePath);
                
                archive.extract(outputPath, (err) => {
                    if (err) {
                        reject(new Error(`RAR extraction failed: ${err.message}`));
                    } else {
                        console.log("RAR extraction completed");
                        resolve();
                    }
                });
            } catch (error) {
                reject(new Error(`RAR extraction failed: ${error.message}`));
            }
        });
    }

    private static extract7z(archivePath: string, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const extractStream = Seven.extractFull(archivePath, outputPath, {
                    $progress: true,
                    recursive: true
                });

                extractStream.on("data", (data) => {
                    console.log(`7z extraction progress: ${data.file}`);
                });

                extractStream.on("end", () => {
                    console.log("7z extraction completed");
                    resolve();
                });

                extractStream.on("error", (err) => {
                    reject(new ExtractionError(archivePath, err));
                });
            } catch (error) {
                reject(new ExtractionError(archivePath, error));
            }
        });
    }

    private static extractTar(archivePath: string, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                tar.extract({
                    file: archivePath,
                    cwd: outputPath,
                    strip: 0,
                    preservePaths: false
                }).then(() => {
                    console.log("TAR extraction completed");
                    resolve();
                }).catch((err) => {
                    reject(new ExtractionError(archivePath, err));
                });
            } catch (error) {
                reject(new ExtractionError(archivePath, error));
            }
        });
    }

    private static extractCompressedTar(archivePath: string, outputPath: string, format: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const extractOptions = {
                    file: archivePath,
                    cwd: outputPath,
                    strip: 0,
                    preservePaths: false
                };

                tar.extract(extractOptions).then(() => {
                    console.log(`${format.toUpperCase()} extraction completed`);
                    resolve();
                }).catch((err) => {
                    reject(new ExtractionError(archivePath, err));
                });
            } catch (error) {
                reject(new ExtractionError(archivePath, error));
            }
        });
    }
}