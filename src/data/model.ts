import dataSrc from "./data.json";
import { Data } from "./data_json_types";
import stringsSrc from "./strings.json";
import { Strings } from "./strings_json.types";

const data = dataSrc as Data;
const strings = stringsSrc as Strings;

// This will have to be at some point converted into the dynamic json files load.

export type attackData = {
  Amount: number;
  Class: number;
};

export type armourData = {
  Amount: number;
  Class: number;
};

interface IExtractedUnitData {
  name: string;
  hp: number;
  attack: number;
  pierceArmor: number;
}

export const extractUnitDataByID = (unitId: number): IExtractedUnitData => {
  // data.data.units[561].LanguageNameId // 5458
  // strings[5458] // "Elite Mangudai"
  const d = data.data.units[unitId.toString()];

  return {
    name: strings[d.LanguageNameId],
    hp: d.HP,
    attack: d.Attack,
    pierceArmor: d.PierceArmor,
  };
};

export const unitHelpByID = (unitId: number): IUnitHelp => {
  const about: string = strings[data.data.units[unitId.toString()].LanguageHelpId] ?? "";
  return splitAbout(about);
};

const strongEnRegex = new RegExp("strong\\s+vs.\\s+([^\\.]+)\\.?", "gmiu");
const weakEnRegex = new RegExp("weak\\s+vs.\\s+([^\\.]+)\\.?", "gmiu");

const trimSuffix = (s: string, suffix: string) => {
  return s.endsWith(suffix) ? s.substring(0, s.length - suffix.length) : s;
};

const splitAbout = (about: string): IUnitHelp => {
  // Trim "Create <Unit Name> (‹cost›)" out of the "about" section
  //              |   var   |
  //              |  piece  |
  const f = about.indexOf("(‹cost›)<br>\n");
  let aboutTrimmed = about;
  if (f >= 0) aboutTrimmed = about.substring(f + 13);
  // Remove \n‹hp› ‹attack› ‹armor› ‹piercearmor› ‹range›
  // Remove \n‹hp› ‹attack› ‹armor› ‹piercearmor› ‹range› ‹garrison›
  // Remove ...
  const h = aboutTrimmed.indexOf("\n‹hp› ");
  if (h >= 0) aboutTrimmed = aboutTrimmed.substring(0, h);
  const u = aboutTrimmed.indexOf("<i> Upgrades:");
  let upgrades = "";
  if (u >= 0) {
    upgrades = aboutTrimmed.substring(u + 13).trim();
    upgrades = trimSuffix(upgrades, ".</i><br>");
    aboutTrimmed = aboutTrimmed.substring(0, u);
  }

  // Resetting regex
  strongEnRegex.lastIndex = 0;
  weakEnRegex.lastIndex = 0;

  let m;
  let strong = "";
  if ((m = strongEnRegex.exec(aboutTrimmed)) !== null) {
    if (m.index !== strongEnRegex.lastIndex) {
      strong = m[1];
      aboutTrimmed = aboutTrimmed.replace(m[0], "");
    }
  }
  let weak = "";
  if ((m = weakEnRegex.exec(aboutTrimmed)) !== null) {
    if (m.index !== weakEnRegex.lastIndex) {
      weak = m[1];
      aboutTrimmed = aboutTrimmed.replace(m[0], "");
    }
  }

  return { about: aboutTrimmed, strong: strong, weak: weak, upgrades: upgrades };
};

export const techNameByID = (techId: number): string =>
  // data.data.techs[6].internal_name // "Mongol Siege Drill"
  // data.data.techs[6].LanguageNameId // 7422
  // strings[7422] // "Drill"
  strings[data.data.techs[techId].LanguageNameId];

export interface ICivData {
  /** internal_name value for civ used everywhere */
  key: string;
  /** localized name for civ, not to be used for data keys */
  value: string;
  /** help string about the civilization */
  help: string;
}

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

export enum UnitType {
  RegularUnit,
  CastleAgeUniqueUnit,
  ImperialAgeUniqueUnit,
}

export interface IUnitHelp {
  about: string;
  strong: string;
  weak: string;
  upgrades: string;
}

export interface IUnitData {
  id: number;
  /** Localized name of the unit */
  extractedUnitData: IExtractedUnitData;
  unitType: UnitType;
  help: IUnitHelp;
}

const _cacheAllUnitsByCivKey: Map<string, IUnitData[]> = new Map();

export const allUnits = (civKey: string): IUnitData[] => {
  if (_cacheAllUnitsByCivKey.has(civKey)) {
    return _cacheAllUnitsByCivKey.get(civKey)!;
  }
  const entries: IUnitData[] = [];
  data.techtrees[civKey].units.forEach((id: number) => {
    entries.push({
      id: id,
      extractedUnitData: extractUnitDataByID(id),
      unitType: UnitType.RegularUnit,
      help: unitHelpByID(id),
    });
  });
  _cacheAllUnitsByCivKey.set(civKey, entries);
  return entries;
};

