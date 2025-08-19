import { z } from 'zod';
import { AssetImageSchema } from './assetImage';

export const ChampionInfoSchema = z.object({
  attack: z.number(),
  defense: z.number(),
  magic: z.number(),
  difficulty: z.number(),
});

export const ChampionStatsSchema = z.object({
  hp: z.number(),
  hpperlevel: z.number(),
  mp: z.number(),
  mpperlevel: z.number(),
  movespeed: z.number(),
  armor: z.number(),
  armorperlevel: z.number(),
  spellblock: z.number(),
  spellblockperlevel: z.number(),
  attackrange: z.number(),
  hpregen: z.number(),
  hpregenperlevel: z.number(),
  mpregen: z.number(),
  mpregenperlevel: z.number(),
  crit: z.number(),
  critperlevel: z.number(),
  attackdamage: z.number(),
  attackdamageperlevel: z.number(),
  attackspeedperlevel: z.number(),
  attackspeed: z.number(),
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
  leveltip: z.object({
    label: z.array(z.string()),
    effect: z.array(z.string()),
  }),
  maxrank: z.number(),
  cooldown: z.array(z.number().nullable()),
  cooldownBurn: z.string(),
  cost: z.array(z.number().nullable()),
  costBurn: z.string(),
  effect: z.array(z.array(z.number()).nullable()),
  effectBurn: z.array(z.string().nullable()),
  costType: z.string(),
  maxammo: z.string(),
  range: z.array(z.number()),
  rangeBurn: z.string(),
  image: AssetImageSchema,
  resource: z.string(),
});

export const ChampionPassiveSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: AssetImageSchema,
});

export const ChampionSchema = z
  .object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    title: z.string(),
    blurb: z.string(),
    tags: z.array(z.string()),
    partype: z.string(),
    info: ChampionInfoSchema,
    image: AssetImageSchema,
    stats: ChampionStatsSchema,
    skins: z.array(ChampionSkinSchema),
    lore: z.string(),
    allytips: z.array(z.string()),
    enemytips: z.array(z.string()),
    spells: z.array(ChampionSpellSchema),
    passive: ChampionPassiveSchema,
  })
  .passthrough();

export type ChampionInfo = z.infer<typeof ChampionInfoSchema>;
export type ChampionStats = z.infer<typeof ChampionStatsSchema>;
export type ChampionSkin = z.infer<typeof ChampionSkinSchema>;
export type ChampionSpell = z.infer<typeof ChampionSpellSchema>;
export type ChampionPassive = z.infer<typeof ChampionPassiveSchema>;
export type Champion = z.infer<typeof ChampionSchema>;
