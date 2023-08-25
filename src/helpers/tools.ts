import { IUnitData, UnitType } from "../data/model";

export const getStyleForUnit = (unit: IUnitData) => {
  switch (unit.unitType) {
    case UnitType.CastleAgeUniqueUnit:
      return "bg-green-400 dark:bg-green-700";
    case UnitType.ImperialAgeUniqueUnit:
      return "bg-blue-400 dark:bg-blue-700";
    default:
      return "bg-zinc-300 dark:bg-zinc-700";
  }
};

export const getCivImgUrl = (civKey: string) => `https://aoe2techtree.net/img/Civs/${civKey.toLowerCase()}.png`;
export const getUnitImgUrl = (unitId: number) => `https://aoe2techtree.net/img/Units/${unitId}.png`;

