// Format of the patches response
// https://aoestats.io/api/patches/?format=json

import { z } from "zod";

export const PatchSchema = z.array(z.object({
  number: z.number(),
  label: z.string(),
  release_date: z.date(),
  published: z.boolean(),
  url: z.string(),
  description: z.string(),
  total_games: z.number()
}));

export type PatchSchema = z.infer<typeof PatchSchema>;