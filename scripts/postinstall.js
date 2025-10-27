const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const filesNeedingBomStrip = collectPackageJsonFiles();

function collectPackageJsonFiles() {
  const nodeModulesDir = path.join(projectRoot, "node_modules");
  const results = [];

  if (!fs.existsSync(nodeModulesDir)) {
    return results;
  }

  const entries = fs.readdirSync(nodeModulesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (entry.name.startsWith("@")) {
      const scopeDir = path.join(nodeModulesDir, entry.name);
      const scopedPackages = fs.readdirSync(scopeDir, { withFileTypes: true });
      for (const scopedPackage of scopedPackages) {
        if (!scopedPackage.isDirectory()) {
          continue;
        }

        const pkgJson = path.join(scopeDir, scopedPackage.name, "package.json");
        if (fs.existsSync(pkgJson)) {
          results.push(pkgJson);
        }
      }
    } else {
      const pkgJson = path.join(nodeModulesDir, entry.name, "package.json");
      if (fs.existsSync(pkgJson)) {
        results.push(pkgJson);
      }
    }
  }

  return results;
}

function stripBom(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const content = fs.readFileSync(filePath, "utf8");
  if (content.length === 0) {
    return false;
  }

  if (content.charCodeAt(0) === 0xfeff) {
    fs.writeFileSync(filePath, content.slice(1), "utf8");
    return true;
  }

  return false;
}

async function runElectronBuilderInstall() {
  await new Promise((resolve, reject) => {
    const child = spawn("npx", ["electron-builder", "install-app-deps"], {
      cwd: projectRoot,
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`electron-builder exited with code ${code}`));
      }
    });
  });
}

async function main() {
  let fixedAny = false;
  for (const file of filesNeedingBomStrip) {
    try {
      if (stripBom(file)) {
        fixedAny = true;
        console.log(`Removed UTF-8 BOM from ${path.relative(projectRoot, file)}`);
      }
    } catch (err) {
      console.warn(`Warning: unable to process ${file}: ${err.message}`);
    }
  }

  if (fixedAny) {
    console.log("BOM stripping complete.");
  }

  await runElectronBuilderInstall();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
