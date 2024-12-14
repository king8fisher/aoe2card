import { expect, test } from "vitest";
import { calculateDamage } from "./calculateDamage";
import { findUnitStatisticsUnitDataByID } from "./model";

test("test damage", () => {
  const warElephantUnit = findUnitStatisticsUnitDataByID(239);
  const halberdierUnit = findUnitStatisticsUnitDataByID(359);
  const damage = calculateDamage(halberdierUnit, warElephantUnit);
  console.log(`${warElephantUnit.name} -> ${halberdierUnit.name} = ${damage}`);
  expect(damage).eq(65);
});

