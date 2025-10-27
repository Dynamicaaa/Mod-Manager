import {remove, emptyDir, mkdirsSync} from "fs-extra";
import {join as joinPath, sep as pathSep} from "path";
import Config from "../utils/Config";
import {CrossPlatformPathResolver} from "../utils/CrossPlatformPathResolver";
import {existsSync, readFileSync, writeFileSync} from "fs";
import * as Archiver from "archiver";
import * as StreamZip from "node-stream-zip";
import {createWriteStream, createReadStream} from "fs";
import { AdvancedBackupManager, BackupMetadata } from "../backup/BackupManager";
import { randomBytes } from "crypto";
import ModInstaller, { RenpyDecompileOptions } from "../mod/ModInstaller";
import { InstallationProgressManager } from "../progress/InstallationProgressManager";

export default class InstallManager {

    /**
     * Returns whether or not the given install exists (or there is a file/folder with that name)
     * @param folderName The folder/file to check
     */
    public static installExists(folderName: string): boolean {
        return existsSync(joinPath(Config.readConfigValue("installFolder"), "installs", folderName));
    }

    /**
     * Rename an install
     * @param folderName The folder containing the install
     * @param newName The new name for the install
     */
    public static renameInstall(folderName: string, newName: string): Promise<null> {
        return new Promise((ff, rj) => {
            const installDataPath: string = joinPath(Config.readConfigValue("installFolder"), "installs", folderName, "install", "install.json");
            if (existsSync(installDataPath)) {
                const data: any = JSON.parse(readFileSync(installDataPath, "utf8"));
                data.name = newName;
                writeFileSync(installDataPath, JSON.stringify(data));
                ff(undefined);
            } else {
                rj();
            }
        });
    }

    /**
     * Deletes an install of the game, including save files.
     * @param folderName The folder containing the install
     * @param createBackup Whether to create a backup before deletion
     */
    public static deleteInstall(folderName: string, createBackup: boolean = true): Promise<void> {
        return new Promise(async (ff, rj) => {
            const dirPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            if (existsSync(dirPath)) {
                try {
                    // Create automatic backup before deletion if requested
                    if (createBackup) {
                        await AdvancedBackupManager.createAutomaticBackup(
                            dirPath,
                            `Backup before deleting install: ${folderName}`
                        );
                        console.log(`Created backup before deleting install: ${folderName}`);
                    }
                    
                    await remove(dirPath);
                    ff(undefined);
                } catch (error) {
                    rj(error);
                }
            } else {
                rj(new Error("Install does not exist."))
            }
        });
    }

