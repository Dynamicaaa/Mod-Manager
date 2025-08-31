import { ModContainerSystem, ModContainer, ModManifest } from './ModContainer';
import { join as joinPath } from 'path';

/**
 * Manager class for mod container operations
 * Provides a simplified interface for container management as specified in the roadmap
 */
export class ModContainerManager {
    private static containerSystem: ModContainerSystem;
    private static readonly DEFAULT_BASE_PATH = joinPath(process.cwd(), 'mod-manager-data');

    /**
     * Initialize the container manager with a base path
     * @param basePath The base path for container storage
     */
    public static initialize(basePath: string = ModContainerManager.DEFAULT_BASE_PATH): void {
        ModContainerManager.containerSystem = new ModContainerSystem(basePath);
    }

    /**
     * Creates a new mod container from a mod installation
     * @param modPath The path to the mod files
     * @param installPath The target installation path
     * @param manifest The mod manifest
     * @param isolationMode The isolation mode for the container
     * @returns Promise resolving to the created container
     */
    public static async createContainer(
        modPath: string,
        installPath: string,
        manifest: ModManifest,
        isolationMode: 'full' | 'partial' | 'none' = 'partial'
    ): Promise<ModContainer> {
        ModContainerManager.ensureInitialized();
        return await ModContainerManager.containerSystem.createContainer(
            modPath,
            installPath,
            manifest,
            isolationMode
        );
    }

    /**
     * Activates a specific mod container
     * @param id The container ID to activate
     * @param targetInstallPath The path where the container should be applied
     * @returns Promise that resolves when activation is complete
     */
    public static async activateContainer(id: string, targetInstallPath: string): Promise<void> {
        ModContainerManager.ensureInitialized();
        return await ModContainerManager.containerSystem.activateContainer(id, targetInstallPath);
    }

    /**
     * Deactivates the currently active container or a specific container
     * @param id Optional container ID to deactivate (defaults to currently active)
     * @returns Promise that resolves when deactivation is complete
     */
    public static async deactivateContainer(id?: string): Promise<void> {
        ModContainerManager.ensureInitialized();
        return await ModContainerManager.containerSystem.deactivateContainer(id);
    }

    /**
     * Removes a container completely
     * @param id The container ID to remove
     * @returns Promise that resolves when removal is complete
     */
    public static async removeContainer(id: string): Promise<void> {
        ModContainerManager.ensureInitialized();
        return await ModContainerManager.containerSystem.removeContainer(id);
    }

    /**
     * Lists all available containers
     * @returns Array of all containers
     */
    public static listContainers(): ModContainer[] {
        ModContainerManager.ensureInitialized();
        return ModContainerManager.containerSystem.listContainers();
    }

    /**
     * Gets a specific container by ID
     * @param id The container ID
     * @returns The container or undefined if not found
     */
    public static getContainer(id: string): ModContainer | undefined {
        ModContainerManager.ensureInitialized();
        return ModContainerManager.containerSystem.getContainer(id);
    }

    /**
     * Gets the currently active container
     * @returns The active container or undefined if none is active
     */
    public static getActiveContainer(): ModContainer | undefined {
        ModContainerManager.ensureInitialized();
        return ModContainerManager.containerSystem.getActiveContainer();
    }

    /**
     * Checks for conflicts with a given container
     * @param container The container to check for conflicts
     * @returns Promise resolving to an array of conflict descriptions
     */
    public static async checkContainerConflicts(container: ModContainer): Promise<string[]> {
        ModContainerManager.ensureInitialized();
        return await ModContainerManager.containerSystem.checkContainerConflicts(container);
    }

    /**
     * Creates a mod manifest from basic mod information
     * @param modInfo Basic mod information
     * @returns A complete mod manifest
     */
    public static createModManifest(modInfo: {
        name: string;
        version?: string;
        author?: string;
        description?: string;
        renpyVersion?: string;
        dependencies?: string[];
        conflicts?: string[];
        files: string[];
        originalModPath: string;
        mapper: string;
    }): ModManifest {
        return {
            id: '', // Will be set by the container system
            name: modInfo.name,
            version: modInfo.version || '1.0.0',
            author: modInfo.author,
            description: modInfo.description,
            renpyVersion: modInfo.renpyVersion,
            dependencies: modInfo.dependencies || [],
            conflicts: modInfo.conflicts || [],
            installedAt: new Date(),
            files: modInfo.files,
            originalModPath: modInfo.originalModPath,
            mapper: modInfo.mapper
        };
    }

    /**
     * Gets container system statistics
     * @returns Statistics about the container system
     */
    public static getContainerStatistics(): {
        totalContainers: number;
        activeContainers: number;
        inactiveContainers: number;
        isolationModes: { [key: string]: number };
    } {
        ModContainerManager.ensureInitialized();
        const containers = ModContainerManager.containerSystem.listContainers();
        
        const stats = {
            totalContainers: containers.length,
            activeContainers: containers.filter(c => c.isActive).length,
            inactiveContainers: containers.filter(c => !c.isActive).length,
            isolationModes: {}
        };

        containers.forEach(container => {
            const mode = container.isolationMode;
            stats.isolationModes[mode] = (stats.isolationModes[mode] || 0) + 1;
        });

        return stats;
    }

    /**
     * Validates container integrity
     * @param id The container ID to validate
     * @returns Promise resolving to validation results
     */
    public static async validateContainer(id: string): Promise<{
        isValid: boolean;
        issues: string[];
        recommendations: string[];
    }> {
        ModContainerManager.ensureInitialized();
        const container = ModContainerManager.containerSystem.getContainer(id);
        
        if (!container) {
            return {
                isValid: false,
                issues: ['Container not found'],
                recommendations: ['Check container ID and try again']
            };
        }

        const issues: string[] = [];
        const recommendations: string[] = [];

        // Check if container files exist
        const fs = require('fs');
        if (!fs.existsSync(container.installPath)) {
            issues.push('Container installation path does not exist');
            recommendations.push('Recreate the container from the original mod');
        }

        // Check if backup exists for active containers
        if (container.isActive && !fs.existsSync(container.backupPath)) {
            issues.push('No backup found for active container');
            recommendations.push('Create a backup before making changes');
        }

        // Check for missing files
        const missingFiles = container.manifest.files.filter(file => {
            const filePath = joinPath(container.installPath, file);
            return !fs.existsSync(filePath);
        });

        if (missingFiles.length > 0) {
            issues.push(`Missing files: ${missingFiles.join(', ')}`);
            recommendations.push('Verify container integrity and recreate if necessary');
        }

        return {
            isValid: issues.length === 0,
            issues,
            recommendations
        };
    }

    /**
     * Ensures the container system is initialized
     * @throws Error if not initialized
     */
    private static ensureInitialized(): void {
        if (!ModContainerManager.containerSystem) {
            ModContainerManager.initialize();
        }
    }
}