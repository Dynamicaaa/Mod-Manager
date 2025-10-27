// WineAPI.ts - TypeScript API for Wine setup and execution

import { ChildProcess, spawn } from "child_process";
import * as os from "os";
import * as path from "path";
/**
 * Ensures Wine is downloaded, verified, and extracted.
 */
export async function ensureWine(): Promise<void> {
  if (process.platform !== "linux") return;

  const fs = await import("fs-extra");
  const osModule = await import("os");
  const pathModule = await import("path");
  const crypto = await import("crypto");
  const https = await import("https");
  const tar = await import("tar");

  const wineUrl = "https://github.com/Kron4ek/Wine-Builds/releases/download/10.11/wine-10.11-amd64.tar.xz";
  const expectedSha256 = "a69bd422aed47c8d6c950ad08eab48c9e5425927398e3d03e120a7d7d3f97c6c";
  const homeDir = osModule.homedir();
  const wineDir = pathModule.join(homeDir, ".config", "DokiDokiModManager", "wine");
  const wineBin = pathModule.join(wineDir, "bin", "wine");
  const tmpFile = pathModule.join(osModule.tmpdir(), "wine-10.11-amd64.tar.xz");

  if (await fs.pathExists(wineBin)) {
    console.debug("[Wine] Wine binary already exists at", wineBin, "- skipping download.");
    return;
  }

  console.debug("[Wine] Downloading Wine tarball from", wineUrl, "to", tmpFile);

  const urlModule = await import("url");
  async function downloadWithRedirects(urlStr: string, dest: string, redirectsLeft = 5): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      const request = https.get(urlStr, response => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
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
          file.close(err => (err ? reject(err) : resolve()));
        });
        file.on("error", reject);
      });
      request.on("error", reject);
    });
  }

  await downloadWithRedirects(wineUrl, tmpFile);

  console.debug("[Wine] Verifying SHA256 of downloaded tarball...");
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

  await fs.ensureDir(wineDir);
  const lzma = await import("lzma-native");
  const tmpTarFile = tmpFile.replace(/\.xz$/, "");

  console.debug("[Wine] Decompressing tar.xz to tar:", tmpFile, "->", tmpTarFile);
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

  console.debug("[Wine] Extracting tar archive to", wineDir);
  await tar.x({
    file: tmpTarFile,
    cwd: wineDir,
    strip: 1
  });

  console.debug("[Wine] Cleaning up temporary files.");
  await fs.remove(tmpFile);
  await fs.remove(tmpTarFile);
  console.debug("[Wine] Wine setup complete.");
}

/**
 * Returns the path to the Wine binary.
 */
export function getWineBinPath(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, ".config", "DokiDokiModManager", "wine", "bin", "wine");
}

/**
 * Returns the Wine directory path.
 */
export function getWineDir(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, ".config", "DokiDokiModManager", "wine");
}

/**
 * Checks if Wine is installed (binary exists).
 */
export function isWineInstalled(): boolean {
  const fs = require("fs");
  const winePath = getWineBinPath();
  return fs.existsSync(winePath);
}

/**
 * Gets the Wine version string, or null if not installed.
 */
export function getWineVersion(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!isWineInstalled()) {
      console.warn("[Wine] getWineVersion: Wine binary not found.");
      return resolve("Not Installed");
    }
    const winePath = getWineBinPath();
    const proc = spawn(winePath, ["--version"]);
    let out = "";
    proc.stdout.on("data", (data) => { out += data.toString(); });
    proc.on("close", () => {
      const version = out.trim() || "Unknown";
      console.debug("[Wine] getWineVersion result:", version);
      resolve(version);
    });
    proc.on("error", (err: any) => {
      console.error("[Wine] getWineVersion error:", err);
      resolve("Unknown");
    });
  });
}

/**
 * Internal: Path to Wine config file.
 */
function getWineConfigPath(): string {
  return path.join(os.homedir(), ".config", "DokiDokiModManager", "wine", "wine-config.json");
}

/**
 * Gets the Wine prefix path from config, or default.
 */
export function getPrefixPath(): string {
  const fs = require("fs");
  const configPath = getWineConfigPath();
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (cfg.prefixPath) return cfg.prefixPath;
    } catch {}
  }
  // Default prefix path
  return path.join(os.homedir(), ".config", "DokiDokiModManager", "wineprefix");
}

/**
 * Sets the Wine prefix path in config.
 */
export function setPrefixPath(prefixPath: string): void {
  const fs = require("fs");
  const configPath = getWineConfigPath();
  let cfg: any = {};
  if (fs.existsSync(configPath)) {
    try { cfg = JSON.parse(fs.readFileSync(configPath, "utf8")); } catch {}
  }
  cfg.prefixPath = prefixPath;
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
}

/**
 * Gets custom Wine environment variables from config.
 */
export function getEnvVars(): Record<string, string> {
  const fs = require("fs");
  const configPath = getWineConfigPath();
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (cfg.envVars && typeof cfg.envVars === "object") return cfg.envVars;
    } catch {}
  }
  return {};
}

/**
 * Sets custom Wine environment variables in config.
 */
export function setEnvVars(vars: Record<string, string>): void {
  const fs = require("fs");
  const configPath = getWineConfigPath();
  let cfg: any = {};
  if (fs.existsSync(configPath)) {
    try { cfg = JSON.parse(fs.readFileSync(configPath, "utf8")); } catch {}
  }
  cfg.envVars = vars;
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
}

/**
 * Returns a recommended environment object for running Wine.
 * Optionally merges with provided env and uses config.
 */
