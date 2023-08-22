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
}

export function allCivs(): ICivData[] {
  let entries: ICivData[] = [];
  Object.entries(data["civ_names"]).forEach((v, _k) => {
    // {key: internal_name, value: strings_localized_value}
    entries.push({ key: v[0], value: strings[v[1]] });
  });
  return entries;
}

export function civByName(civ: string): ICivData | null {
  let found = data["civ_names"][civ];
  if (found == null) return null;
  return { key: civ, value: strings[found] };
}

export interface IUnitData {
  id: number;
  value: string;
  isImperialAgeUniqueUnit: boolean;
}

export function allUnits(civKey: string): IUnitData[] {
  let entries: IUnitData[] = [];
  data.techtrees[civKey].units.forEach((v: number) => {
    entries.push({ id: v, value: unitNameByID(v), isImperialAgeUniqueUnit: false });
  });
  return entries;
}

export function imperialAgeUniqueUnit(civKey: string): IUnitData {
  let id = data.techtrees[civKey].unique.imperialAgeUniqueUnit as number;
  return { id: id, value: unitNameByID(id), isImperialAgeUniqueUnit: true };
}

export interface ICost {
  food: number;
  gold: number;
  stone: number;
  wood: number;
}

function emptyCost(): ICost {
  return {
    food: 0,
    gold: 0,
    stone: 0,
    wood: 0,
  };
}

export interface IUnitStatsData {
  cost: ICost;
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
    return u.value.toLowerCase().indexOf(like) >= 0;
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
    let st: Map<ICost, number> = new Map();
    r.civs.forEach((c) => {
      const cost = c.unitStats.cost;
      if (st.has(cost)) {
        st.set(cost, st.get(cost)! + 1);
      } else {
        st.set(cost, 1);
      }
    });
    let a = [...st.entries()].sort((a, b) => b[1] - a[1]);
    r.mostCommonUnitStats.cost = a[0][0];
  });
}

export function allCivUnits(civKey: string): IUnitCivData[] {
  let civ_ = civByName(civKey);
  if (civ_ == null) return [];
  return matchUnits([civ_], (_u) => true);
}

export function matchUnits(civs: ICivData[], match: (unit: IUnitData) => boolean): IUnitCivData[] {
  let result: IUnitCivData[] = [];
  civs.forEach((c) => {
    [imperialAgeUniqueUnit(c.key), ...allUnits(c.key)].forEach((u) => {
      if (match(u)) {
        let cost = data.data.units[u.id].Cost;
        result.push({
          civ: c,
          unit: u,
          unitStats: {
            cost: {
              food: cost["Food"] || 0,
              gold: cost["Gold"] || 0,
              stone: cost["Stone"] || 0,
              wood: cost["Wood"] || 0,
            },
          },
        });
      }
    });
  });
  return result;
}