export const imperialAgeUniqueUnit = (civKey: string): IUnitData => {
  const id = data.techtrees[civKey].unique.imperialAgeUniqueUnit as number;
  return {
    id: id,
    extractedUnitData: extractUnitDataByID(id),
    unitType: UnitType.ImperialAgeUniqueUnit,
    help: unitHelpByID(id),
  };
};

export const castleAgeUniqueUnit = (civKey: string): IUnitData => {
  const id = data.techtrees[civKey].unique.castleAgeUniqueUnit as number;
  return {
    id: id,
    extractedUnitData: extractUnitDataByID(id),
    unitType: UnitType.CastleAgeUniqueUnit,
    help: unitHelpByID(id),
  };
};

// TODO: Refactor this into a function
export class Cost {
  food: number;
  gold: number;
  stone: number;
  wood: number;

  constructor(food: number, gold: number, stone: number, wood: number) {
    this.food = food;
    this.gold = gold;
    this.stone = stone;
    this.wood = wood;
  }
  toKey(): string {
    return `f${this.food}g${this.gold}s${this.stone}w${this.wood}`;
  }
  static key(food: number, gold: number, stone: number, wood: number): string {
    return new Cost(food, gold, stone, wood).toKey();
  }
}

// const emptyCost = (): Cost => new Cost(0, 0, 0, 0);

export interface IUnitStatsData {
  cost: Cost;
}

export interface IUnitCivData {
  civ: ICivData;
  unit: IUnitData;
  unitStats: IUnitStatsData;
}

export const searchUnits = (like: string): IUnitCivData[] => {
  like = like.toLowerCase().trim();
  if (like == "") return [];
  // TODO: Turn this into fuzzy search
  return matchUnits(
    getAllCivs(),
    (u) => u.extractedUnitData.name.toLowerCase().indexOf(like) >= 0 || u.id.toString() == like
  );
};

export interface IGroupByUnitData {
  unit: IUnitData;
  /** civKey stored in the set */
  civs: Set<string>;
  mostCommonUnitStats: IUnitStatsData;
}

export const groupByUnitType = (units: IUnitCivData[]): IGroupByUnitData[] => {
  const result: IGroupByUnitData[] = [];
  for (let i = 0; i < units.length; i++) {
    const next = units[i];
    const found = result.find((v) => v.unit.id == next.unit.id);
    if (found) {
      found.civs.add(next.civ.key);
      // found.civs.push(next);
    } else {
      const m = new Set<string>();
      m.add(next.civ.key);
      result.push({ unit: next.unit, civs: m, mostCommonUnitStats: { cost: next.unitStats.cost } });
    }
  }
  // patchCalculateMostCommon(result);
  return result;
};

// const patchCalculateMostCommon = (result: IGroupByUnitData[]) => {
//   result.forEach((r) => {
//     const st: Map<string, [Cost, number]> = new Map();
//     r.civs.forEach((c, _civKey) => {
//       const costKey = c.unitStats.cost.toKey();
//       if (st.has(costKey)) {
//         const [c, n] = st.get(costKey)!;
//         st.set(costKey, [c, n + 1]);
//       } else {
//         st.set(costKey, [c.unitStats.cost, 1]);
//       }
//     });
//     if (st.size > 1) {
//       // TODO: Run this through tests. If we always have the same price
//       // for every single unit, why bothering with this sorting / calculating
//       // the most common price?
//       console.error(`Unexpected map size: ${st}`);
//     }
//     const a = [...st.entries()].sort((a, b) => b[1][1] - a[1][1]);
//     r.mostCommonUnitStats.cost = a[0][1][0];
//   });
// };

export const getAllCivUnits = (civKey: string): IUnitCivData[] => {
  const civ_ = civByKey(civKey);
  if (civ_ == null) return [];
  return matchUnits([civ_], (_u) => true);
};

export const matchUnits = (civs: ICivData[], match: (unit: IUnitData) => boolean): IUnitCivData[] => {
  const result: IUnitCivData[] = [];
  civs.forEach((c) => {
    [imperialAgeUniqueUnit(c.key), castleAgeUniqueUnit(c.key), ...allUnits(c.key)].forEach((u) => {
      if (match(u)) {
        const cost = data.data.units[u.id].Cost;
        result.push({
          civ: c,
          unit: u,
          unitStats: {
            cost: new Cost(
              cost["Food"] || 0,
              cost["Gold"] || 0,
              0, // FIXME: Units cost no stone ? Type doesn't appear to have stone. Confirm.
              cost["Wood"] || 0
            ),
          },
        });
      }
    });
  });
  return result;
};

export const searchCivs = (like: string): ICivData[] => {
  like = like.toLowerCase().trim();
  if (like == "") return [];
  // TODO: Turn this into fuzzy search
  return matchCivs(
    getAllCivs(),
    (u) => u.value.toLowerCase().indexOf(like) >= 0 || u.key.toLowerCase().indexOf(like) >= 0
  );
};

export const matchCivs = (civs: ICivData[], match: (civ: ICivData) => boolean): ICivData[] => {
  const result: ICivData[] = [];
  civs.forEach((c) => {
    if (match(c)) {
      result.push(c);
    }
  });
  return result;
};
