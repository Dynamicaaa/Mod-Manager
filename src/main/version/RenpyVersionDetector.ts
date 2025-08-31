import { readFileSync, existsSync } from "fs";
import { join as joinPath } from "path";
import { CrossPlatformPathResolver } from "../utils/CrossPlatformPathResolver";

/**
 * Information about detected Ren'Py version
 */
export interface RenpyVersionInfo {
    version: string;
    majorVersion: number;
    minorVersion: number;
    patchVersion: number;
    buildInfo?: string;
    detectionMethod: 'executable' | 'script' | 'manifest' | 'heuristic';
    confidence: 'high' | 'medium' | 'low';
    compatibilityNotes?: string[];
}

/**
 * Version compatibility result
 */
export interface VersionCompatibility {
    isCompatible: boolean;
    confidence: 'high' | 'medium' | 'low';
    issues: string[];
    recommendations: string[];
    requiresConversion: boolean;
}

/**
 * Detects and validates Ren'Py version compatibility
 */
export class RenpyVersionDetector {
    private static readonly VERSION_PATTERNS = {
        // Common version patterns in Ren'Py files
        executable: /Ren'Py\s+(\d+\.\d+(?:\.\d+)?(?:\.\d+)?)/i,
        script: /version\s*[=:]\s*['"]([\d.]+)['"]/i,
        comment: /#.*Ren'Py\s+(\d+\.\d+(?:\.\d+)?)/i,
        define: /define\s+(?:config\.)?version\s*=\s*['"]([\d.]+)['"]/i,
        metadata: /"version"\s*:\s*"([\d.]+)"/i
    };

    private static readonly COMPATIBILITY_MATRIX = {
        // Ren'Py version compatibility rules
        '6.x': {
            compatibleWith: ['6.0', '6.1', '6.99'],
            issues: ['Legacy Python 2.7', 'Limited Unicode support'],
            recommendations: ['Consider upgrading to Ren\'Py 7.x or 8.x']
        },
        '7.x': {
            compatibleWith: ['7.0', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6'],
            issues: ['Python 2.7 to 3.x transition period'],
            recommendations: ['Generally good compatibility']
        },
        '8.x': {
            compatibleWith: ['8.0', '8.1', '8.2', '8.3'],
            issues: ['Modern Python 3.x only'],
            recommendations: ['Latest features and best performance']
        }
    };

    /**
     * Detects Ren'Py version from mod files
     */
    public static async detectFromMod(modPath: string): Promise<RenpyVersionInfo> {
        const detectionResults: RenpyVersionInfo[] = [];

        // Try different detection methods
        detectionResults.push(...await this.detectFromExecutables(modPath));
        detectionResults.push(...await this.detectFromScripts(modPath));
        detectionResults.push(...await this.detectFromManifests(modPath));
        detectionResults.push(...await this.detectFromHeuristics(modPath));

        // Return the highest confidence result
        if (detectionResults.length === 0) {
            return this.createUnknownVersionInfo();
        }

        // Sort by confidence and use the best result
        detectionResults.sort((a, b) => {
            const confidenceScore = { high: 3, medium: 2, low: 1 };
            return confidenceScore[b.confidence] - confidenceScore[a.confidence];
        });

        return detectionResults[0];
    }

    /**
     * Detects Ren'Py version from game installation
     */
    public static async detectFromGame(installPath: string): Promise<RenpyVersionInfo> {
        const detectionResults: RenpyVersionInfo[] = [];

        // Check different locations based on platform
        const scriptPath = CrossPlatformPathResolver.resolveScriptPath(installPath);
        const gamePath = CrossPlatformPathResolver.resolveGamePath(installPath);
        const renpyPath = CrossPlatformPathResolver.resolveRenpyPath(installPath);

        // Try to detect from executables
        detectionResults.push(...await this.detectFromExecutables(scriptPath));
        
        // Try to detect from game scripts
        detectionResults.push(...await this.detectFromScripts(gamePath));
        
        // Try to detect from Ren'Py library
        detectionResults.push(...await this.detectFromRenpyLibrary(renpyPath));

        if (detectionResults.length === 0) {
            return this.createUnknownVersionInfo();
        }

        // Return highest confidence result
        detectionResults.sort((a, b) => {
            const confidenceScore = { high: 3, medium: 2, low: 1 };
            return confidenceScore[b.confidence] - confidenceScore[a.confidence];
        });

        return detectionResults[0];
    }

    /**
     * Checks compatibility between mod and game versions
     */
    public static checkCompatibility(modVersion: string, gameVersion: string): VersionCompatibility {
        const modInfo = this.parseVersionString(modVersion);
        const gameInfo = this.parseVersionString(gameVersion);

        const compatibility: VersionCompatibility = {
            isCompatible: true,
            confidence: 'high',
            issues: [],
            recommendations: [],
            requiresConversion: false
        };

        // Major version compatibility check
        if (modInfo.majorVersion !== gameInfo.majorVersion) {
            compatibility.isCompatible = false;
            compatibility.confidence = 'low';
            compatibility.issues.push(`Major version mismatch: Mod requires Ren'Py ${modInfo.majorVersion}.x, game has ${gameInfo.majorVersion}.x`);
            
            if (modInfo.majorVersion < gameInfo.majorVersion) {
                compatibility.recommendations.push('Mod may need updates for newer Ren\'Py version');
                compatibility.requiresConversion = true;
            } else {
                compatibility.recommendations.push('Game may need updates to support this mod');
            }
        }

        // Minor version compatibility
        if (modInfo.majorVersion === gameInfo.majorVersion) {
            const versionDiff = Math.abs(modInfo.minorVersion - gameInfo.minorVersion);
            
            if (versionDiff > 2) {
                compatibility.confidence = 'medium';
                compatibility.issues.push(`Significant minor version difference: ${versionDiff} versions apart`);
                compatibility.recommendations.push('Test thoroughly for compatibility issues');
            }
        }

        // Add version-specific compatibility notes
        this.addVersionSpecificNotes(modInfo, gameInfo, compatibility);

        return compatibility;
    }

    /**
     * Gets version display string
     */
    public static getVersionDisplayString(versionInfo: RenpyVersionInfo): string {
        let display = `Ren'Py ${versionInfo.version}`;
        
        if (versionInfo.buildInfo) {
            display += ` (${versionInfo.buildInfo})`;
        }
        
        display += ` [${versionInfo.confidence} confidence, detected via ${versionInfo.detectionMethod}]`;
        
        return display;
    }

    private static async detectFromExecutables(path: string): Promise<RenpyVersionInfo[]> {
        const results: RenpyVersionInfo[] = [];
        
        try {
            // Check for common executable names
            const executables = ['DDLC.exe', 'DDLC', 'DDLC.sh', 'game.exe', 'renpy.exe'];
            
            for (const exe of executables) {
                const exePath = joinPath(path, exe);
                if (existsSync(exePath)) {
                    const version = await this.extractVersionFromExecutable(exePath);
                    if (version) {
                        results.push(version);
                    }
                }
            }
        } catch (error) {
            console.warn("Error detecting version from executables:", error.message);
        }
        
        return results;
    }

    private static async detectFromScripts(path: string): Promise<RenpyVersionInfo[]> {
        const results: RenpyVersionInfo[] = [];
        
        try {
            // Check common script files
            const scriptFiles = ['script.rpy', 'options.rpy', 'gui.rpy', 'screens.rpy'];
            
            for (const script of scriptFiles) {
                const scriptPath = joinPath(path, script);
                if (existsSync(scriptPath)) {
                    const version = await this.extractVersionFromScript(scriptPath);
                    if (version) {
                        results.push(version);
                    }
                }
            }
        } catch (error) {
            console.warn("Error detecting version from scripts:", error.message);
        }
        
        return results;
    }

    private static async detectFromManifests(path: string): Promise<RenpyVersionInfo[]> {
        const results: RenpyVersionInfo[] = [];
        
        try {
            // Check manifest files
            const manifestFiles = ['mod.json', 'manifest.json', 'package.json', 'info.json'];
            
            for (const manifest of manifestFiles) {
                const manifestPath = joinPath(path, manifest);
                if (existsSync(manifestPath)) {
                    const version = await this.extractVersionFromManifest(manifestPath);
                    if (version) {
                        results.push(version);
                    }
                }
            }
        } catch (error) {
            console.warn("Error detecting version from manifests:", error.message);
        }
        
        return results;
    }

    private static async detectFromHeuristics(path: string): Promise<RenpyVersionInfo[]> {
        const results: RenpyVersionInfo[] = [];
        
        try {
            // Heuristic detection based on file patterns and features
            const version = await this.detectVersionByFeatures(path);
            if (version) {
                results.push(version);
            }
        } catch (error) {
            console.warn("Error in heuristic version detection:", error.message);
        }
        
        return results;
    }

    private static async detectFromRenpyLibrary(path: string): Promise<RenpyVersionInfo[]> {
        const results: RenpyVersionInfo[] = [];
        
        try {
            // Check Ren'Py library files
            const libraryFiles = ['__init__.py', 'version.py', 'common.rpy'];
            
            for (const lib of libraryFiles) {
                const libPath = joinPath(path, lib);
                if (existsSync(libPath)) {
                    const version = await this.extractVersionFromLibrary(libPath);
                    if (version) {
                        results.push(version);
                    }
                }
            }
        } catch (error) {
            console.warn("Error detecting version from Ren'Py library:", error.message);
        }
        
        return results;
    }

    private static async extractVersionFromExecutable(exePath: string): Promise<RenpyVersionInfo | null> {
        try {
            // Read binary file and search for version strings
            const buffer = readFileSync(exePath);
            const content = buffer.toString('ascii');
            
            const match = content.match(this.VERSION_PATTERNS.executable);
            if (match) {
                return this.createVersionInfo(match[1], 'executable', 'high');
            }
        } catch (error) {
            // Binary files may not be readable as text
        }
        
        return null;
    }

    private static async extractVersionFromScript(scriptPath: string): Promise<RenpyVersionInfo | null> {
        try {
            const content = readFileSync(scriptPath, 'utf8');
            
            // Try different patterns
            for (const [patternName, pattern] of Object.entries(this.VERSION_PATTERNS)) {
                if (patternName === 'executable') continue;
                
                const match = content.match(pattern);
                if (match) {
                    const confidence = patternName === 'define' ? 'high' : 'medium';
                    return this.createVersionInfo(match[1], 'script', confidence);
                }
            }
        } catch (error) {
            console.warn(`Error reading script file ${scriptPath}:`, error.message);
        }
        
        return null;
    }

    private static async extractVersionFromManifest(manifestPath: string): Promise<RenpyVersionInfo | null> {
        try {
            const content = readFileSync(manifestPath, 'utf8');
            const data = JSON.parse(content);
            
            // Check various version fields
            const versionFields = ['renpyVersion', 'renpy_version', 'version', 'engine_version'];
            
            for (const field of versionFields) {
                if (data[field]) {
                    const confidence = field.includes('renpy') ? 'high' : 'medium';
                    return this.createVersionInfo(data[field], 'manifest', confidence);
                }
            }
        } catch (error) {
            // Not JSON or invalid format
        }
        
        return null;
    }

    private static async extractVersionFromLibrary(libPath: string): Promise<RenpyVersionInfo | null> {
        try {
            const content = readFileSync(libPath, 'utf8');
            
            // Look for version definitions in Python files
            const pythonVersionPattern = /version\s*=\s*['"]([\d.]+)['"]/i;
            const match = content.match(pythonVersionPattern);
            
            if (match) {
                return this.createVersionInfo(match[1], 'executable', 'high');
            }
        } catch (error) {
            console.warn(`Error reading library file ${libPath}:`, error.message);
        }
        
        return null;
    }

    private static async detectVersionByFeatures(path: string): Promise<RenpyVersionInfo | null> {
        try {
            // Heuristic detection based on file presence and features
            
            // Check for Ren'Py 8.x features
            if (existsSync(joinPath(path, 'game', 'tl')) && 
                existsSync(joinPath(path, 'game', 'gui.rpy'))) {
                return this.createVersionInfo('8.0', 'heuristic', 'low', 'Based on modern file structure');
            }
            
            // Check for Ren'Py 7.x features
            if (existsSync(joinPath(path, 'game', 'gui.rpy')) ||
                existsSync(joinPath(path, 'game', 'screens.rpy'))) {
                return this.createVersionInfo('7.0', 'heuristic', 'low', 'Based on GUI system presence');
            }
            
            // Check for Ren'Py 6.x features
            if (existsSync(joinPath(path, 'game', 'script.rpy'))) {
                return this.createVersionInfo('6.99', 'heuristic', 'low', 'Based on legacy structure');
            }
        } catch (error) {
            console.warn("Error in heuristic detection:", error.message);
        }
        
        return null;
    }

    private static createVersionInfo(
        version: string, 
        method: RenpyVersionInfo['detectionMethod'], 
        confidence: RenpyVersionInfo['confidence'],
        buildInfo?: string
    ): RenpyVersionInfo {
        const parsed = this.parseVersionString(version);
        
        return {
            version,
            majorVersion: parsed.majorVersion,
            minorVersion: parsed.minorVersion,
            patchVersion: parsed.patchVersion,
            buildInfo,
            detectionMethod: method,
            confidence,
            compatibilityNotes: this.getCompatibilityNotes(parsed.majorVersion)
        };
    }

    private static createUnknownVersionInfo(): RenpyVersionInfo {
        return {
            version: 'unknown',
            majorVersion: 0,
            minorVersion: 0,
            patchVersion: 0,
            detectionMethod: 'heuristic',
            confidence: 'low',
            compatibilityNotes: ['Unable to detect Ren\'Py version', 'Manual verification recommended']
        };
    }

    private static parseVersionString(version: string): { majorVersion: number; minorVersion: number; patchVersion: number } {
        const parts = version.split('.').map(p => parseInt(p) || 0);
        
        return {
            majorVersion: parts[0] || 0,
            minorVersion: parts[1] || 0,
            patchVersion: parts[2] || 0
        };
    }

    private static getCompatibilityNotes(majorVersion: number): string[] {
        const notes: string[] = [];
        
        switch (majorVersion) {
            case 6:
                notes.push('Legacy Ren\'Py version with Python 2.7');
                notes.push('Limited modern feature support');
                break;
            case 7:
                notes.push('Mature Ren\'Py version with good compatibility');
                notes.push('Supports most modern features');
                break;
            case 8:
                notes.push('Latest Ren\'Py version with full Python 3 support');
                notes.push('Best performance and modern features');
                break;
            default:
                notes.push('Unknown or unsupported Ren\'Py version');
        }
        
        return notes;
    }

    private static addVersionSpecificNotes(
        modInfo: { majorVersion: number; minorVersion: number },
        gameInfo: { majorVersion: number; minorVersion: number },
        compatibility: VersionCompatibility
    ): void {
        // Add specific compatibility notes based on version combinations
        
        if (modInfo.majorVersion === 6 && gameInfo.majorVersion >= 7) {
            compatibility.issues.push('Legacy mod may use deprecated Python 2.7 syntax');
            compatibility.recommendations.push('Check for Python 3 compatibility issues');
        }
        
        if (modInfo.majorVersion >= 7 && gameInfo.majorVersion === 6) {
            compatibility.issues.push('Modern mod may use features not available in legacy Ren\'Py');
            compatibility.recommendations.push('Consider upgrading game engine');
        }
        
        if (modInfo.majorVersion === 8 && gameInfo.majorVersion < 8) {
            compatibility.issues.push('Latest mod features may not be supported');
            compatibility.recommendations.push('Update to Ren\'Py 8.x for full compatibility');
        }
    }
}