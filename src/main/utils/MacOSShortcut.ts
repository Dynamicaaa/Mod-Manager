import {mkdirsSync, writeFileSync} from "fs-extra";
import {join as joinPath} from "path";
import * as chmodr from "chmodr";

/**
 * Creates a macOS app bundle shortcut for launching DDLC installs
 * @param appPath The path where the .app bundle should be created
 * @param folderName The install folder name
 * @param installName The display name for the install
 */
export async function createMacOSShortcut(appPath: string, folderName: string, installName: string): Promise<void> {
    // Ensure the path ends with .app
    const finalAppPath = appPath.endsWith('.app') ? appPath : `${appPath}.app`;
    
    // Create the app bundle structure
    const contentsPath = joinPath(finalAppPath, "Contents");
    const macOSPath = joinPath(contentsPath, "MacOS");
    const resourcesPath = joinPath(contentsPath, "Resources");
    
    mkdirsSync(macOSPath);
    mkdirsSync(resourcesPath);
    
    // Create Info.plist
    const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>launcher</string>
    <key>CFBundleIdentifier</key>
    <string>com.ddmm.${folderName}</string>
    <key>CFBundleName</key>
    <string>${installName}</string>
    <key>CFBundleDisplayName</key>
    <string>${installName}</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>DDMM</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.9</string>
    <key>LSUIElement</key>
    <true/>
</dict>
</plist>`;
    
    writeFileSync(joinPath(contentsPath, "Info.plist"), infoPlist);
    
    // Create the launcher script
    const launcherScript = `#!/bin/bash
# DDLC Mod Manager Install Launcher for ${installName}

# Launch DDLC through DDMM protocol
open "ddmm://launch-install/${folderName}"
`;
    
    writeFileSync(joinPath(macOSPath, "launcher"), launcherScript);
    
    // Make the launcher executable
    await new Promise<void>((resolve, reject) => {
        chmodr(joinPath(macOSPath, "launcher"), 0o755, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
