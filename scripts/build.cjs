/**
 * Build script for static deployment (Vercel-friendly).
 *
 * Vercel can be configured to expect an output directory like `public/`.
 * This script copies the runtime site files into `public/` so deployments
 * work consistently without moving the source structure.
 *
 * Output:
 *   public/
 *     index.html
 *     assets/
 *     styles/
 *     scripts/
 */
const fs = require("fs/promises");
const path = require("path");

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function cleanDir(dir) {
  if (await pathExists(dir)) {
    await fs.rm(dir, { recursive: true, force: true });
  }
  await fs.mkdir(dir, { recursive: true });
}

async function copyIntoPublic(rootDir, publicDir) {
  const entries = [
    { src: "index.html", dest: "index.html" },
    { src: "assets", dest: "assets" },
    { src: "styles", dest: "styles" },
    { src: "scripts", dest: "scripts" }
  ];

  const omitAssetBasenames = new Set(["FAVICON_INSTRUCTIONS.md", "generate-favicon.html"]);
  const omitScriptBasenames = new Set(["build.cjs", "generate-favicons.cjs"]);

  await Promise.all(
    entries.map(async ({ src, dest }) => {
      const from = path.join(rootDir, src);
      const to = path.join(publicDir, dest);

      if (!(await pathExists(from))) return;

      const stat = await fs.stat(from);
      if (stat.isDirectory()) {
        const filter = (sourcePath) => {
          const base = path.basename(sourcePath);
          if (src === "assets" && omitAssetBasenames.has(base)) return false;
          if (src === "scripts" && omitScriptBasenames.has(base)) return false;
          return true;
        };

        await fs.cp(from, to, { recursive: true, filter });
      } else {
        await fs.copyFile(from, to);
      }
    })
  );
}

async function main() {
  const rootDir = path.resolve(__dirname, "..");
  const publicDir = path.join(rootDir, "public");

  await cleanDir(publicDir);
  await copyIntoPublic(rootDir, publicDir);

  // eslint-disable-next-line no-console
  console.log(`Build complete: ${path.relative(rootDir, publicDir)}\\`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Build failed:", err);
  process.exitCode = 1;
});

