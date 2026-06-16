import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Files owned by the starter package itself, not part of the template.
const EXCLUDED_ENTRIES = new Set([
    "node_modules",
    "package.json",
    "package-lock.json",
    "dist",
]);

export async function init(projectName) {
    if (!projectName) {
        throw new Error(
            "Missing project name. Usage: monoblogger init <project-name>"
        );
    }

    const targetDir = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
        throw new Error(
            `Target directory "${targetDir}" already exists and is not empty.`
        );
    }

    const starterManifestPath = require.resolve(
        "@monoblogger/starter/package.json"
    );
    const starterDir = path.dirname(starterManifestPath);
    const starterManifest = JSON.parse(
        fs.readFileSync(starterManifestPath, "utf8")
    );

    fs.mkdirSync(targetDir, { recursive: true });

    for (const entry of fs.readdirSync(starterDir)) {
        if (EXCLUDED_ENTRIES.has(entry)) continue;

        // npm never publishes ".gitignore" files, so the starter stores it
        // as "_gitignore" and we restore the real name here.
        const targetName = entry === "_gitignore" ? ".gitignore" : entry;

        fs.cpSync(path.join(starterDir, entry), path.join(targetDir, targetName), {
            recursive: true,
        });
    }

    const packageName = path
        .basename(targetDir)
        .toLowerCase()
        .replace(/[^a-z0-9-_.~]+/g, "-");

    const projectManifest = {
        name: packageName,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
            build: "node build.mjs",
        },
        dependencies: starterManifest.dependencies,
    };

    fs.writeFileSync(
        path.join(targetDir, "package.json"),
        JSON.stringify(projectManifest, null, 2) + "\n"
    );

    const relativeDir = path.relative(process.cwd(), targetDir) || ".";

    console.log(`\nScaffolded a new monoblogger project in ${targetDir}\n`);
    console.log("Next steps:");
    console.log(`  cd ${relativeDir}`);
    console.log("  npm install");
    console.log("  npm run build\n");
}
