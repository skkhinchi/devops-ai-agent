/**
 * Launches the Next.js CLI without relying on node_modules/.bin/next
 * (fixes "next: command not found" when .bin links are missing or broken).
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let pkgDir;
try {
  pkgDir = path.dirname(require.resolve("next/package.json"));
} catch {
  console.error(
    "Could not find the 'next' package. From the frontend folder run:\n  npm install\n"
  );
  process.exit(1);
}

const candidates = [
  path.join(pkgDir, "dist", "bin", "next"),
  path.join(pkgDir, "dist", "bin", "next.js"),
];

const bin = candidates.find((p) => fs.existsSync(p));
if (!bin) {
  console.error(
    "Next CLI not found under",
    pkgDir,
    "\nTry: rm -rf node_modules && npm install"
  );
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  [bin, ...process.argv.slice(2)],
  { stdio: "inherit" }
);
process.exit(result.status ?? 1);
