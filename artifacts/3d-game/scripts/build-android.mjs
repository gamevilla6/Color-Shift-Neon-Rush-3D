import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = fileURLToPath(new URL("../", import.meta.url));
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const action = process.argv[2];

if (!["sync", "build"].includes(action)) {
  throw new Error("Usage: pnpm run android:sync | pnpm run android:build");
}

const environment = {
  ...process.env,
  PORT: process.env.PORT ?? "24982",
  BASE_PATH: process.env.BASE_PATH ?? "/",
};

function runPnpm(args) {
  const result = spawnSync(pnpmCommand, args, {
    cwd: projectDir,
    env: environment,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

runPnpm(["run", "build"]);
runPnpm(["exec", "cap", "sync", "android"]);

if (action === "build") {
  runPnpm(["exec", "cap", "build", "android"]);
}
