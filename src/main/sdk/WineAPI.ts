// WineAPI.ts - TypeScript API for Wine setup and execution

import { ChildProcess, spawn } from "child_process";
import * as os from "os";
import * as path from "path";
import DDLCModTemplate2Format from "../mod/mappers/DDLCModTemplate2Format";

/**
 * Ensures Wine is downloaded, verified, and extracted.
 */
export async function ensureWine(): Promise<void> {
  await DDLCModTemplate2Format.ensureWine();
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
      return resolve("Unknown");
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
