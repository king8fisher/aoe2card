import { expect, test } from "vitest";
import { calculateDamage } from "./calculateDamage";
import { extractUnitDataByID } from "./model";

test("test damage", () => {
  const warElephantUnit = extractUnitDataByID(239);
  const halberdierUnit = extractUnitDataByID(359);
  const damage = calculateDamage(halberdierUnit, warElephantUnit);
  console.log(`${warElephantUnit.name} -> ${halberdierUnit.name} = ${damage}`);
  expect(damage).eq(65);
});

