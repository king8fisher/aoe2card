import { expect, test } from "vitest";
import { allUnits, getAllCivs, getAllCivUnits, groupByUnitType, matchUnits } from "./model";

test("need for manual", () => {
  const units = allUnits();
  units.forEach((unit) => {
    const matched = matchUnits(
      getAllCivs(),
      (u) => u.id == unit.id
    );
    expect(matched.length, `${unit.id} ${unit.statisticsUnitData.name} not found`).toBeGreaterThan(0);
    const groupByUnitData = groupByUnitType(matched)[0];
    expect(groupByUnitData,
      `${unit.id} ${unit.statisticsUnitData.name} group data should not be undefined`).
      not.undefined;
  });

});