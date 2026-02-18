import { mkdir, rm, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, "..");
const srcDir = join(rootDir, "src");
const distDir = join(rootDir, "dist");

const isWatch = process.argv.includes("--watch");

async function copyStatic() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  await Promise.all([
    copyFile(join(srcDir, "manifest.json"), join(distDir, "manifest.json")),
    copyFile(join(srcDir, "popup.html"), join(distDir, "popup.html")),
    copyFile(join(srcDir, "popup.css"), join(distDir, "popup.css")),
  ]);

  // Copy icons folder recursively
  const srcIcons = join(srcDir, "icons");
  const distIcons = join(distDir, "icons");
  async function copyDir(src, dest) {
    await mkdir(dest, { recursive: true });
    const entries = await (await import('node:fs/promises')).readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  }
  await copyDir(srcIcons, distIcons);
}

async function buildOnce() {
  await copyStatic();

  await esbuild.build({
    entryPoints: [join(srcDir, "popup.js")],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["chrome114", "edge114"],
    outfile: join(distDir, "popup.js"),
    sourcemap: true,
    minify: false
  });
}

if (!isWatch) {
  await buildOnce();
  process.exit(0);
}

const ctx = await esbuild.context({
  entryPoints: [join(srcDir, "popup.js")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["chrome114", "edge114"],
  outfile: join(distDir, "popup.js"),
  sourcemap: true,
  minify: false
});

await buildOnce();
await ctx.watch();

// Keep process alive for watch mode
// eslint-disable-next-line no-constant-condition
while (true) {
  // eslint-disable-next-line no-await-in-loop
  await new Promise((r) => setTimeout(r, 1_000_000));
}

