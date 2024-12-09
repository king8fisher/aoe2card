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
