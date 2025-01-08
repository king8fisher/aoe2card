import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dataSrc from "../src/data/json/data.json" with { type: "json" };
import stringsSrc from "../src/data/json/strings.json" with { type: "json" };
import { allTechs, getAllCivs, ICivData, type TechWithSource } from "../src/data/model.ts";
import { BuildingElement, Data } from "../src/data/types/data_json_types.ts";
import { Strings } from "../src/data/types/strings_json_types.ts";
import { fetchAndSaveBinary } from "./fetch-and-save.ts";
import { cmd, ensureDir, isGraphicsMagickInPath } from "./utils.ts";

const data = dataSrc as Data;
const strings = stringsSrc as Strings;

const _cachedCivByKey: Map<string, ICivData> = new Map();

export const civByKey = (civKey: string): ICivData => {
  if (_cachedCivByKey.has(civKey)) {
    return _cachedCivByKey.get(civKey)!;
  }
  const result = {
    key: civKey,
    value: strings[data.civ_names[civKey]],
    help: strings[data.civ_helptexts[civKey]],
  };
  _cachedCivByKey.set(civKey, result);
  return result;
};

export const getAllCivUnits = (civKey: string | null): number[] => {
  const unitsIds: number[] = [];

  if (civKey == null) {
    for (const u in data.data.units) {
      const el = data.data.units[u];
      unitsIds.push(el.ID);
    }
    return unitsIds;
  }

  const civ_ = civByKey(civKey);
  if (civ_ == null) return [];

  data.techtrees[civKey].units.map((el: BuildingElement) => {
    unitsIds.push(el.id);
  });

  return [
    ...unitsIds,
    data.techtrees[civKey].unique.imperialAgeUniqueUnit,
    data.techtrees[civKey].unique.castleAgeUniqueUnit,
  ];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uDir = path.normalize(`${__dirname}/u`);
const uDirDest = path.normalize(`${__dirname}/../public/u`);
const techsDir = path.normalize(`${__dirname}/t`);
const techsDirDest = path.normalize(`${__dirname}/../public/t`);
const cDir = path.normalize(`${__dirname}/c`);
const cDirDest = path.normalize(`${__dirname}/../public/c`);
const dirManual = path.normalize(`${__dirname}/manual`);
const uDirManual = path.normalize(`${__dirname}/manual/u`);

const uniqueUnitIDs: Set<number> = new Set();

getAllCivUnits(null).forEach((c) => uniqueUnitIDs.add(c));

// getAllCivs().forEach((c) => {
//   getAllCivUnits(c.key).forEach((u) => uniqueUnitIDs.add(u));
// });

async function taskGetUnitImgs() {
  rmDir(uDir);
  makeDir(uDir);
  await _taskGetImgs(
    uniqueUnitIDs,
    (stuffId) => `https://aoe2techtree.net/img/Units/${stuffId}.png`,
    (stuffId) => path.normalize(`${uDir}/${stuffId}.png`),
  );
}

async function taskGetTechsImgs() {
  rmDir(techsDir);
  makeDir(techsDir);
  const techs = allTechs();
  await _taskGetImgs(
    techs.filter(v => v.source == "regular").map(v => v.ID),
    (stuffId) => `https://aoe2techtree.net/img/Techs/${stuffId}.png`,
    (stuffId) => path.normalize(`${techsDir}/${stuffId}.png`),
  );
  // Unique tech icons
  // 
  // unique_tech_1.png -> ut1.png
  // unique_tech_2.png -> ut2.png
  await _taskGetImgs(
    ["unique_tech_1", "unique_tech_2"],
    (stuffId) => `https://aoe2techtree.net/img/Techs/${stuffId}.png`,
    (stuffId) => path.normalize(`${techsDir}/ut${stuffId.toString().slice(-1)}.png`),
  );
}

async function _taskGetImgs(listOfStuff: Array<string | number> | Set<number>,
  sourcePath: (stuffId: string | number) => string,
  destinationPath: (stuffId: string | number) => string
) {
  async function getImgs() {
    for (const id of listOfStuff) {
      try {
        fetchAndSaveBinary(sourcePath(id), destinationPath(id));
      } catch (err) {
        console.error(new Error("taskGetUnitImgs", { cause: err }));
      }
    }
  }
  await getImgs();
}

async function taskRemoveBlackFromUnitImgs() {
  rmDir(`${uDir}/a`);
  makeDir(`${uDir}/a`);
  for (const entry of fs.readdirSync(uDir, { withFileTypes: true }))
    if (entry.isFile()) {
      console.log('converting', entry.name);
      cmd([`cmd.exe`, `/c`, `gm.exe convert ${path.join(uDir, entry.name)} -fuzz 5% -transparent #000 ${path.join(uDir, "a", entry.name)}`]);
    }
}

async function taskFillAlphaAsRgbAndRemoveBlackFromUnitImgs() {
  rmDir(`${uDirManual}`);
  makeDir(`${uDirManual}`);
  makeDir(`${uDirManual}/a`);
  for (const entry of fs.readdirSync(dirManual, { withFileTypes: true }))
    if (entry.isFile()) {
      console.log('converting', entry.name);
      cmd([`cmd.exe`, `/c`, `gm.exe convert ${path.join(dirManual, entry.name)} -background #014e92 -flatten ${path.join(uDirManual, entry.name)}`]);
      cmd([`cmd.exe`, `/c`, `gm.exe convert ${path.join(uDirManual, entry.name)} -fuzz 5% -transparent #000 ${path.join(uDirManual, "a", entry.name)}`]);
    }
};

async function taskGetCivsImgs() {
  const getCivImgUrl = (civKey: string) =>
    `https://aoe2techtree.net/img/Civs/${civKey.toLowerCase()}.png`;

  rmDir(cDir);
  makeDir(cDir);

  async function getImgs() {
    for (const c of getAllCivs()) {
      try {
        fetchAndSaveBinary(getCivImgUrl(c.key), path.join(cDir, `${c.key}.png`));
      } catch (err) {
        console.error(new Error(`key ${c.key}`, { cause: err }));
      }
    };
  }
  await getImgs();
}

async function copyDirectory(srcDir: string, destDir: string) {
  ensureDir(destDir);

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy the subdirectory
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      // Handle symbolic links if necessary
      const target = fs.readlinkSync(srcPath);
      fs.symlinkSync(target, destPath);
      console.log(`Copied symlink: ${srcPath} -> ${destPath}`);
    }
  }
}

