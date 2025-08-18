import { z } from 'zod';

// Champion schemas
export const ChampionImageSchema = z.object({
  full: z.string(),
  sprite: z.string(),
  group: z.string(),
});

export const ChampionSkinSchema = z.object({
  id: z.string(),
  num: z.number(),
  name: z.string(),
  chromas: z.boolean(),
});

export const ChampionSpellSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tooltip: z.string(),
  image: ChampionImageSchema,
});

export const ChampionPassiveSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: ChampionImageSchema,
});

export const ChampionAssetSchema = z
  .object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    title: z.string(),
    image: ChampionImageSchema,
    skins: z.array(ChampionSkinSchema).optional(),
    spells: z.array(ChampionSpellSchema).optional(),
    passive: ChampionPassiveSchema.optional(),
  })
  .passthrough(); // Allow additional fields from API

// Item schemas
export const ItemGoldSchema = z.object({
  base: z.number(),
  total: z.number(),
  sell: z.number(),
});

export const ItemAssetSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    image: ChampionImageSchema, // Reuse champion image schema
    gold: ItemGoldSchema,
    tags: z.array(z.string()),
  })
  .passthrough(); // Allow additional fields from API

// Rune schemas
export const RuneSchema = z.object({
  id: z.number(),
  key: z.string(),
  name: z.string(),
  icon: z.string(),
  shortDesc: z.string(),
  longDesc: z.string(),
});

export const RuneSlotSchema = z.object({
  runes: z.array(RuneSchema),
});

export const RuneAssetSchema = z
  .object({
    id: z.number(),
    key: z.string(),
    name: z.string(),
    icon: z.string(),
    slots: z.array(RuneSlotSchema),
  })
  .passthrough(); // Allow additional fields from API

// Summoner spell schemas
export const SummonerSpellAssetSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    tooltip: z.string(),
    image: ChampionImageSchema, // Reuse champion image schema
    cooldown: z.array(z.number()),
    cost: z.array(z.number()),
  })
  .passthrough(); // Allow additional fields from API

// Data Dragon configuration schema
export const DataDragonConfigSchema = z.object({
  version: z.string().optional(),
  language: z.string().optional(),
  baseUrl: z.string().optional(),
  includeFullUrl: z.boolean().optional(),
});

// Infer TypeScript types from Zod schemas
export type ChampionImage = z.infer<typeof ChampionImageSchema>;
export type ChampionSkin = z.infer<typeof ChampionSkinSchema>;
export type ChampionSpell = z.infer<typeof ChampionSpellSchema>;
export type ChampionPassive = z.infer<typeof ChampionPassiveSchema>;
export type ChampionAsset = z.infer<typeof ChampionAssetSchema>;
export type ItemGold = z.infer<typeof ItemGoldSchema>;
export type ItemAsset = z.infer<typeof ItemAssetSchema>;
export type Rune = z.infer<typeof RuneSchema>;
export type RuneSlot = z.infer<typeof RuneSlotSchema>;
export type RuneAsset = z.infer<typeof RuneAssetSchema>;
export type SummonerSpellAsset = z.infer<typeof SummonerSpellAssetSchema>;
export type DataDragonConfig = z.infer<typeof DataDragonConfigSchema>;
