// DDLC Mod Template 2.0 Mapper
import { ModMapper } from "../ModMapper";

/**
 * DDLC Mod Template 2.0
 * Detection: Recognized if a mod zip contains any .py or .sh file NOT named DDLC.py or DDLC.sh.
 * Extraction: Extracts and overwrites every file and directory from the mod zip, without skipping or ignoring anything.
 */
export default class DDLCModTemplate2Format extends ModMapper {
    public mapFile(path: string): string {
        // Extract and overwrite every file and directory, no filtering.
        return path;
    }

    public getFriendlyName(): string {
        return "DDLC Mod Template 2.0";
    }
    /**
     * Ensures Wine is downloaded, verified, and extracted for DDLC Mod Template 2.0 on Linux.
     */
    public static async ensureWine(): Promise<void> {
        if (process.platform !== "linux") return;

        const fs = await import("fs-extra");
        const os = await import("os");
        const path = await import("path");
        const crypto = await import("crypto");
        const https = await import("https");
        const tar = await import("tar");

        const wineUrl = "https://github.com/Kron4ek/Wine-Builds/releases/download/10.11/wine-10.11-amd64.tar.xz";
        const expectedSha256 = "a69bd422aed47c8d6c950ad08eab48c9e5425927398e3d03e120a7d7d3f97c6c";
        const homeDir = os.homedir();
        const wineDir = path.join(homeDir, ".config", "DokiDokiModManager", "wine");
        const wineBin = path.join(wineDir, "bin", "wine");
        const tmpFile = path.join(os.tmpdir(), "wine-10.11-amd64.tar.xz");

        // If wine binary exists, skip (optional: verify version)
        if (await fs.pathExists(wineBin)) {
            console.debug("[Wine] Wine binary already exists at", wineBin, "- skipping download.");
            return;
        }

        console.debug("[Wine] Downloading Wine tarball from", wineUrl, "to", tmpFile);

        // Download Wine tarball with redirect support
        const urlModule = await import("url");
        async function downloadWithRedirects(urlStr: string, dest: string, redirectsLeft = 5): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                const file = fs.createWriteStream(dest);
                const request = https.get(urlStr, response => {
                    if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                        // Handle redirect
                        file.close();
                        if (redirectsLeft === 0) {
                            reject(new Error("Too many redirects while downloading Wine."));
                            return;
                        }
                        const redirectUrl = urlModule.resolve(urlStr, response.headers.location);
                        console.debug("[Wine] Redirecting to", redirectUrl);
                        downloadWithRedirects(redirectUrl, dest, redirectsLeft - 1).then(resolve, reject);
                        return;
                    }
                    if (response.statusCode !== 200) {
                        reject(new Error("Failed to download Wine: " + response.statusCode));
                        return;
                    }
                    response.pipe(file);
                    file.on("finish", () => {
                        console.debug("[Wine] Finished downloading Wine tarball.");
                        file.close(err => err ? reject(err) : resolve());
                    });
                    file.on("error", reject);
                });
                request.on("error", reject);
            });
        }
        await downloadWithRedirects(wineUrl, tmpFile);

        console.debug("[Wine] Verifying SHA256 of downloaded tarball...");
        // Verify SHA256
        const hash = crypto.createHash("sha256");
        await new Promise<void>((resolve, reject) => {
            const stream = fs.createReadStream(tmpFile);
            stream.on("data", chunk => hash.update(chunk));
            stream.on("end", () => {
                const digest = hash.digest("hex");
                if (digest !== expectedSha256) {
                    console.error("[Wine] SHA256 mismatch! Expected:", expectedSha256, "Got:", digest);
                    reject(new Error("Wine SHA256 mismatch"));
                } else {
                    console.debug("[Wine] SHA256 verified.");
                    resolve();
                }
            });
            stream.on("error", reject);
        });

        // Decompress tar.xz to tar using lzma-native
        await fs.ensureDir(wineDir);
        const lzma = await import("lzma-native");
        const tmpTarFile = tmpFile.replace(/\.xz$/, "");

        console.debug("[Wine] Decompressing tar.xz to tar:", tmpFile, "->", tmpTarFile);
        try {
            await new Promise<void>((resolve, reject) => {
                const input = fs.createReadStream(tmpFile);
                const output = fs.createWriteStream(tmpTarFile);
                const decompress = lzma.createDecompressor();

                input.pipe(decompress).pipe(output);

                output.on("finish", () => {
                    console.debug("[Wine] Decompression finished.");
                    resolve();
                });
                output.on("error", reject);
                decompress.on("error", reject);
                input.on("error", reject);
            });
        } catch (err) {
            console.error("[Wine] Failed to decompress Wine tar.xz:", (err as Error).message);
            throw new Error("Failed to decompress Wine tar.xz: " + (err as Error).message);
        }

        // Extract tar archive
        console.debug("[Wine] Extracting tar archive to", wineDir);
        try {
            await tar.x({
                file: tmpTarFile,
                cwd: wineDir,
                strip: 1 // Remove top-level directory
            });
            console.debug("[Wine] Extraction complete.");
        } catch (err) {
            console.error("[Wine] Failed to extract Wine tar archive:", (err as Error).message);
            throw new Error("Failed to extract Wine tar archive: " + (err as Error).message);
        }

        // Clean up temp files
        console.debug("[Wine] Cleaning up temporary files.");
        await fs.remove(tmpFile);
        await fs.remove(tmpTarFile);
        console.debug("[Wine] Wine setup complete.");
    }
}