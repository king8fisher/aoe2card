import data from "./data.json";
import { armourData, attackData, unitNameByID } from "./model";

// Playground for messing with json file structure and scaffolding functions
// to make it easy to access data.

function playground() {
  // Unit data for unit_id
  data.data.unit_upgrades[561].internal_name; // "Elite Mangudai"
  unitNameByID(561); // "Elite Mangudai"
  data.data.unit_upgrades[561].ResearchTime; // 50
  data.data.units[561].internal_name; // "UMOSU"
  data.data.units[561].Cost; // { "Gold": 65, "Wood": 55 }
  data.data.units[561].HP; // 60
  data.data.units[561].LineOfSight; // 6
  data.data.units[561].Attack; // 8
  data.data.units[561].MeleeArmor; // 1
  data.data.units[561].PierceArmor; // 0
  data.data.units[561].GarrisonCapacity; // 0
  data.data.units[561].TrainTime; // 26
  data.data.units[561].Speed; // 1.4
  data.data.units[561].ReloadTime; // 2.1

  let attacks: attackData[] = data.data.units[561].Attacks; // [ { "Amount": 1, "Class": 27 }, { "Amount": 0, "Class": 21 }, ... ]
  let armours: armourData[] = data.data.units[561].Armours; // [ { "Amount": 0, "Class": 28 }, { "Amount": 1, "Class": 4 }, ... ]
  // ...

  // Root for data for a civ
  data.techtrees.Mongols;

  // [unit_id, ...]
  let units = data.techtrees.Mongols.units;

  // Unique Techtree

  // 487
  let castleAgeUniqueTech = data.techtrees.Mongols.unique.castleAgeUniqueTech;

  // 11
  let castleAgeUniqueUnit = data.techtrees.Mongols.unique.castleAgeUniqueUnit;
  data.data.units[11].internal_name; // MOSUN
  data.data.units[11]; // Rest of data for the unit

  // 6
  let imperialAgeUniqueTech = data.techtrees.Mongols.unique.imperialAgeUniqueTech;
  data.data.techs[6].internal_name; // "Mongol Siege Drill"
  data.data.techs[6].Cost; // { "Gold": 450, "Wood": 500 }
  data.data.techs[6].ResearchTime; // 60

  // 561
  data.techtrees.Mongols.unique.imperialAgeUniqueUnit;
  data.data.unit_upgrades[561]; // Data for update cost, time, name
  data.data.units[561]; // Rest of the data about the unit

  // Magyar Huszar missing for the reason of not tapping into castleAgeUniqueUnit
  data.techtrees.Magyars.unique.castleAgeUniqueUnit;
}
