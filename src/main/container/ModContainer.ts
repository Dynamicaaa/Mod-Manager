import { join as joinPath } from "path";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { removeSync, copySync } from "fs-extra";
import { CrossPlatformPathResolver } from "../utils/CrossPlatformPathResolver";

/**
 * Interface for mod manifests stored in containers
 */
export interface ModManifest {
    id: string;
    name: string;
    version: string;
    author?: string;
    description?: string;
    renpyVersion?: string;
    dependencies?: string[];
    conflicts?: string[];
    installedAt: Date;
    lastActivated?: Date;
    files: string[];
    originalModPath: string;
    mapper: string;
}

/**
 * Interface for mod containers
 */
export interface ModContainer {
    id: string;
    name: string;
    installPath: string;
    backupPath: string;
    manifest: ModManifest;
    isActive: boolean;
    isolationMode: 'full' | 'partial' | 'none';
}

/**
 * Container metadata stored on disk
 */
export interface ContainerMetadata {
    containers: { [id: string]: ModContainer };
    activeContainer?: string;
    lastUpdated: Date;
    version: string;
}

/**
 * Container-based mod management for complete mod isolation
 */
export class ModContainerSystem {
    private static readonly CONTAINERS_DIR = "containers";
    private static readonly METADATA_FILE = "containers.json";
    private static readonly CURRENT_VERSION = "1.0.0";

    private containersPath: string;
    private metadataPath: string;
    private metadata: ContainerMetadata;

    constructor(private basePath: string) {
        this.containersPath = joinPath(basePath, ModContainerSystem.CONTAINERS_DIR);
        this.metadataPath = joinPath(this.containersPath, ModContainerSystem.METADATA_FILE);
        this.ensureDirectories();
        this.loadMetadata();
    }

    /**
     * Creates a new mod container from an installation
     */
    public async createContainer(
        modPath: string,
        installPath: string,
        manifest: ModManifest,
        isolationMode: 'full' | 'partial' | 'none' = 'partial'
    ): Promise<ModContainer> {
        const containerId = this.generateContainerId(manifest.name);
        const containerPath = joinPath(this.containersPath, containerId);
        const backupPath = CrossPlatformPathResolver.resolveBackupPath(installPath, `container-${containerId}`);

        // Create container directory
        if (!existsSync(containerPath)) {
            mkdirSync(containerPath, { recursive: true });
        }

        // Create backup before container installation
        await this.createContainerBackup(installPath, backupPath);

        const container: ModContainer = {
            id: containerId,
            name: manifest.name,
            installPath: containerPath,
            backupPath,
            manifest: {
                ...manifest,
                id: containerId,
                installedAt: new Date()
            },
            isActive: false,
            isolationMode
        };

        // Store container metadata
        this.metadata.containers[containerId] = container;
        this.saveMetadata();

        // Copy mod files to container
        await this.populateContainer(container, modPath);

        console.log(`Created mod container: ${containerId} for mod: ${manifest.name}`);
        return container;
    }

    /**
     * Activates a specific mod container
     */
    public async activateContainer(containerId: string, targetInstallPath: string): Promise<void> {
        const container = this.metadata.containers[containerId];
        if (!container) {
            throw new Error(`Container not found: ${containerId}`);
        }

        // Deactivate current container if any
        if (this.metadata.activeContainer) {
            await this.deactivateContainer(this.metadata.activeContainer);
        }

        // Check for conflicts
        await this.checkContainerConflicts(container);

        // Apply container to installation
        await this.applyContainer(container, targetInstallPath);

        // Update metadata
        container.isActive = true;
        container.manifest.lastActivated = new Date();
        this.metadata.activeContainer = containerId;
        this.saveMetadata();

        console.log(`Activated mod container: ${containerId}`);
    }

    /**
     * Deactivates the currently active container
     */
    public async deactivateContainer(containerId?: string): Promise<void> {
        const activeId = containerId || this.metadata.activeContainer;
        if (!activeId) {
            return; // No active container
        }

        const container = this.metadata.containers[activeId];
        if (!container) {
            throw new Error(`Container not found: ${activeId}`);
        }

        // Restore from backup if available
        if (existsSync(container.backupPath)) {
            await this.restoreFromBackup(container.backupPath, this.getInstallPathFromContainer(container));
        }

        // Update metadata
        container.isActive = false;
        if (this.metadata.activeContainer === activeId) {
            delete this.metadata.activeContainer;
        }
        this.saveMetadata();

        console.log(`Deactivated mod container: ${activeId}`);
    }

    /**
     * Removes a container completely
     */
    public async removeContainer(containerId: string): Promise<void> {
        const container = this.metadata.containers[containerId];
        if (!container) {
            throw new Error(`Container not found: ${containerId}`);
        }

        // Deactivate if currently active
        if (container.isActive) {
            await this.deactivateContainer(containerId);
        }

        // Remove container files
        if (existsSync(container.installPath)) {
            removeSync(container.installPath);
        }

        // Remove backup
        if (existsSync(container.backupPath)) {
            removeSync(container.backupPath);
        }

        // Remove from metadata
        delete this.metadata.containers[containerId];
        this.saveMetadata();

        console.log(`Removed mod container: ${containerId}`);
    }

    /**
     * Lists all containers
     */
    public listContainers(): ModContainer[] {
        return Object.values(this.metadata.containers);
    }

    /**
     * Gets a specific container
     */
    public getContainer(containerId: string): ModContainer | undefined {
        return this.metadata.containers[containerId];
    }