export function getWineEnv(baseEnv: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const env = { ...baseEnv };
  env.WINEPREFIX = getPrefixPath();
  const customVars = getEnvVars();
  for (const k in customVars) env[k] = customVars[k];
  return env;
}

/**
 * Runs a Windows executable using Wine.
 * @param exePath Path to the .exe file
 * @param args Arguments to pass to the executable
 * @param options ChildProcess spawn options (cwd, env, etc.)
 */
export function runWithWine(
  exePath: string,
  args: string[] = [],
  options: Record<string, any> = {}
): ChildProcess {
  const winePath = getWineBinPath();
  console.debug("[Wine] Running", exePath, "with Wine at", winePath, "Args:", args, "Options:", options);
  return spawn(winePath, [exePath, ...args], options);
}
/**
 * Checks GitHub for the latest Wine build and updates if newer.
 */
export async function checkForWineUpdate(): Promise<{ updated: boolean, latestVersion: string, currentVersion: string }> {
  const https = require("https");
  const fs = require("fs");
  const pathMod = require("path");
  const tar = require("tar");
  const lzma = await import("lzma-native");

  // Get current version
  let currentVersion = "";
  try {
    const ver = await getWineVersion();
    if (ver === "Not Installed") {
      console.warn("[Wine] Wine is not installed, aborting update check.");
      return {
        updated: false,
        latestVersion: "",
        currentVersion: "Not Installed"
      };
    }
    if (ver) {
      currentVersion = ver.replace(/^wine-?/i, "").split(" ")[0];
      console.debug("[Wine] Detected current Wine version:", currentVersion);
    } else {
      console.warn("[Wine] Could not detect current Wine version, will treat as update needed.");
    }
  } catch (e) {
    console.error("[Wine] Error detecting current Wine version:", e);
  }

  // Fetch latest release from GitHub
  const apiUrl = "https://api.github.com/repos/Kron4ek/Wine-Builds/releases/latest";
  const headers = { "User-Agent": "DDMM-Wine-Updater" };
  let releaseData: any;
  try {
    releaseData = await new Promise<any>((resolve, reject) => {
      https.get(apiUrl, { headers }, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
        });
      }).on("error", reject);
    });
  } catch (e) {
    console.error("[Wine] Failed to fetch Wine releases from GitHub:", e);
    throw new Error("Failed to fetch Wine releases from GitHub.");
  }
  const tag = releaseData.tag_name || "";
  const assets = releaseData.assets || [];
  const asset = assets.find((a: any) => /wine-\d+\.\d+-amd64\.tar\.xz$/.test(a.name));
  if (!asset) {
    console.error("[Wine] No suitable Wine build found in latest release assets.");
    throw new Error("No suitable Wine build found in latest release.");
  }
  const latestVersion = (asset.name.match(/wine-(\d+\.\d+)-amd64\.tar\.xz/) || [])[1] || tag;
  console.debug("[Wine] Latest Wine version on GitHub:", latestVersion, "Asset:", asset.name);

  // Compare versions
  if (currentVersion && currentVersion === latestVersion) {
    console.debug("[Wine] Wine is already up to date.");
    return { updated: false, latestVersion, currentVersion };
  }

  // Download and extract new Wine build
  const tmpFile = pathMod.join(os.tmpdir(), asset.name);
  console.debug("[Wine] Downloading new Wine build from:", asset.browser_download_url, "to", tmpFile);
  await new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(tmpFile);
    https.get(asset.browser_download_url, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        console.debug("[Wine] Finished downloading Wine build.");
        file.close(resolve);
      });
      file.on("error", (err: any) => {
        console.error("[Wine] Error writing Wine tar.xz:", err);
        reject(err);
      });
    }).on("error", (err: any) => {
      console.error("[Wine] Error downloading Wine tar.xz:", err);
      reject(err);
    });
  });

  // Decompress tar.xz to tar
  const tmpTarFile = tmpFile.replace(/\.xz$/, "");
  console.debug("[Wine] Decompressing tar.xz to tar:", tmpFile, "->", tmpTarFile);
  await new Promise<void>((resolve, reject) => {
    const input = fs.createReadStream(tmpFile);
    const output = fs.createWriteStream(tmpTarFile);
    const decompress = lzma.createDecompressor();
    input.pipe(decompress).pipe(output);
    output.on("finish", () => {
      console.debug("[Wine] Decompression finished.");
      resolve();
    });
    output.on("error", (err: any) => {
      console.error("[Wine] Error during decompression:", err);
      reject(err);
    });
    decompress.on("error", (err: any) => {
      console.error("[Wine] Decompressor error:", err);
      reject(err);
    });
    input.on("error", (err: any) => {
      console.error("[Wine] Input stream error:", err);
      reject(err);
    });
  });

  // Extract tar archive
  const wineDir = getWineDir();
  console.debug("[Wine] Extracting tar archive to", wineDir);
  await fs.promises.mkdir(wineDir, { recursive: true });
  try {
    await tar.x({
      file: tmpTarFile,
      cwd: wineDir,
      strip: 1
    });
    console.debug("[Wine] Extraction complete.");
  } catch (e) {
    console.error("[Wine] Failed to extract Wine tar archive:", e);
    throw new Error("Failed to extract Wine tar archive: " + (e as Error).message);
  }

  // Clean up
  try {
    fs.unlinkSync(tmpFile);
    fs.unlinkSync(tmpTarFile);
    console.debug("[Wine] Cleaned up temporary files.");
  } catch (e) {
    console.warn("[Wine] Failed to clean up temp files:", e);
  }

  return { updated: true, latestVersion, currentVersion };
}
