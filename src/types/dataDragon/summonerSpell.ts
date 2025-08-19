import z from "zod";
import { AssetImageSchema } from "./assetImage";

export const SummonerSpellAssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tooltip: z.string(),
  maxrank: z.number(),
  cooldown: z.array(z.number()),
  cooldownBurn: z.string(),
  cost: z.array(z.number()),
  costBurn: z.string(),
  effect: z.array(z.array(z.string())),
  effectBurn: z.array(z.string()),
  key: z.string(),
  summonerLevel: z.number(),
  modes: z.array(z.string()),
  costType: z.string(),
  maxammo: z.string(),
  range: z.array(z.number()),
  rangeBurn: z.string(),
  image: AssetImageSchema,
  resource: z.string(),
  
}).passthrough();

export type SummonerSpellAsset = z.infer<typeof SummonerSpellAssetSchema>;