    /**
     * Deletes the save file of an install.
     * @param folderName The folder containing the install
     */
    public static deleteSaveData(folderName: string): Promise<void> {
        return new Promise((ff, rj) => {
            const installPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName, "install");
            if (existsSync(installPath)) {
                // Use CrossPlatformPathResolver to get the correct save data path
                const saveDataPath = CrossPlatformPathResolver.resolveSaveDataPath(installPath);
                
                // Also clear platform-specific appdata locations
                const promises = [];
                
                if (process.platform === "win32") {
                    const appdataPath = joinPath(installPath, "..", "appdata");
                    if (existsSync(appdataPath)) {
                        promises.push(emptyDir(appdataPath));
                    }
                } else if (process.platform === "darwin") {
                    const appdataPath = joinPath(installPath, "..", "appdata", "Library", "RenPy");
                    if (existsSync(appdataPath)) {
                        promises.push(emptyDir(appdataPath));
                    }
                } else {
                    const appdataPath = joinPath(installPath, "..", "appdata", ".renpy");
                    if (existsSync(appdataPath)) {
                        promises.push(emptyDir(appdataPath));
                    }
                }
                
                // Clear the game's save directory if it exists
                if (existsSync(saveDataPath)) {
                    promises.push(emptyDir(saveDataPath));
                }
                
                if (promises.length > 0) {
                    Promise.all(promises).then(() => ff(undefined)).catch(rj);
                } else {
                    ff(undefined);
                }
            } else {
                rj(new Error("Install does not exist."))
            }
        });
    }

    /**
     * Backup an install to a zip file
     * @param folderName The folder containing the install
     * @param outPath The output zip file path
     */
    public static backupInstall(folderName: string, outPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const dirPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            if (!existsSync(dirPath)) return reject(new Error("Install does not exist."));
            
            // Use CrossPlatformPathResolver to determine the backup location if outPath is relative
            const finalOutPath = outPath.startsWith('/') || outPath.includes(':') ?
                outPath :
                CrossPlatformPathResolver.resolveBackupPath(dirPath, outPath);
            
            const output = createWriteStream(finalOutPath);
            const archive = Archiver("zip", { zlib: { level: 9 } });
            output.on("close", () => resolve());
            archive.on("error", err => reject(err));
            archive.pipe(output);
            archive.directory(dirPath, false);
            archive.finalize();
        });
    }

    /**
     * Restore an install from a zip file
     * @param zipPath The zip file path
     * @param folderName The folder to restore to (will be overwritten)
     */
    public static restoreInstall(zipPath: string, folderName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const destPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            // Remove existing folder if present
            remove(destPath).then(async () => {
                const zip = new StreamZip.async({ file: zipPath });
                try {
                    const entries = await zip.entries();
                    for (const entryName in entries) {
                        const entry = entries[entryName];
                        // Always split entryName by '/' to preserve zip structure
                        const entryPath = joinPath(destPath, ...entryName.split("/"));
                        if (entry.isDirectory) {
                            mkdirsSync(entryPath);
                        } else {
                            // Ensure directory exists
                            const dirPath = entryPath.split(pathSep).slice(0, -1).join(pathSep);
                            mkdirsSync(dirPath);
                            await zip.extract(entryName, entryPath);
                        }
                    }
                    await zip.close();
                    resolve();
                } catch (err) {
                    await zip.close();
                    reject(err);
                }
            }).catch(reject);
        });
    }

    /**
     * Creates an automatic backup for an install before mod operations
     * @param folderName The folder containing the install
     * @param description Optional description for the backup
     */
    public static createPreModBackup(folderName: string, description?: string): Promise<BackupMetadata> {
        return new Promise(async (resolve, reject) => {
            const dirPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            if (!existsSync(dirPath)) {
                reject(new Error("Install does not exist."));
                return;
            }

            try {
                const backup = await AdvancedBackupManager.createAutomaticBackup(
                    dirPath,
                    description || `Pre-mod installation backup for ${folderName}`
                );
                resolve(backup);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Creates a manual backup for an install
     * @param folderName The folder containing the install
     * @param backupName Name for the backup
     * @param description Optional description for the backup
     */
    public static createManualBackup(folderName: string, backupName: string, description?: string): Promise<BackupMetadata> {
        return new Promise(async (resolve, reject) => {
            const dirPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            if (!existsSync(dirPath)) {
                reject(new Error("Install does not exist."));
                return;
            }

            try {
                const backup = await AdvancedBackupManager.createManualBackup(
                    dirPath,
                    backupName,
                    description
                );
                resolve(backup);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Restores an install from a backup
     * @param backupId The ID of the backup to restore
     * @param folderName Optional target folder name (defaults to original)
     */
    public static restoreFromBackup(backupId: string, folderName?: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const backups = await AdvancedBackupManager.listBackups();
                const backup = backups.find(b => b.id === backupId);
                
                if (!backup) {
                    reject(new Error(`Backup ${backupId} not found`));
                    return;
                }

                let targetPath = backup.installPath;
                if (folderName) {
                    targetPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
                }

                await AdvancedBackupManager.restoreFromBackup(backupId, targetPath);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Lists all backups for a specific install
     * @param folderName The folder containing the install
     */
    public static listInstallBackups(folderName: string): Promise<BackupMetadata[]> {
        return new Promise(async (resolve, reject) => {
            const dirPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
            
            try {
                const backups = await AdvancedBackupManager.listBackups(dirPath);
                resolve(backups);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Validates a backup's integrity
     * @param backupId The ID of the backup to validate
     */
    public static validateBackup(backupId: string): Promise<any> {
        return AdvancedBackupManager.validateBackup(backupId);
    }

    /**
     * Deletes a backup
     * @param backupId The ID of the backup to delete
     */
    public static deleteBackup(backupId: string): Promise<void> {
        return AdvancedBackupManager.deleteBackup(backupId);
    }

    /**
     * Performs cleanup of old automatic backups
     */
    public static cleanupOldBackups(): Promise<void> {
        return AdvancedBackupManager.cleanupOldBackups();
    }

    /**
     * Enhanced backup method that replaces the original backupInstall
     * @param folderName The folder containing the install
     * @param backupName Name for the backup
     * @param description Optional description
     */
    public static async backupInstallAdvanced(folderName: string, backupName: string, description?: string): Promise<BackupMetadata> {
        const dirPath = joinPath(Config.readConfigValue("installFolder"), "installs", folderName);
        if (!existsSync(dirPath)) {
            throw new Error("Install does not exist.");
        }

        return await AdvancedBackupManager.createManualBackup(dirPath, backupName, description);
    }

    /**
     * Initiates Ren'Py decompilation for an existing install.
     * @param folderName The folder containing the install
     * @returns The progress session identifier for UI tracking
     */
    public static initiateDecompileInstall(folderName: string, options: RenpyDecompileOptions = {}): string {
        const installPath = joinPath(
            Config.readConfigValue("installFolder"),
            "installs",
            folderName,
            "install"
        );

        if (!existsSync(installPath)) {
            throw new Error("Install does not exist.");
        }

        const sessionId = randomBytes(8).toString("hex");
        const reporter = InstallationProgressManager.createReporter(sessionId);

        setImmediate(() => {
            (async () => {
                try {
                    reporter.updatePhase('analyzing', 'Preparing mod decompilation...', 5);
                    const outcome = await ModInstaller.processRenpyContent(installPath, reporter, options);

                    if (outcome === 'success') {
                        reporter.updatePhase('verifying', 'Decompilation complete.', 100);
                        setTimeout(() => InstallationProgressManager.removeReporter(sessionId), 1000);
                    } else if (outcome === 'skipped') {
                        reporter.updatePhase('verifying', 'No Ren\'Py archives detected.', 100);
                        setTimeout(() => InstallationProgressManager.removeReporter(sessionId), 1000);
                    } else {
                        reporter.updatePhase('verifying', 'Decompilation failed. Check logs for details.', 100);
                        setTimeout(() => InstallationProgressManager.removeReporter(sessionId), 5000);
                    }
                } catch (error: any) {
                    const wrappedError = error instanceof Error ? error : new Error(String(error));
                    reporter.error(wrappedError, 'installing');
                    InstallationProgressManager.removeReporter(sessionId);
                }
            })();
        });

        return sessionId;
    }
}
