import * as fs from "fs";
import { move } from "fs-extra";
import * as https from "https";
import * as path from "path";
import { exit } from "process";
import { fileURLToPath } from "url";
import { allCivUnits, allCivs } from "../src/data/model";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uDir = `${__dirname}/u`;
const uDirDest = `${__dirname}/../public/u`;
const cDir = `${__dirname}/c`;
const cDirDest = `${__dirname}/../public/c`;

const uniqueUnitIDs: Set<number> = new Set();

allCivs().forEach((c) => {
  allCivUnits(c.key).forEach((u) => uniqueUnitIDs.add(u.unit.id));
});

// await taskGetUnitImgs();
// await taskMoveUnitImgs();
await taskGetCivsImgs();

async function taskGetUnitImgs() {
  const unitImgUrl = (unitId: number) => `https://aoe2techtree.net/img/Units/${unitId}.png`;

  rmDir(uDir);
  makeDir(uDir);

  async function getImgs() {
    uniqueUnitIDs.forEach((id) => {
      new Promise<number>((resolve, reject) => {
        https.get(unitImgUrl(id), (res: any) => {
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
          console.log(`got ${id}`);
        })
        .catch((id) => {
          console.log(`error ${id}`);
        });
    });
  }
  await getImgs();
}

async function taskGetCivsImgs() {
  const civImgUrl = (civKey: string) => `https://aoe2techtree.net/img/Civs/${civKey.toLowerCase()}.png`;

  rmDir(cDir);
  makeDir(cDir);

  async function getImgs() {
    allCivs().forEach((c) => {
      new Promise<string>((resolve, reject) => {
        https.get(civImgUrl(c.key), (res: any) => {
          // Image will be stored at this path
          const path = `${cDir}/${c.key}.png`;
          const filePath = fs.createWriteStream(path);
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
  move(uDir, uDirDest, (err: any) => {
    if (err) {
      return console.log(`can't move ${uDir} to ${uDirDest}`, err);
    }
    console.log(`[✔] Units ${uDirDest}!`);
  });
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
