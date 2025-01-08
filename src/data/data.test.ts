import { expect, test } from "vitest";
import { calculateDamage } from "./calculateDamage";
import { allTechs, findUnitStatisticsUnitDataByID } from "./model";

test("test damage", () => {
  const warElephantUnit = findUnitStatisticsUnitDataByID(239);
  const halberdierUnit = findUnitStatisticsUnitDataByID(359);
  const damage = calculateDamage(halberdierUnit, warElephantUnit);
  console.log(`${warElephantUnit.name} -> ${halberdierUnit.name} = ${damage}`);
  expect(damage).eq(65);
});

import dataSrc from "./json/data.json";
import { Data } from "./types/data_json_types";

test("allTechs unused", () => {
  const data = dataSrc as Data;
  const allTechsInSrc = structuredClone(data.data.techs);
  const allTechsDetected = allTechs();
  for (const dTechId of allTechsDetected) {
    delete allTechsInSrc[dTechId.ID.toString()];
  }
  // There are 2 technologies that have no links to their IDs anywhere in the tech tree:
  expect(Object.keys(allTechsInSrc).length).eq(2);
  expect(Object.keys(allTechsInSrc)).deep.eq(["19", "90"]);
  expect(allTechsInSrc["19"].internal_name).eq("Cartography");
  expect(allTechsInSrc["90"].internal_name).eq("Tracking");
});
