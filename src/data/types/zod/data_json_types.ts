// Generated by ts-to-zod
import { z } from "zod";
import { MonkPrefix } from "./../data_json_types";

export const ageNamesSchema = z.object({
  "Castle Age": z.string(),
  "Dark Age": z.string(),
  "Feudal Age": z.string(),
  "Imperial Age": z.string(),
});

export const techTreeStringsSchema = z.object({
  "Age of Empires II": z.string(),
  Building: z.string(),
  Civilization: z.string(),
  Key: z.string(),
  Technology: z.string(),
  "Technology Tree": z.string(),
  "Unique Unit": z.string(),
  Unit: z.string(),
  mode: z.string(),
});

export const armourSchema = z.object({
  Amount: z.number(),
  Class: z.number(),
});

export const buildingCostSchema = z.object({
  Wood: z.number().optional(),
  Stone: z.number().optional(),
  Gold: z.number().optional(),
  Food: z.number().optional(),
});

export const techSchema = z.object({
  Cost: buildingCostSchema,
  ID: z.number(),
  LanguageHelpId: z.number(),
  LanguageNameId: z.number(),
  Repeatable: z.boolean(),
  ResearchTime: z.number(),
  internal_name: z.string(),
});

export const unitUpgradeCostSchema = z.object({
  Gold: z.number().optional(),
  Wood: z.number().optional(),
  Food: z.number().optional(),
});

export const unitSchema = z.object({
  AccuracyPercent: z.number(),
  Armours: z.array(armourSchema),
  Attack: z.number(),
  AttackDelaySeconds: z.number(),
  Attacks: z.array(armourSchema),
  ChargeEvent: z.number(),
  ChargeType: z.number(),
  Cost: unitUpgradeCostSchema,
  FrameDelay: z.number(),
  GarrisonCapacity: z.number(),
  HP: z.number(),
  ID: z.number(),
  LanguageHelpId: z.number(),
  LanguageNameId: z.number(),
  LineOfSight: z.number(),
  MaxCharge: z.number(),
  MeleeArmor: z.number(),
  MinRange: z.number(),
  PierceArmor: z.number(),
  Range: z.number(),
  RechargeRate: z.number(),
  ReloadTime: z.number(),
  Speed: z.number(),
  TrainTime: z.number(),
  Trait: z.number(),
  TraitPiece: z.number(),
  internal_name: z.string(),
  RechargeDuration: z.number().optional(),
});

export const buildingElementSchema = z.object({
  age: z.number(),
  id: z.number(),
});

export const monkPrefixSchema = z.nativeEnum(MonkPrefix);

export const uniqueSchema = z.object({
  castleAgeUniqueTech: z.number(),
  castleAgeUniqueUnit: z.number(),
  imperialAgeUniqueTech: z.number(),
  imperialAgeUniqueUnit: z.number(),
});

export const buildingValueSchema = z.object({
  AccuracyPercent: z.number(),
  Armours: z.array(armourSchema),
  Attack: z.number(),
  Attacks: z.array(armourSchema),
  Cost: buildingCostSchema,
  GarrisonCapacity: z.number(),
  HP: z.number(),
  ID: z.number(),
  LanguageHelpId: z.number(),
  LanguageNameId: z.number(),
  LineOfSight: z.number(),
  MeleeArmor: z.number(),
  MinRange: z.number(),
  PierceArmor: z.number(),
  Range: z.number(),
  ReloadTime: z.number(),
  TrainTime: z.number(),
  internal_name: z.string(),
});

export const unitUpgradeSchema = z.object({
  Cost: unitUpgradeCostSchema,
  ID: z.number(),
  ResearchTime: z.number(),
  internal_name: z.string(),
});

export const techtreeSchema = z.object({
  buildings: z.array(buildingElementSchema),
  monkPrefix: monkPrefixSchema,
  techs: z.array(buildingElementSchema),
  unique: uniqueSchema,
  units: z.array(buildingElementSchema),
});

export const dataClassSchema = z.object({
  buildings: z.record(buildingValueSchema),
  techs: z.record(techSchema),
  unit_upgrades: z.record(unitUpgradeSchema),
  units: z.record(unitSchema),
});

export const dataSchema = z.object({
  age_names: ageNamesSchema,
  civ_helptexts: z.record(z.string()),
  civ_names: z.record(z.string()),
  data: dataClassSchema,
  tech_tree_strings: techTreeStringsSchema,
  techtrees: z.record(techtreeSchema),
});