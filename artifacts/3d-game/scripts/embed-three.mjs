import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const projectDir = fileURLToPath(new URL("../", import.meta.url));
const htmlPath = path.join(projectDir, "index.html");
const sourcePath = path.join(
  projectDir,
  "node_modules/three/build/three.module.js",
);
const bundleStart = "<!-- THREE_VENDOR_BUNDLE_START -->";
const bundleEnd = "<!-- THREE_VENDOR_BUNDLE_END -->";

const [html, result] = await Promise.all([
  readFile(htmlPath, "utf8"),
  build({
    entryPoints: [sourcePath],
    bundle: true,
    format: "iife",
    globalName: "THREE",
    target: "es2020",
    minify: true,
    legalComments: "none",
    write: false,
  }),
]);

const startIndex = html.indexOf(bundleStart);
const endIndex = html.indexOf(bundleEnd);
if (
  startIndex === -1 ||
  endIndex === -1 ||
  html.indexOf(bundleStart, startIndex + bundleStart.length) !== -1 ||
  html.indexOf(bundleEnd, endIndex + bundleEnd.length) !== -1 ||
  endIndex < startIndex
) {
  throw new Error("Expected exactly one Three.js bundle placeholder in index.html.");
}

const vendorScript = `\n    <script>\n${result.outputFiles[0].text.trim()}\n    </script>\n    `;
const nextHtml =
  html.slice(0, startIndex + bundleStart.length) +
  vendorScript +
  html.slice(endIndex);

if (nextHtml !== html) {
  await writeFile(htmlPath, nextHtml);
}
