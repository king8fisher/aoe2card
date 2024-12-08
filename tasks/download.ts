import * as fs from "node:fs";
import * as path from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";
import dataSrc from "../src/data/json/data.json" with { type: "json" };
import stringsSrc from "../src/data/json/strings.json" with { type: "json" };
import { ICivData } from "../src/data/model.ts";
import { BuildingElement, Data } from "../src/data/types/data_json_types.ts";
import { Strings } from "../src/data/types/strings_json_types.ts";

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
const uDirManual = path.normalize(`${__dirname}/manual`);

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

  function getImgs() {
    uniqueUnitIDs.forEach(async (id) => {
      const response = await fetch(getUnitImgUrl(id));
      if (response.status == 200 && response.body) {
        // Image will be stored at this path
        const normalizedPath = path.normalize(`${uDir}/${id}.png`);
        const filePath = await Deno.open(normalizedPath, { create: true, write: true });
        await response.body.pipeTo(filePath.writable);
      } else {
        console.log({ id, status: response.status });
      }
    });
  }
  getImgs();
}

function taskRemoveBlackFromUnitImgs() {
  rmDir(`${uDir}/a`);
  makeDir(`${uDir}/a`);
  fs.readdir(uDir, function (err, files) {
    if (err) {
      return console.log(`Unable to scan ${uDir}`, err);
    }
    files.forEach(function (file) {
      const cmd = new Deno.Command(`cmd.exe`, {
        args: [`/c`, `gm.exe convert ${uDir}/${file} -fuzz 5% -transparent #000 ${uDir}/a/${file}`]
      })
      const _ = cmd.outputSync()
    });
  });
}

async function taskFillAlphaAsRgbAndRemoveBlackFromUnitImgs() {
  rmDir(`${uDirManual}/u`);
  makeDir(`${uDirManual}/u`);
  makeDir(`${uDirManual}/u/a`);
  fs.readdir(uDirManual, function (err, files) {
    if (err) {
      return console.log(`Unable to scan ${uDir}`, err);
    }
    files.forEach(async function (file) {
      const cmd = new Deno.Command(`cmd.exe`, {
        args: [`/c`, `gm.exe convert ${uDirManual}/${file} -background #014e92 -flatten ${uDirManual}/u/${file}`]
      }
      );
      const _ = cmd.outputSync()
      const cmd1 = new Deno.Command(`cmd.exe`, {
        args: [`/c`, `gm.exe convert ${uDirManual}/u/${file} -fuzz 5% -transparent #000 ${uDirManual}/u/a/${file}`],
      }
      )
      const __ = cmd1.outputSync()
    });
  });
}


async function taskGetCivsImgs() {
  const getCivImgUrl = (civKey: string) =>
    `https://aoe2techtree.net/img/Civs/${civKey.toLowerCase()}.png`;

  rmDir(cDir);
  makeDir(cDir);

  function getImgs() {
    getAllCivs().forEach(async (c) => {
      const response = await fetch(getCivImgUrl(c.key));
      if (response.status == 200 && response.body) {
        // Image will be stored at this path
        const normalizedPath = path.normalize(`${cDir}/${c.key}.png`);
        const filePath = await Deno.open(normalizedPath, { create: true, write: true });
        await response.body.pipeTo(filePath.writable);
      } else {
        console.log({ key: c.key, status: response.status });
      }
    });
  }
  getImgs();
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
  copyDirectory(uDir, uDirDest)
  copyDirectory(`${uDirManual}/u`, uDirDest)
}

async function taskMoveCivsImgs() {
  rmDir(cDirDest);
  try {
    await Deno.rename(cDir, cDirDest);
    console.log(`[✔] Civ ${cDirDest}!`);
  } catch (e) {
    console.log(`can't move ${cDir} to ${cDirDest}`, e);
  }
}

function rmDir(dir: string) {
  if (fs.existsSync(dir)) {
    try {
      fs.rmdirSync(dir, {
        recursive: true,
      });
      console.log(`${dir} deleted successfully`);
    } catch (err) {
      console.log(`${dir}: error deleting`, err);
      exit(-1);
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
  // await taskBatchRemoteUnitsImgs();
  // await taskBatchRemoteCivsImgs();
  await taskBatchManualUnitsImgs()
  await taskMoveAllUnitImgs()
}

await main()

// deno --allow-all --unstable-sloppy-imports download.ts