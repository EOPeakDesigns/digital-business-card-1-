/**
 * Generate favicon PNGs from the source SVG.
 *
 * Why: keep `index.html` + `site.webmanifest` consistent and avoid missing-asset 404s.
 *
 * Usage:
 *   npm run favicons
 */
const fs = require("fs");
const path = require("path");

async function main() {
  let sharp;
  try {
    // Lazy require so a missing dependency produces a clean message.
    // eslint-disable-next-line global-require
    sharp = require("sharp");
  } catch {
    // eslint-disable-next-line no-console
    console.error(
      "Missing dependency: sharp. Install it with: npm i -D sharp"
    );
    process.exitCode = 1;
    return;
  }

  const rootDir = path.resolve(__dirname, "..");
  const assetsDir = path.join(rootDir, "assets");
  const inputSvgPath = path.join(assetsDir, "favicon.svg");

  if (!fs.existsSync(inputSvgPath)) {
    // eslint-disable-next-line no-console
    console.error(`Source SVG not found: ${inputSvgPath}`);
    process.exitCode = 1;
    return;
  }

  const svgBuffer = fs.readFileSync(inputSvgPath);

  const outputs = [
    { size: 16, filename: "favicon-16x16.png" },
    { size: 32, filename: "favicon-32x32.png" },
    { size: 180, filename: "apple-touch-icon.png" },
    { size: 192, filename: "android-chrome-192x192.png" },
    { size: 512, filename: "android-chrome-512x512.png" }
  ];

  await Promise.all(
    outputs.map(async ({ size, filename }) => {
      const outPath = path.join(assetsDir, filename);
      await sharp(svgBuffer)
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toFile(outPath);
    })
  );

  // eslint-disable-next-line no-console
  console.log(
    `Generated ${outputs.length} icons in ${path.relative(rootDir, assetsDir)}`
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to generate favicons:", err);
  process.exitCode = 1;
});

