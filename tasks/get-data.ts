import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchAndSaveBinary } from "./fetch-and-save";
import { cmd, ensureDir } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDataJsonDir = path.normalize(`${__dirname}/../src/data/json`);

const sources =
  [
    { relativeOutputPath: "data.json", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/data.json" },
    { relativeOutputPath: "strings.json", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/locales/en/strings.json" },
    { relativeOutputPath: "units_buildings_techs.json", url: "https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.json" },
    // // { relativeOutputPath: "units_buildings_techs.json-LICENSE", url: "https://raw.githubusercontent.com/HSZemi/aoe2dat/master/LICENSE", skipFormatting: true },
    { relativeOutputPath: "data.json-LICENSE", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/LICENSE", skipFormatting: true },
    { relativeOutputPath: "strings.json-LICENSE", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/LICENSE", skipFormatting: true },
    { relativeOutputPath: "./js/aoe2techtree/main.js", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/js/main.js" },
    { relativeOutputPath: "./js/aoe2techtree/techtree.js", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/js/techtree.js" },
    { relativeOutputPath: "./js/aoe2techtree/LICENSE", url: "https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/refs/heads/master/LICENSE", skipFormatting: true },
  ];

for (const source of sources) {
  const url = source.url;
  const outputPath = path.normalize(path.join(srcDataJsonDir, source.relativeOutputPath));

  ensureDir(path.dirname(outputPath));

  try {
    await fetchAndSaveBinary(url, outputPath);
    if (!source.skipFormatting) {
      cmd(["deno", "fmt", "--quiet", outputPath]);
    }
    console.log(outputPath);
  } catch (err: unknown) {
    console.error(err);
  }
}

// pnpm run task-get-data