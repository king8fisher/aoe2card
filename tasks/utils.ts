/**
 * Checks if GraphicsMagick (gm or gm.exe) is available in the system PATH.
 * @returns boolean
 */
export function isGraphicsMagickInPath(): boolean {
  const command = Deno.build.os === "windows" ? "gm.exe" : "gm";

  try {
    const cmd = new Deno.Command(command, {
      args: ["-version"]
    })
    const output = cmd.outputSync()
    return output.success
  } catch {
    // If an error occurs (e.g., command not found), return false
    return false;
  }
}

isGraphicsMagickInPath()