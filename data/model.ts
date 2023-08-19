import data from './data.json';
import strings from './strings.json';

// This will have to be at some point converted into the dynamic json files load.

export type attackData = {
  Amount: number;
  Class: number;
}

export type armourData = {
  Amount: number;
  Class: number;
}

export function unitNameByID(unitId: number): string {
  // data.data.units[561].LanguageNameId // 5458
  // strings[5458] // "Elite Mangudai"
  return strings[data.data.units[unitId].LanguageNameId]
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

export function getAllCivs(): ICivData[] {
  let entries: ICivData[] = [];
  Object.entries(data["civ_names"]).forEach((v, _k) => {
    // {key: internal_name, value: strings_localized_value}
    entries.push({ key: v[0], value: strings[v[1]] });
  })
  return entries;
}

export interface IUnitData {
  key: number;
  value: string;
  isImperialAgeUniqueUnit: boolean;
}

export function allUnits(civ: string): IUnitData[] {
  let entries: IUnitData[] = [];
  data.techtrees[civ].units.forEach((v: number) => {
    entries.push({ key: v, value: unitNameByID(v), isImperialAgeUniqueUnit: false })
  })
  return entries;
}

export function imperialAgeUniqueUnit(civ: string): IUnitData {
  let id = data.techtrees[civ].unique.imperialAgeUniqueUnit
  return { key: id, value: unitNameByID(id), isImperialAgeUniqueUnit: true }
}

export interface IUnitStatsData {
  cost: { gold: number, wood: number, food: number, stone: number }
}

export interface IUnitCivData {
  civ: ICivData
  unit: IUnitData
  unitStats: IUnitStatsData
}

export function searchUnits(like: string): IUnitCivData[] {
  like = like.toLowerCase().trim();
  if (like == '') return []
  let result: IUnitCivData[] = []
  getAllCivs().forEach((c) => {
    [imperialAgeUniqueUnit(c.key), ...allUnits(c.key)].forEach((u) => {
      // TODO: Turn this into fuzzy search
      if (u.value.toLowerCase().indexOf(like) >= 0) {
        let cost = data.data.units[u.key].Cost
        result.push({
          civ: c,
          unit: u,
          unitStats: {
            cost: {
              food: cost["Food"] || 0,
              gold: cost["Gold"] || 0,
              stone: cost["Stone"] || 0,
              wood: cost["Wood"] || 0,
            }
          }
        })
      }
    })
  })
  return result
}