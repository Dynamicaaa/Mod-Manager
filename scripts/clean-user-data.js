#!/usr/bin/env node
const { platform, homedir } = require("os");
const path = require("path");
const fs = require("fs-extra");
const pkg = require("../package.json");

const productName = pkg.productName || pkg.name || "Mod-Manager";
const appDataRoot = resolveAppDataRoot();
const candidateNames = buildCandidateNames(productName, pkg.name);
const userDataCandidates = candidateNames.map((name) => path.join(appDataRoot, name));
const legacyPaths = buildLegacyPaths(candidateNames);

async function main() {
    const targets = [
        ...userDataCandidates,
        ...legacyPaths,
        ...userDataCandidates.map((candidate) => path.join(candidate, "GameData")),
    ];
    const uniqueTargets = Array.from(new Set(targets.filter(Boolean)));

    if (uniqueTargets.length === 0) {
        console.log("No user data paths resolved.");
        return;
    }

    let removedCount = 0;

    for (const target of uniqueTargets) {
        try {
            if (await fs.pathExists(target)) {
                await fs.remove(target);
                console.log(`Removed ${target}`);
                removedCount += 1;
            }
        } catch (error) {
            console.error(`Failed to remove ${target}: ${error.message}`);
        }
    }

    if (removedCount === 0) {
        console.log("No user data directories found.");
    }
}

function resolveAppDataRoot() {
    const plat = platform();
    if (plat === "darwin") {
        return path.join(homedir(), "Library", "Application Support");
    }
    if (plat === "win32") {
        return process.env.APPDATA || path.join(homedir(), "AppData", "Roaming");
    }
    return process.env.XDG_CONFIG_HOME || path.join(homedir(), ".config");
}

function buildLegacyPaths(appName) {
    const plat = platform();
    const candidates = new Set();
    const appData = resolveAppDataRoot();

    // Alternate Electron naming variations
    const packageName = pkg.name || "doki-doki-mod-manager";
    candidates.add(path.join(appData, packageName));

    for (const name of appName) {
        candidates.add(path.join(appData, name));
    }

    // Historical folder names
    if (plat === "darwin") {
        candidates.add(path.join(homedir(), "Library", "Application Support", "Mod-Manager"));
        candidates.add(path.join(homedir(), "Library", "Application Support", "DokiDokiModManager"));
    } else if (plat === "win32") {
        const roaming = process.env.APPDATA || path.join(homedir(), "AppData", "Roaming");
        candidates.add(path.join(roaming, "Mod-Manager"));
        candidates.add(path.join(roaming, "DokiDokiModManager"));
    } else {
        const configHome = process.env.XDG_CONFIG_HOME || path.join(homedir(), ".config");
        candidates.add(path.join(configHome, "Mod-Manager"));
        candidates.add(path.join(configHome, "DokiDokiModManager"));
    }

    return Array.from(candidates);
}

function buildCandidateNames(...names) {
    const variants = new Set();

    for (const rawName of names) {
        if (!rawName || typeof rawName !== "string") {
            continue;
        }

        const name = rawName.trim();
        if (!name) continue;

        const dashed = name.replace(/\s+/g, "-");
        const underscored = name.replace(/\s+/g, "_");
        const collapsed = name.replace(/\s+/g, "");
        const alnumCollapsed = name.replace(/[^A-Za-z0-9]+/g, "");
        const alnumDashed = name.replace(/[^A-Za-z0-9]+/g, "-");
        const alnumUnderscored = name.replace(/[^A-Za-z0-9]+/g, "_");

        const collected = [
            name,
            name.toLowerCase(),
            name.toUpperCase(),
            dashed,
            dashed.toLowerCase(),
            underscored,
            underscored.toLowerCase(),
            collapsed,
            collapsed.toLowerCase(),
            alnumCollapsed,
            alnumCollapsed.toLowerCase(),
            alnumDashed,
            alnumDashed.toLowerCase(),
            alnumUnderscored,
            alnumUnderscored.toLowerCase(),
        ];

        collected.forEach((variant) => {
            if (variant) {
                variants.add(variant);
            }
        });
    }

    // Always include a default fallback
    variants.add("Mod-Manager");
    variants.add("mod-manager");
    variants.add("ModManager");
    variants.add("modmanager");

    return Array.from(variants);
}

main().catch((error) => {
    console.error("Unexpected error while cleaning user data:", error);
    process.exitCode = 1;
});