async function taskMoveAllUnitImgs() {
  rmDir(uDirDest);
  await copyDirectory(uDir, uDirDest);
  // This sequence. Since we may overwrite some images
  await copyDirectory(path.join(uDirManual), uDirDest);
}

async function taskMoveAllTechsImgs() {
  rmDir(techsDirDest);
  await copyDirectory(techsDir, techsDirDest);
}

async function taskMoveCivsImgs() {
  rmDir(cDirDest);
  await copyDirectory(cDir, cDirDest);
}

function rmDir(dir: string) {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (err) {
      console.log(`${dir}: error deleting`, err);
      process.exit(-1);
    }
  }
}

function makeDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

async function taskBatchRemoteUnitsImgs() {
  await taskGetUnitImgs();
  await taskRemoveBlackFromUnitImgs();
  await taskMoveAllUnitImgs();
}

async function taskBatchRemoteTechsImgs() {
  await taskGetTechsImgs();
  await taskMoveAllTechsImgs();
}

async function taskBatchRemoteCivsImgs() {
  await taskGetCivsImgs();
  await taskMoveCivsImgs();
}

async function taskBatchManualUnitsImgs() {
  // manual -> manual/u
  await taskFillAlphaAsRgbAndRemoveBlackFromUnitImgs();
}

async function main() {
  if (!isGraphicsMagickInPath()) throw "This tasks requires GraphicsMagick (gm or gm.exe) in the PATH";
  console.log({ uDir, uDirDest, cDir, cDirDest, dirManual, uDirManual, techsDir, techsDirDest });
  // await taskBatchRemoteUnitsImgs();
  // await taskBatchManualUnitsImgs();
  // await taskBatchRemoteCivsImgs();
  await taskBatchRemoteTechsImgs();
}

await main();

// pnpm run task-get-images