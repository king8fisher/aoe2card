import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import dataSrc from "../src/data/json/data.json" with { type: "json" };
import stringsSrc from "../src/data/json/strings.json" with { type: "json" };
import { ICivData } from "../src/data/model.ts";
import { BuildingElement, Data } from "../src/data/types/data_json_types.ts";
import { Strings } from "../src/data/types/strings_json_types.ts";
import { isGraphicsMagickInPath } from "./utils.ts";

const data = dataSrc as Data;
const strings = stringsSrc as Strings;

const _cachedAllCivs: ICivData[] = [];

export const getAllCivs = (): ICivData[] => {
  if (_cachedAllCivs.length > 0) {
    return _cachedAllCivs;
  }
  Object.entries(data.civ_names).forEach((v, _k) => {
    // {key: internal_name, value: strings_localized_value}
    const help = strings[data.civ_helptexts[v[0]]];
    _cachedAllCivs.push({
      key: v[0],
      value: strings[v[1]],
      help: help,
    });
  });
  return _cachedAllCivs;
};

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
      const el = data.data.units[u]
      unitsIds.push(el.ID)
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
const cDir = path.normalize(`${__dirname}/c`);
const cDirDest = path.normalize(`${__dirname}/../public/c`);
const dirManual = path.normalize(`${__dirname}/manual`);
const uDirManual = path.normalize(`${__dirname}/manual/u`);

const uniqueUnitIDs: Set<number> = new Set();

getAllCivUnits(null).forEach((c) => uniqueUnitIDs.add(c))

// getAllCivs().forEach((c) => {
//   getAllCivUnits(c.key).forEach((u) => uniqueUnitIDs.add(u));
// });

async function taskGetUnitImgs() {
  const getUnitImgUrl = (unitId: number) =>
    `https://aoe2techtree.net/img/Units/${unitId}.png`;

  rmDir(uDir);
  makeDir(uDir);

  async function getImgs() {
    for (const id of uniqueUnitIDs) {
      const response = await fetch(getUnitImgUrl(id));
      if (response.status == 200 && response.body) {
        // Image will be stored at this path
        const normalizedPath = path.normalize(`${uDir}/${id}.png`);
        const filePath = await Deno.open(normalizedPath, { create: true, write: true });
        await response.body.pipeTo(filePath.writable);
      } else {
        console.log({ op: "taskGetUnitImgs", id, status: response.status });
      }
    }
  }
  await getImgs();
}

async function taskRemoveBlackFromUnitImgs() {
  rmDir(`${uDir}/a`);
  makeDir(`${uDir}/a`);
  for await (const entry of Deno.readDir(uDir)) {
    if (entry.isFile) {
      console.log('converting', entry.name)
      const cmd = new Deno.Command(`cmd.exe`, {
        args: [`/c`, `gm.exe convert ${path.join(uDir, entry.name)} -fuzz 5% -transparent #000 ${path.join(uDir, "a", entry.name)}`]
      })
      const _ = cmd.outputSync()
    }
  }
}

async function taskFillAlphaAsRgbAndRemoveBlackFromUnitImgs() {
  rmDir(`${uDirManual}`);
  makeDir(`${uDirManual}`);
  makeDir(`${uDirManual}/a`);
  for await (const entry of Deno.readDir(dirManual)) {
    if (entry.isFile) {
      console.log('converting', entry.name)
      const cmd = new Deno.Command(`cmd.exe`, {
        args: [`/c`, `gm.exe convert ${path.join(dirManual, entry.name)} -background #014e92 -flatten ${path.join(uDirManual, entry.name)}`]
      }
      );
      const _ = cmd.outputSync()
      const cmd1 = new Deno.Command(`cmd.exe`, {
        args: [`/c`, `gm.exe convert ${path.join(uDirManual, entry.name)} -fuzz 5% -transparent #000 ${path.join(uDirManual, "a", entry.name)}`],
      }
      )
      const __ = cmd1.outputSync()
    }
  };
}


async function taskGetCivsImgs() {
  const getCivImgUrl = (civKey: string) =>
    `https://aoe2techtree.net/img/Civs/${civKey.toLowerCase()}.png`;

  rmDir(cDir);
  makeDir(cDir);

  async function getImgs() {
    for (const c of getAllCivs()) {
      const response = await fetch(getCivImgUrl(c.key));
      if (response.status == 200 && response.body) {
        // Image will be stored at this path
        const normalizedPath = path.join(cDir, `${c.key}.png`);
        const filePath = await Deno.open(normalizedPath, { create: true, write: true });
        await response.body.pipeTo(filePath.writable);
      } else {
        console.log({ key: c.key, status: response.status });
      }
    };
  }
  await getImgs();
}

async function copyDirectory(srcDir: string, destDir: string) {
  // Ensure the destination directory exists
  await Deno.mkdir(destDir, { recursive: true });

  for await (const entry of Deno.readDir(srcDir)) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory) {
      // Recursively copy the subdirectory
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile) {
      // Copy the file
      await Deno.copyFile(srcPath, destPath);
      console.log(`Copied file: ${srcPath} -> ${destPath}`);
    } else if (entry.isSymlink) {
      // Handle symbolic links if necessary
      const target = await Deno.readLink(srcPath);
      await Deno.symlink(target, destPath);
      console.log(`Copied symlink: ${srcPath} -> ${destPath}`);
    }
  }
}

async function taskMoveAllUnitImgs() {
  rmDir(uDirDest);
  await copyDirectory(uDir, uDirDest)
  //await copyDirectory(path.join(uDir, "a"), path.join(uDirDest, "a"))
  // This sequence. Since we may overwrite some images
  await copyDirectory(path.join(uDirManual), uDirDest)
  //await copyDirectory(path.join(uDirManual, "a"), path.join(uDirDest, "a"))
}

async function taskMoveCivsImgs() {
  rmDir(cDirDest);
  await copyDirectory(cDir, cDirDest)
}

function rmDir(dir: string) {
  if (fs.existsSync(dir)) {
    try {
      Deno.removeSync(dir, { recursive: true })
    } catch (err) {
      console.log(`${dir}: error deleting`, err);
      Deno.exit(-1);
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
}

async function taskBatchRemoteCivsImgs() {
  await taskGetCivsImgs();
  await taskMoveCivsImgs();
}

async function taskBatchManualUnitsImgs() {
  // manual -> manual/u
  await taskFillAlphaAsRgbAndRemoveBlackFromUnitImgs()
}

async function main() {
  if (!isGraphicsMagickInPath()) throw "This tasks requires GraphicsMagick (gm or gm.exe) in the PATH";
  console.log({ uDir, uDirDest, cDir, cDirDest, dirManual, uDirManual })
  await taskBatchRemoteUnitsImgs();
  await taskBatchManualUnitsImgs()
  await taskMoveAllUnitImgs()
  await taskBatchRemoteCivsImgs();
}

await main()

// pnpm run task-get-images