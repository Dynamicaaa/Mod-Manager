import {readdirSync, statSync, unlinkSync} from "fs";
import {join as joinPath} from "path";

/**
 * Utility class for cleaning up macOS-specific files that can interfere with game execution
 */
export default class MacOSFileCleanup {

    /**
     * Recursively removes macOS resource fork files (._*) and other problematic files
     * @param directory The directory to clean
     * @param recursive Whether to clean subdirectories recursively
     */
    static cleanMacOSFiles(directory: string, recursive: boolean = true): void {
        if (process.platform !== "darwin") {
            return; // Only run on macOS
        }

        try {
            const files = readdirSync(directory);
            
            for (const file of files) {
                const fullPath = joinPath(directory, file);
                
                try {
                    const stats = statSync(fullPath);
                    
                    if (stats.isDirectory() && recursive) {
                        // Recursively clean subdirectories
                        this.cleanMacOSFiles(fullPath, recursive);
                    } else if (stats.isFile() && this.shouldRemoveFile(file)) {
                        // Remove problematic files
                        console.log("Removing macOS resource fork file:", fullPath);
                        unlinkSync(fullPath);
                    }
                } catch (fileError) {
                    console.warn("Could not process file during cleanup:", fullPath, fileError.message);
                }
            }
        } catch (error) {
            console.warn("Could not clean macOS files in directory:", directory, error.message);
        }
    }

    /**
     * Determines if a file should be removed during cleanup
     * @param filename The filename to check
     * @returns true if the file should be removed
     */
    private static shouldRemoveFile(filename: string): boolean {
        // Remove resource fork files (._*)
        if (filename.startsWith("._")) {
            return true;
        }
        
        // Remove .DS_Store files
        if (filename === ".DS_Store") {
            return true;
        }
        
        // Remove Thumbs.db files (Windows, but sometimes present)
        if (filename === "Thumbs.db") {
            return true;
        }
        
        return false;
    }

    /**
     * Cleans up macOS files specifically in a game installation directory
     * @param installPath The path to the game installation
     */
    static cleanGameInstallation(installPath: string): void {
        if (process.platform !== "darwin") {
            return;
        }

        console.log("Cleaning macOS files from game installation:", installPath);
        
        // Clean the main install directory
        this.cleanMacOSFiles(installPath, true);
        
        // Pay special attention to critical game directories
        const criticalPaths = [
            joinPath(installPath, "game"),
            joinPath(installPath, "renpy"),
            joinPath(installPath, "lib"),
            joinPath(installPath, "DDLC.app", "Contents", "Resources", "autorun")
        ];
        
        for (const criticalPath of criticalPaths) {
            try {
                const stats = statSync(criticalPath);
                if (stats.isDirectory()) {
                    this.cleanMacOSFiles(criticalPath, true);
                }
            } catch (error) {
                // Directory doesn't exist, skip
            }
        }
    }
}