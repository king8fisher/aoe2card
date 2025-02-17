export interface Data {
  age_names: AgeNames;
  civ_helptexts: { [key: string]: string; };
  civ_names: { [key: string]: string; };
  data: DataClass;
  tech_tree_strings: TechTreeStrings;
  techtrees: { [key: string]: Techtree; };
}

export interface AgeNames {
  "Castle Age": string;
  "Dark Age": string;
  "Feudal Age": string;
  "Imperial Age": string;
}

export interface DataClass {
  buildings: { [key: string]: BuildingValue; };
  techs: { [key: string]: Tech; };
  unit_upgrades: { [key: string]: UnitUpgrade; };
  units: { [key: string]: Unit; };
}

export interface BuildingValue {
  AccuracyPercent: number;
  Armours: Armour[];
  Attack: number;
  Attacks: Attack[];
  Cost: BuildingCost;
  GarrisonCapacity: number;
  HP: number;
  ID: number;
  LanguageHelpId: number;
  LanguageNameId: number;
  LineOfSight: number;
  MeleeArmor: number;
  MinRange: number;
  PierceArmor: number;
  Range: number;
  ReloadTime: number;
  TrainTime: number;
  internal_name: string;
}

export interface Armour {
  Amount: number;
  Class: number;
}

export type Attack = Armour;

export interface BuildingCost {
  Wood?: number;
  Stone?: number;
  Gold?: number;
  Food?: number;
}

export interface Tech {
  Cost: BuildingCost;
  ID: number;
  LanguageHelpId: number;
  LanguageNameId: number;
  Repeatable: boolean;
  ResearchTime: number;
  internal_name: string;
}

export interface UnitUpgrade {
  Cost: UnitUpgradeCost;
  ID: number;
  ResearchTime: number;
  internal_name: string;
}

export interface UnitUpgradeCost {
  Gold?: number;
  Wood?: number;
  Food?: number;
}

export type UnitCost = UnitUpgradeCost;

export interface Unit {
  AccuracyPercent: number;
  Armours: Armour[];
  Attack: number;
  AttackDelaySeconds: number;
  Attacks: Attack[];
  ChargeEvent: number;
  ChargeType: number;
  Cost: UnitCost;
  FrameDelay: number;
  GarrisonCapacity: number;
  HP: number;
  ID: number;
  LanguageHelpId: number;
  LanguageNameId: number;
  LineOfSight: number;
  MaxCharge: number;
  MeleeArmor: number;
  MinRange: number;
  PierceArmor: number;
  Range: number;
  RechargeRate: number;
  ReloadTime: number;
  Speed: number;
  TrainTime: number;
  Trait: number;
  TraitPiece: number;
  internal_name: string;
  RechargeDuration?: number;
}

export interface TechTreeStrings {
  "Age of Empires II": string;
  Building: string;
  Civilization: string;
  Key: string;
  Technology: string;
  "Technology Tree": string;
  "Unique Unit": string;
  Unit: string;
  mode: string;
}

export interface Techtree {
  buildings: BuildingElement[];
  monkPrefix: MonkPrefix;
  techs: BuildingElement[];
  unique: Unique;
  units: BuildingElement[];
}

export type Age = 1 | 2 | 3 | 4;

export interface BuildingElement {
  age: Age;
  id: number;
}

export enum MonkPrefix {
  Empty = "",
  Meso = "meso_",
}

export interface Unique {
  castleAgeUniqueTech: number;
  castleAgeUniqueUnit: number;
  imperialAgeUniqueTech: number;
  imperialAgeUniqueUnit: number;
}
