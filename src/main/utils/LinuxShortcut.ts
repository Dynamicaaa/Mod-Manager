import {writeFileSync} from "fs-extra";
import * as chmodr from "chmodr";

/**
 * Creates a Linux .desktop file shortcut for launching DDLC installs
 * @param desktopPath The path where the .desktop file should be created
 * @param folderName The install folder name
 * @param installName The display name for the install
 */
export async function createLinuxShortcut(desktopPath: string, folderName: string, installName: string): Promise<void> {
    // Ensure the path ends with .desktop
    const finalDesktopPath = desktopPath.endsWith('.desktop') ? desktopPath : `${desktopPath}.desktop`;
    
    // Create the .desktop file content
    const desktopContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=${installName}
Comment=Launch ${installName} through DDLC Mod Manager
Exec=xdg-open "ddmm://launch-install/${folderName}"
Icon=applications-games
Terminal=false
Categories=Game;
StartupNotify=true
`;
    
    writeFileSync(finalDesktopPath, desktopContent);
    
    // Make the .desktop file executable
    await new Promise<void>((resolve, reject) => {
        chmodr(finalDesktopPath, 0o755, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
