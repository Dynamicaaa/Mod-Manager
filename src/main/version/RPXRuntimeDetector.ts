import { promises as fs } from "fs";
import { join as joinPath, extname } from "path";
import { inflate } from "zlib";
import { promisify } from "util";

const inflateAsync = promisify(inflate);

export type RuntimeConfidence = "low" | "medium" | "high";

export interface RuntimeClassification {
    format: "RPC1" | "RPC2" | "UNKNOWN";
    pythonMajor: number;
    renpyMajor: number | string;
    pickleProtocol: number;
    scriptVersion: number | null;
    hasInitOffset: boolean;
    confidence: RuntimeConfidence;
    build?: string | null;
    notes: string[];
    label: string;
}

export interface RuntimeDetectionResult extends RuntimeClassification {
    source: "rpyc" | "rpa";
    originPath?: string;
}

interface ScanQueueItem {
    path: string;
    depth: number;
}

const RPY_RUNTIME_EXTENSIONS = new Set([".rpyc"]);
const RPA_RUNTIME_EXTENSIONS = new Set([".rpa"]);

/**
 * Lightweight runtime detector ported from the RPX project.
 * Focused on identifying the originating Ren'Py runtime version
 * by analysing compiled RPYC files without requiring full extraction.
 */
export class RPXRuntimeDetector {
    /**
     * Attempt to detect the Ren'Py runtime that produced the provided file.
     */
    public static async detectFromFile(filePath: string): Promise<RuntimeDetectionResult | null> {
        try {
            const ext = extname(filePath).toLowerCase();
            const buffer = await fs.readFile(filePath);
            return await this.detectFromBuffer(buffer, { extension: ext, originPath: filePath });
        } catch (error) {
            console.warn(`RPXRuntimeDetector: Failed to read ${filePath}:`, error);
            return null;
        }
    }

