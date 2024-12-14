import { findUnitStatisticsUnitDataByID, IUnitData, matchUnits } from "./model";

export function unitToUnitVariationsList(unitId: number) {
  switch (unitId) {
    case 331: // Trebuchet (Packed)
      return [unitId, 42]; // Trebuchet (Unpacked)
    case 1759: // Ratha
      return [unitId, 1738]; // Ratha (Melee)
    case 1761: // Elite Ratha
      return [unitId, 1740]; // Elite Ratha (Melee)
    case 1225: // Konnik
      return [unitId, 1252]; // Konnik (Dismounted)
    case 1227: // Elite Konnik
      return [unitId, 1253]; // Elite Konnik (Dismounted)
  }
  return [unitId];
}

interface IUnitAttributes {
  unitId: number;
  name: string;
}

interface IPatchedUnitAttributes {
  name: string;
}

/**
 * Returns passed {id, name}, or a patched unit id, if the image
 * is missing and provided by another unit.
 * @param {id, name}
 * @returns
 */
export function patchedUnitAttributes({ unitId, name }: IUnitAttributes): IPatchedUnitAttributes {
  switch (unitId) {
    case 42: // "TREBU", unpacked trebuchet to attack
      return { name: name + " (Unpacked)" }; // "PTREB"
    case 331: // "PTREB", packed trebuchet to move
      return { name: name + " (Packed)" }; // "PTREB"
    default:
      return { name };
  }
}