    /**
     * Gets the currently active container
     */
    public getActiveContainer(): ModContainer | undefined {
        if (!this.metadata.activeContainer) {
            return undefined;
        }
        return this.metadata.containers[this.metadata.activeContainer];
    }

    /**
     * Checks for conflicts between containers
     */
    public async checkContainerConflicts(container: ModContainer): Promise<string[]> {
        const conflicts: string[] = [];
        
        // Check for dependency conflicts
        if (container.manifest.conflicts) {
            for (const conflictId of container.manifest.conflicts) {
                const conflictContainer = this.metadata.containers[conflictId];
                if (conflictContainer && conflictContainer.isActive) {
                    conflicts.push(`Conflicts with active mod: ${conflictContainer.name}`);
                }
            }
        }

        // Check for file conflicts with other active containers
        const activeContainers = Object.values(this.metadata.containers).filter(c => c.isActive);
        for (const activeContainer of activeContainers) {
            const fileConflicts = this.findFileConflicts(container, activeContainer);
            if (fileConflicts.length > 0) {
                conflicts.push(`File conflicts with ${activeContainer.name}: ${fileConflicts.join(', ')}`);
            }
        }

        return conflicts;
    }

    private ensureDirectories(): void {
        if (!existsSync(this.containersPath)) {
            mkdirSync(this.containersPath, { recursive: true });
        }
    }

    private loadMetadata(): void {
        if (existsSync(this.metadataPath)) {
            try {
                const data = readFileSync(this.metadataPath, 'utf8');
                this.metadata = JSON.parse(data);
                
                // Convert date strings back to Date objects
                for (const container of Object.values(this.metadata.containers)) {
                    container.manifest.installedAt = new Date(container.manifest.installedAt);
                    if (container.manifest.lastActivated) {
                        container.manifest.lastActivated = new Date(container.manifest.lastActivated);
                    }
                }
                this.metadata.lastUpdated = new Date(this.metadata.lastUpdated);
            } catch (error) {
                console.warn("Failed to load container metadata, creating new:", error.message);
                this.metadata = this.createDefaultMetadata();
            }
        } else {
            this.metadata = this.createDefaultMetadata();
        }
    }

    private saveMetadata(): void {
        this.metadata.lastUpdated = new Date();
        this.metadata.version = ModContainerSystem.CURRENT_VERSION;
        
        try {
            writeFileSync(this.metadataPath, JSON.stringify(this.metadata, null, 2));
        } catch (error) {
            console.error("Failed to save container metadata:", error.message);
        }
    }

    private createDefaultMetadata(): ContainerMetadata {
        return {
            containers: {},
            lastUpdated: new Date(),
            version: ModContainerSystem.CURRENT_VERSION
        };
    }

    private generateContainerId(modName: string): string {
        const sanitized = modName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const timestamp = Date.now().toString(36);
        return `${sanitized}-${timestamp}`;
    }

    private async createContainerBackup(installPath: string, backupPath: string): Promise<void> {
        try {
            if (existsSync(installPath)) {
                copySync(installPath, backupPath);
                console.log(`Created container backup: ${backupPath}`);
            }
        } catch (error) {
            console.warn("Failed to create container backup:", error.message);
        }
    }

    private async populateContainer(container: ModContainer, modPath: string): Promise<void> {
        try {
            // Copy mod files to container
            if (existsSync(modPath)) {
                copySync(modPath, container.installPath);
            }

            // Save container manifest
            const manifestPath = joinPath(container.installPath, "container-manifest.json");
            writeFileSync(manifestPath, JSON.stringify(container.manifest, null, 2));
        } catch (error) {
            console.error("Failed to populate container:", error.message);
            throw error;
        }
    }

    private async applyContainer(container: ModContainer, targetPath: string): Promise<void> {
        try {
            // Apply based on isolation mode
            switch (container.isolationMode) {
                case 'full':
                    // Replace entire installation
                    if (existsSync(targetPath)) {
                        removeSync(targetPath);
                    }
                    copySync(container.installPath, targetPath);
                    break;
                    
                case 'partial':
                    // Merge container files with existing installation
                    copySync(container.installPath, targetPath);
                    break;
                    
                case 'none':
                    // Symbolic link or reference (development mode)
                    console.log(`Container ${container.id} applied in reference mode`);
                    break;
            }
        } catch (error) {
            console.error("Failed to apply container:", error.message);
            throw error;
        }
    }

    private async restoreFromBackup(backupPath: string, targetPath: string): Promise<void> {
        try {
            if (existsSync(backupPath)) {
                if (existsSync(targetPath)) {
                    removeSync(targetPath);
                }
                copySync(backupPath, targetPath);
                console.log(`Restored from backup: ${backupPath} -> ${targetPath}`);
            }
        } catch (error) {
            console.error("Failed to restore from backup:", error.message);
        }
    }

    private findFileConflicts(container1: ModContainer, container2: ModContainer): string[] {
        const conflicts: string[] = [];
        const files1 = new Set(container1.manifest.files);
        const files2 = new Set(container2.manifest.files);

        for (const file of files1) {
            if (files2.has(file)) {
                conflicts.push(file);
            }
        }

        return conflicts;
    }

    private getInstallPathFromContainer(container: ModContainer): string {
        // This would typically be derived from the original installation
        // For now, assume it's a sibling directory
        return joinPath(this.containersPath, "..", "install");
    }
}