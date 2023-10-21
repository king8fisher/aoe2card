export interface UnitsBuildingsTechs {
  units_buildings: { [key: string]: UnitsBuilding };
  techs: { [key: string]: Tech };
}

export interface Tech {
  cost: Cost;
  help_converter: number;
  language_file_name: number;
  language_file_help: number;
  name: string;
}

export interface Cost {
  wood: number;
  food: number;
  gold: number;
  stone: number;
}

export interface UnitsBuilding {
  cost: Cost;
  attack: number;
  melee_armor: number;
  pierce_armor: number;
  base_id: number;
  help_converter: number;
  language_file_name: number;
  language_file_help: number;
  name: string;
  hit_points: number;
  line_of_sight: number;
  garrison_capacity: number;
  type: number;
  class: number;
}
