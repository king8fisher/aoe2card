import { expect, test } from "vitest";
import patchSrc from "./json/patch.json" with { type: "json" };

export interface Patches {
  number: number;
  label: string;
  release_date: string;
  published: boolean;
  url: string;
  description: string;
  total_games: number;
}

test.skip("latest patch", async () => {
  const p = await fetch("https://aoestats.io/api/patches/?format=json");
  const json = (await p.json()) as Patches[];
  let max: Patches | undefined;
  json.forEach((v) => {
    if (max === undefined || v.number > max.number) max = v;
  });
  expect(max).not.toBeUndefined();
  expect(patchSrc.DE).equals(max?.number);
});
