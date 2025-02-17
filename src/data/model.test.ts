import { expect, test } from "vitest";
import dataSrc from "./json/data.json" with { type: "json" };
import stringsSrc from "./json/strings.json" with { type: "json" };
import unitBuildingsSrc from "./json/units_buildings_techs.json" with { type: "json" };
import { dataSchema } from "./types/zod/data_json_types";
import { stringsSchema } from "./types/zod/strings_json_types";
import { unitsBuildingsTechsSchema } from "./types/zod/units_buildings_techs_data_types";

/*

Zod files generated using "ts-to-zod":

$ pnpm ts-to-zod .\src\data\types\data_json_types.ts .\src\data\types\zod\data_json_types.ts --skipValidation
$ pnpm ts-to-zod .\src\data\types\strings_json_types.ts .\src\data\types\zod\strings_json_types.ts --skipValidation
$ pnpm ts-to-zod .\src\data\types\units_buildings_techs_data_types.ts .\src\data\types\zod\units_buildings_techs_data_types.ts --skipValidation

*/

test("validate data.json", () => {
  const result = dataSchema.safeParse(dataSrc);
  expect(result.success).toBe(true);
});

test("validate strings.json", () => {
  const result = stringsSchema.safeParse(stringsSrc);
  expect(result.success).toBe(true);
});

test("validate units_buildings_techs.json", () => {
  const result = unitsBuildingsTechsSchema.safeParse(unitBuildingsSrc);
  expect(result.success).toBe(true);
});
