import dataSrc from "./json/data.json" with { type: "json" };
import stringsSrc from "./json/strings.json" with { type: "json" };
import { patchedUnitAttributes, unitToUnitVariationsList } from "./patched_data";
import { Age, BuildingElement, Data, Tech, Unit, UnitCost } from "./types/data_json_types";
import { Strings } from "./types/strings_json_types";

export const data = dataSrc as Data;
export const strings = stringsSrc as Strings;

// This will have to be at some point converted into the dynamic json files load.

export type attackData = {
  Amount: number;
  Class: number;
};

export type armourData = {
  Amount: number;
  Class: number;
};

export interface IStatisticsUnitData {
  name: string;
  unitStatistics: Unit;
}

export const findUnitStatisticsUnitDataByID = (unitId: number): IStatisticsUnitData => {
  // data.data.units[561].LanguageNameId // 5458
  // strings[5458] // "Elite Mangudai"
  const d = data.data.units[unitId.toString()];
  const patched = patchedUnitAttributes({ unitId: unitId, name: strings[d.LanguageNameId] });
  return {
    name: patched.name,
    unitStatistics: d,
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
  const costPrefix = "(‹cost›)<br>\n";
  const f = about.indexOf(costPrefix);
  let aboutTrimmed = about;
  if (f >= 0) aboutTrimmed = about.substring(f + costPrefix.length);
  // Remove \n‹hp› ‹attack› ‹armor› ‹piercearmor› ‹range›
  // Remove \n‹hp› ‹attack› ‹armor› ‹piercearmor› ‹range› ‹garrison›
  // Remove ...
  const h = aboutTrimmed.indexOf("\n‹hp› ");
  if (h >= 0) aboutTrimmed = aboutTrimmed.substring(0, h);
  const upgradesPrefix = "<i> Upgrades:";
  const u = aboutTrimmed.indexOf(upgradesPrefix);
  let upgrades = "";
  if (u >= 0) {
    upgrades = aboutTrimmed.substring(u + upgradesPrefix.length).trim();
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

  return {
    about: aboutTrimmed,
    strong: strong,
    weak: weak,
    upgrades: upgrades,
  };
};

export type TechWithSource = (Tech & {
  source: "regular" | "castleUT" | "impUT";
});

/**
 * {@link allTechs} returns all technologies that have links to them
 * from the other parts of the data: from `data.techtrees[civKey].techs`,
 * `data.techtrees[civKey].unique.castleAgeUniqueTech` as well as 
 * `data.techtrees[civKey].unique.imperialAgeUniqueTech`.
 *
 * @returns {TechWithSource[]}
 */
export const allTechs = (): TechWithSource[] => {
  const result: TechWithSource[] = [];
  for (const techId in data.data.techs) {
    let found = false;
    for (const civKey in data.techtrees) {
      if (data.techtrees[civKey].techs.find((t) => t.id.toString() == techId)) {
        found = true;
        result.push({ ...data.data.techs[techId], source: "regular" });
        break;
      }
      if (data.techtrees[civKey].unique.castleAgeUniqueTech.toString() == techId) {
        found = true;
        result.push({ ...data.data.techs[techId], source: "castleUT" });
        break;
      }
      if (data.techtrees[civKey].unique.imperialAgeUniqueTech.toString() == techId) {
        found = true;
        result.push({ ...data.data.techs[techId], source: "impUT" });
        break;
      }
    }
    if (!found) {
      // console.log(techId, data.data.techs[techId].internal_name);
    }
  }
  return result;
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
  age: Age | undefined;
  /** Localized name of the unit */
  statisticsUnitData: IStatisticsUnitData;
  unitType: UnitType;
  help: IUnitHelp;
}

const _cacheAllUnits: Array<IUnitData> = [];
const _cacheAllUnitsByCivKey: Map<string, IUnitData[]> = new Map();

/**
 * Returns all existing units without civ relationship.
 * @returns 
 */
export const allUnits = (): IUnitData[] => {
  if (_cacheAllUnits.length > 0) return _cacheAllUnits;
  for (const u in data.data.units) {
    const unit = data.data.units[u];
    const patched = patchedUnitAttributes({ unitId: unit.ID, name: strings[unit.LanguageNameId] });
    _cacheAllUnits.push({
      id: unit.ID,
      age: undefined,
      statisticsUnitData: {
        name: patched.name,
        unitStatistics: unit
      },
      unitType: UnitType.RegularUnit,
      help: unitHelpByID(unit.ID),
    });
  };
  return _cacheAllUnits;
};

/**
 * Returns all regular units available to a civ.
 * @param civKey 
 * @returns 
 */
export const regularUnits = (civKey: string): IUnitData[] => {
  if (_cacheAllUnitsByCivKey.has(civKey)) {
    return _cacheAllUnitsByCivKey.get(civKey)!;
  }
  const entries: IUnitData[] = [];
  data.techtrees[civKey].units.forEach((buildingElement: BuildingElement) => {
    // Since techtrees do not mention unit variations, we will expand them here
    withVariations(entries, buildingElement.id, buildingElement.age, UnitType.RegularUnit);
  });
  _cacheAllUnitsByCivKey.set(civKey, entries);
  return entries;
};

function withVariations(entries: IUnitData[], unitId: number, age: Age, unitType: UnitType) {
  const variations = unitToUnitVariationsList(unitId);
  for (const variation of variations) {
    entries.push({
      id: variation,
      age: age,
      statisticsUnitData: findUnitStatisticsUnitDataByID(variation),
      unitType: unitType,
      help: unitHelpByID(variation),
    });
  }
}


/**
 * Returns all imperial unique units available to a civ.
 * @param civKey 
 * @returns 
 */
export const imperialAgeUniqueUnit = (civKey: string): IUnitData[] => {
  const id = data.techtrees[civKey].unique.imperialAgeUniqueUnit as number;
  // Since techtrees do not mention unit variations, we will expand them here
  const entries: IUnitData[] = [];
  withVariations(entries, id, 4, UnitType.ImperialAgeUniqueUnit);
  return entries;
};

/**
 * Returns all castle unique units available to a civ.
 * @param civKey 
 * @returns 
 */
export const castleAgeUniqueUnit = (civKey: string): IUnitData[] => {
  const id = data.techtrees[civKey].unique.castleAgeUniqueUnit as number;
  // Since techtrees do not mention unit variations, we will expand them here
  const entries: IUnitData[] = [];
  withVariations(entries, id, 3, UnitType.CastleAgeUniqueUnit);
  return entries;
};

export interface IUnitStatsData {
  cost: UnitCost;
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
    (u) => u.statisticsUnitData.name.toLowerCase().indexOf(like) >= 0 || u.id.toString() == like
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
      result.push({
        unit: next.unit,
        civs: m,
        mostCommonUnitStats: { cost: next.unitStats.cost },
      });
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
    [
      ...imperialAgeUniqueUnit(c.key),
      ...castleAgeUniqueUnit(c.key),
      ...regularUnits(c.key)
    ].forEach((u) => {
      if (match(u)) {
        const cost = data.data.units[u.id].Cost;
        result.push({
          civ: c,
          unit: u,
          unitStats: { cost },
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
