import { ensureFile, copy, ensureDir, move } from "@std/fs";
import { fileURLToPath } from "node:url";
import * as path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDataJsonDir = path.normalize(`${__dirname}/../src/data/json`);

const sources =
  [
    { relativeOutputPath: "data.json", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/data.json" },
    { relativeOutputPath: "strings.json", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/locales/en/strings.json" },
    { relativeOutputPath: "units_buildings_techs.json", url: "https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.json" },
    // { relativeOutputPath: "units_buildings_techs.json-LICENSE", url: "https://raw.githubusercontent.com/HSZemi/aoe2dat/master/LICENSE" },
    { relativeOutputPath: "data.json-LICENSE", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/LICENSE" },
    { relativeOutputPath: "strings.json-LICENSE", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/LICENSE" },
    { relativeOutputPath: "./js/aoe2techtree/main.js", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/js/main.js" },
    { relativeOutputPath: "./js/aoe2techtree/techtree.js", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/js/techtree.js" },
    { relativeOutputPath: "./js/aoe2techtree/LICENSE", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/LICENSE" },
  ];

for (const source of sources) {
  const url = source.url;
  const outputPath = path.normalize(path.join(srcDataJsonDir, source.relativeOutputPath));
  await ensureDir(path.dirname(outputPath));

  console.log(outputPath);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  // Read the response as text
  const data = await response.text();

  // Write the data to the specified file
  await Deno.writeTextFile(outputPath, data);

  const process = new Deno.Command("deno", {
    args: ["fmt", outputPath],
    stdout: "piped",
    stderr: "piped",
  });

  process.outputSync();
  console.log("done");


}