    /**
     * Scan a directory recursively (limited depth) for runtime artefacts and classify them.
     */
    public static async detectFromDirectory(directory: string, maxDepth = 3): Promise<RuntimeDetectionResult | null> {
        const queue: ScanQueueItem[] = [{ path: directory, depth: 0 }];

        while (queue.length > 0) {
            const { path, depth } = queue.shift()!;
            let entries;
            try {
                entries = await fs.readdir(path, { withFileTypes: true });
            } catch (error) {
                continue;
            }

            for (const entry of entries) {
                const resolved = joinPath(path, entry.name);
                if (entry.isDirectory()) {
                    if (depth < maxDepth) {
                        queue.push({ path: resolved, depth: depth + 1 });
                    }
                    continue;
                }

                const ext = extname(entry.name).toLowerCase();
                if (RPY_RUNTIME_EXTENSIONS.has(ext) || RPA_RUNTIME_EXTENSIONS.has(ext)) {
                    const result = await this.detectFromFile(resolved);
                    if (result) {
                        return result;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Detect runtime classification from a raw buffer.
     */
    public static async detectFromBuffer(
        buffer: Buffer,
        options: { extension?: string; originPath?: string } = {}
    ): Promise<RuntimeDetectionResult | null> {
        const extension = options.extension?.toLowerCase();

        if (extension && RPY_RUNTIME_EXTENSIONS.has(extension)) {
            const classified = await this.detectFromRPYCBuffer(buffer);
            if (classified) {
                return { ...classified, source: "rpyc", originPath: options.originPath };
            }
        }

        if (extension && RPA_RUNTIME_EXTENSIONS.has(extension)) {
            const classified = await this.detectFromRPABuffer(buffer);
            if (classified) {
                return { ...classified, source: "rpa", originPath: options.originPath };
            }
        }

        // Heuristic fallback: try RPYC detection first as RPYC headers are distinctive.
        const rpycClassified = await this.detectFromRPYCBuffer(buffer);
        if (rpycClassified) {
            return { ...rpycClassified, source: "rpyc", originPath: options.originPath };
        }

        const rpaClassified = await this.detectFromRPABuffer(buffer);
        if (rpaClassified) {
            return { ...rpaClassified, source: "rpa", originPath: options.originPath };
        }

        return null;
    }

    private static async detectFromRPYCBuffer(buffer: Buffer): Promise<RuntimeClassification | null> {
        if (!buffer || buffer.length < 12) {
            return null;
        }

        const ascii = buffer.subarray(0, 12).toString("ascii");

        if (ascii.startsWith("RENPY RPC2")) {
            let pos = 10;
            let slot1: { start: number; length: number } | null = null;

            while (pos + 12 <= buffer.length) {
                const slot = buffer.readUInt32LE(pos);
                const start = buffer.readUInt32LE(pos + 4);
                const length = buffer.readUInt32LE(pos + 8);
                pos += 12;
                if (slot === 0) {
                    break;
                }
                if (slot === 1) {
                    slot1 = { start, length };
                }
            }

            if (slot1 && slot1.start >= 0 && slot1.length > 0 && slot1.start + slot1.length <= buffer.length) {
                const chunk = buffer.subarray(slot1.start, slot1.start + slot1.length);
                try {
                    const data = await inflateAsync(chunk);
                    let protocol = -1;
                    if (data.length >= 2 && data[0] === 0x80) {
                        protocol = data[1];
                    }
                    const pythonMajor = protocol >= 3 ? 3 : 2;
                    const renpyMajor = pythonMajor >= 3 ? 8 : 7;
                    return this.classify({
                        format: "RPC2",
                        pythonMajor,
                        renpyMajor,
                        pickleProtocol: protocol,
                        confidence: "medium",
                    });
                } catch {
                    return this.classify({
                        format: "RPC2",
                        pythonMajor: 2,
                        renpyMajor: 7,
                        pickleProtocol: -1,
                        confidence: "low",
                    });
                }
            }

            return this.classify({
                format: "RPC2",
                pythonMajor: 2,
                renpyMajor: 7,
                pickleProtocol: -1,
                confidence: "low",
            });
        }

        try {
            await inflateAsync(buffer);
            return this.classify({
                format: "RPC1",
                pythonMajor: 2,
                renpyMajor: 6,
                pickleProtocol: 2,
                confidence: "medium",
            });
        } catch {
            return null;
        }
    }

    /**
     * Placeholder for future RPA-based detection.
     * Currently returns null because RPYC files provide the strongest signals.
     */
    private static async detectFromRPABuffer(_buffer: Buffer): Promise<RuntimeClassification | null> {
        return null;
    }

    private static classify(info: Partial<RuntimeClassification>): RuntimeClassification {
        const runtime: RuntimeClassification = {
            format: (info?.format as RuntimeClassification["format"]) || "UNKNOWN",
            pythonMajor: typeof info?.pythonMajor === "number" ? info.pythonMajor : 0,
            renpyMajor: info?.renpyMajor ?? "unknown",
            pickleProtocol: typeof info?.pickleProtocol === "number" ? info.pickleProtocol : -1,
            scriptVersion: typeof info?.scriptVersion === "number" ? info.scriptVersion : null,
            hasInitOffset: Boolean(info?.hasInitOffset),
            confidence: (info?.confidence as RuntimeConfidence) || "low",
            build: info?.build ?? null,
            notes: Array.isArray(info?.notes) ? [...info.notes] : [],
            label: "",
        };

        const { format, pythonMajor, scriptVersion, hasInitOffset, pickleProtocol } = runtime;

        if (format === "RPC1") {
            runtime.renpyMajor = 6;
            runtime.label = "Ren'Py <= 6.17 (legacy RPC1)";
            runtime.notes.push("RPC1 header (pre-6.18 format)");
        } else if (format === "RPC2" && pythonMajor >= 3) {
            runtime.renpyMajor = 8;
            runtime.label = "Ren'Py 8.x (Python 3)";
            runtime.notes.push("RPC2 header");
            if (pickleProtocol >= 0) {
                runtime.notes.push(`Pickle protocol v${pickleProtocol} (Python 3)`);
            }
        } else if (format === "RPC2") {
            runtime.renpyMajor = 6;
            runtime.label = "Ren'Py 6.x (Python 2)";
            runtime.notes.push("RPC2 header");

            if (typeof scriptVersion === "number") {
                runtime.notes.push(`script_version=${scriptVersion}`);
                if (scriptVersion >= 7000000) {
                    runtime.renpyMajor = 7;
                    runtime.label = "Ren'Py 7.x (Python 2)";
                } else if (scriptVersion >= 6000000) {
                    runtime.renpyMajor = "6.99";
                    runtime.label = "Ren'Py 6.99.x (Python 2)";
                } else if (scriptVersion >= 5000000) {
                    runtime.label = "Ren'Py 6.18–6.98 (Python 2)";
                }
            }

            if (pickleProtocol >= 0) {
                runtime.notes.push(`Pickle protocol v${pickleProtocol} (Python 2)`);
            }
            if (hasInitOffset) {
                runtime.notes.push("init offset statements detected");
            }
        } else {
            runtime.label = "Unknown runtime";
            runtime.notes.push("Unrecognized RPYC format");
        }

        if (runtime.build) {
            runtime.notes.push(`build=${runtime.build}`);
        }

        return runtime;
    }
}
