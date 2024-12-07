import * as child_process from "node:child_process";
import * as fs from "node:fs";
import * as https from "node:https";
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
    uniqueUnitIDs.forEach((id) => {
      new Promise<number>((resolve, reject) => {
        https.get(getUnitImgUrl(id), (res: any) => {
          // Image will be stored at this path
          const path = `${uDir}/${id}.png`;
          const filePath = fs.createWriteStream(path);
          res.pipe(filePath);
          filePath.on("finish", () => {
            filePath.close();
            resolve(id);
          });
          filePath.on("error", (e: any) => {
            console.log(e);
            reject(id);
          });
        });
      })
        .then((id) => {
          console.log(`img for ${id}`);
        })
        .catch((id) => {
          console.log(`error ${id}`);
        });
    });
  }
  await getImgs();
}

async function taskRemoveBlackFromUnitImgs() {
  makeDir(`${uDir}/a`);
  fs.readdir(uDir, function (err, files) {
    if (err) {
      return console.log(`Unable to scan ${uDir}`, err);
    }
    files.forEach(function (file) {
      child_process.exec(
        `gm.exe convert ${uDir}/${file} -fuzz 5% -transparent "#000" ${uDir}/a/${file}`,
      );
    });
  });
}

async function taskGetCivsImgs() {
  const getCivImgUrl = (civKey: string) =>
    `https://aoe2techtree.net/img/Civs/${civKey.toLowerCase()}.png`;

  rmDir(cDir);
  makeDir(cDir);

  async function getImgs() {
    getAllCivs().forEach((c) => {
      new Promise<string>((resolve, reject) => {
        https.get(getCivImgUrl(c.key), (res: any) => {
          // Image will be stored at this path
          const normalizedPath = path.normalize(`${cDir}/${c.key}.png`);
          const filePath = fs.createWriteStream(normalizedPath);
          res.pipe(filePath);
          filePath.on("finish", () => {
            filePath.close();
            resolve(c.key);
          });
          filePath.on("error", (e: any) => {
            console.log(e);
            reject(c.key);
          });
        });
      })
        .then((id) => {
          console.log(`got ${id}`);
        })
        .catch((id) => {
          console.log(`error ${id}`);
        });
    });
  }
  await getImgs();
}

async function taskMoveUnitImgs() {
  rmDir(uDirDest);
  try {
    await Deno.rename(uDir, uDirDest);
    console.log(`[✔] Units ${uDirDest}!`);
  } catch (e) {
    console.log(`can't move ${uDir} to ${uDirDest}`, e);
  }
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

await taskGetUnitImgs();
//await taskRemoveBlackFromUnitImgs();
//await taskMoveUnitImgs();
//await taskGetCivsImgs();
//await taskMoveCivsImgs();
