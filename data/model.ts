import data from './data.json';
import strings from './strings.json';

// Currently a mess consisting of exploring json files and scaffolding functions
// to make it easy to access data.

type attackData = {
  Amount: number;
  Class: number;
}
type attacksData = attackData[]
type armourData = {
  Amount: number;
  Class: number;
}
type armoursData = armourData[]

// Unit data for unit_id
data.data.unit_upgrades[561].internal_name // "Elite Mangudai"
unitNameByID(561) // "Elite Mangudai"
data.data.unit_upgrades[561].ResearchTime // 50
data.data.units[561].internal_name // "UMOSU"
data.data.units[561].Cost // { "Gold": 65, "Wood": 55 }
data.data.units[561].HP // 60
data.data.units[561].LineOfSight // 6
data.data.units[561].Attack // 8
data.data.units[561].MeleeArmor // 1
data.data.units[561].PierceArmor // 0
data.data.units[561].GarrisonCapacity // 0
data.data.units[561].TrainTime // 26
data.data.units[561].Speed // 1.4
data.data.units[561].ReloadTime // 2.1

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

let attacks: attacksData = data.data.units[561].Attacks // [ { "Amount": 1, "Class": 27 }, { "Amount": 0, "Class": 21 }, ... ]
let armours: armoursData = data.data.units[561].Armours // [ { "Amount": 0, "Class": 28 }, { "Amount": 1, "Class": 4 }, ... ]
// ...

// Root for data for a civ
data.techtrees.Mongols

export function getAllCivs() {
  let entries = [];
  Object.entries(data["civ_names"]).forEach((v, _k) => {
    // {key: internal_name, value: strings_localized_value}
    entries.push({key: v[0], value: strings[v[1]]});
  })
  return entries;
}

// [unit_id, ...]
let units = data.techtrees.Mongols.units

export function allUnits(civ: string) {
  let entries = [];
  data.techtrees[civ].units.forEach((v) => {
    entries.push({key: v, value: unitNameByID(v)})
  })
  return entries;
}

// console.log("--Regular Units--")
// units.forEach((v) => {
//   console.log(unitNameByID(v as number));
// })
// console.log("--Unique Unit--")
// console.log(unitNameByID(data.techtrees.Mongols.unique.imperialAgeUniqueUnit))

// Unique Techtree 

// 487
let castleAgeUniqueTech = data.techtrees.Mongols.unique.castleAgeUniqueTech

// 11
let castleAgeUniqueUnit = data.techtrees.Mongols.unique.castleAgeUniqueUnit
data.data.units[11].internal_name // MOSUN
data.data.units[11] // Rest of data for the unit

// 6
let imperialAgeUniqueTech = data.techtrees.Mongols.unique.imperialAgeUniqueTech
data.data.techs[6].internal_name // "Mongol Siege Drill"
data.data.techs[6].Cost // { "Gold": 450, "Wood": 500 }
data.data.techs[6].ResearchTime // 60

// 561
data.techtrees.Mongols.unique.imperialAgeUniqueUnit
data.data.unit_upgrades[561] // Data for update cost, time, name
data.data.units[561] // Rest of the data about the unit

export function imperialAgeUniqueUnit(civ: string) {
  let id = data.techtrees[civ].unique.imperialAgeUniqueUnit
  return {key: id, value: unitNameByID(id)}
}

