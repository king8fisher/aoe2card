import { execSync } from 'node:child_process';
import fs from "node:fs";

/**
 * Checks if GraphicsMagick (gm or gm.exe) is available in the system PATH.
 * @returns boolean
 */
export function isGraphicsMagickAvailable(): boolean {
  const command = process.platform === "win32" ? "gm.exe" : "gm";
  try {
    execSync(`${command} -version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function isDenoAvailable(): boolean {
  try {
    execSync(`deno -version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function cmd(cmds: string[]) {
  execSync(cmds.join(" "), { stdio: "inherit" });
}
