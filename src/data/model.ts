import data from "./data.json";
import strings from "./strings.json";

// This will have to be at some point converted into the dynamic json files load.

export type attackData = {
  Amount: number;
  Class: number;
};

export type armourData = {
  Amount: number;
  Class: number;
};

export function unitNameByID(unitId: number): string {
  // data.data.units[561].LanguageNameId // 5458
  // strings[5458] // "Elite Mangudai"
  return strings[data.data.units[unitId].LanguageNameId];
}

export function techNameByID(techId: number): string {
  // data.data.techs[6].internal_name // "Mongol Siege Drill"
  // data.data.techs[6].LanguageNameId // 7422
  // strings[7422] // "Drill"
  return strings[data.data.techs[techId].LanguageNameId];
}

export interface ICivData {
  /** internal_name value for civ used everywhere */
  key: string;
  /** localized name for civ, not to be used for data keys */
  value: string;
  /** help string about the civilization */
  about: string;
}

export function allCivs(): ICivData[] {
  let entries: ICivData[] = [];
  Object.entries(data["civ_names"]).forEach((v, _k) => {
    // {key: internal_name, value: strings_localized_value}
    entries.push({
      key: v[0],
      value: strings[v[1]],
      about: strings[data["civ_helptexts"][v[0]]],
    });
  });
  return entries;
}

export function civByKey(civKey: string): ICivData | null {
  let found = data["civ_names"][civKey];
  if (found == null) return null;
  return {
    key: civKey,
    value: strings[found],
    about: data["civ_helptexts"][civKey],
  };
}

export enum UnitType {
  RegularUnit,
  CastleAgeUniqueUnit,
  ImperialAgeUniqueUnit,
}

export interface IUnitData {
  id: number;
  /** Localized name of the unit */
  value: string;
  unitType: UnitType;
}

export function allUnits(civKey: string): IUnitData[] {
  let entries: IUnitData[] = [];
  data.techtrees[civKey].units.forEach((v: number) => {
    entries.push({
      id: v,
      value: unitNameByID(v),
      unitType: UnitType.RegularUnit,
    });
  });
  return entries;
}

export function imperialAgeUniqueUnit(civKey: string): IUnitData {
  let id = data.techtrees[civKey].unique.imperialAgeUniqueUnit as number;
  return { id: id, value: unitNameByID(id), unitType: UnitType.ImperialAgeUniqueUnit };
}

export function castleAgeUniqueUnit(civKey: string): IUnitData {
  let id = data.techtrees[civKey].unique.castleAgeUniqueUnit as number;
  return {
    id: id,
    value: unitNameByID(id),
    unitType: UnitType.CastleAgeUniqueUnit,
  };
}

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

function emptyCost(): Cost {
  return new Cost(0, 0, 0, 0);
}

export interface IUnitStatsData {
  cost: Cost;
}

export interface IUnitCivData {
  civ: ICivData;
  unit: IUnitData;
  unitStats: IUnitStatsData;
}

export function searchUnits(like: string): IUnitCivData[] {
  like = like.toLowerCase().trim();
  if (like == "") return [];
  // TODO: Turn this into fuzzy search
  return matchUnits(allCivs(), (u) => {
    return u.value.toLowerCase().indexOf(like) >= 0 || u.id.toString() == like;
  });
}

export interface IGroupByUnitData {
  unit: IUnitData;
  civs: IUnitCivData[];
  mostCommonUnitStats: IUnitStatsData;
}

export function groupByUnitType(units: IUnitCivData[]): IGroupByUnitData[] {
  let result: IGroupByUnitData[] = [];
  for (let i = 0; i < units.length; i++) {
    const next = units[i];
    const found = result.find((v) => v.unit.id == next.unit.id);
    if (found) {
      found.civs.push(next);
    } else {
      result.push({ unit: next.unit, civs: [next], mostCommonUnitStats: { cost: emptyCost() } });
    }
  }
  patchCalculateMostCommon(result);
  return result;
}

function patchCalculateMostCommon(result: IGroupByUnitData[]) {
  result.forEach((r) => {
    let st: Map<string, [Cost, number]> = new Map();
    r.civs.forEach((c) => {
      const costKey = c.unitStats.cost.toKey();
      if (st.has(costKey)) {
        const [c, n] = st.get(costKey)!;
        st.set(costKey, [c, n + 1]);
      } else {
        st.set(costKey, [c.unitStats.cost, 1]);
      }
    });
    if (st.size > 1) {
      // TODO: Run this through tests. If we always have the same price
      // for every single unit, why bothering with this sorting / calculating
      // the most common price?
      console.error(`Unexpected map size: ${st}`);
    }
    let a = [...st.entries()].sort((a, b) => b[1][1] - a[1][1]);
    r.mostCommonUnitStats.cost = a[0][1][0];
  });
}

export function allCivUnits(civKey: string): IUnitCivData[] {
  let civ_ = civByKey(civKey);
  if (civ_ == null) return [];
  return matchUnits([civ_], (_u) => true);
}

export function matchUnits(civs: ICivData[], match: (unit: IUnitData) => boolean): IUnitCivData[] {
  let result: IUnitCivData[] = [];
  civs.forEach((c) => {
    [imperialAgeUniqueUnit(c.key), castleAgeUniqueUnit(c.key), ...allUnits(c.key)].forEach((u) => {
      if (match(u)) {
        let cost = data.data.units[u.id].Cost;
        result.push({
          civ: c,
          unit: u,
          unitStats: {
            cost: new Cost(cost["Food"] || 0, cost["Gold"] || 0, cost["Stone"] || 0, cost["Wood"] || 0),
          },
        });
      }
    });
  });
  return result;
}
