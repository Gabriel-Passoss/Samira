import z from "zod";
import { AssetImageSchema } from "./assetImage";

export const ItemGoldSchema = z.object({
  base: z.number(),
  purchasable: z.boolean(),
  total: z.number(),
  sell: z.number(),
});

export const ItemAssetSchema = z.object({
  name: z.string(),
  description: z.string(),
  plaintext: z.string(),
  into: z.array(z.string()),
  image: AssetImageSchema,
  gold: ItemGoldSchema,
  tags: z.array(z.string()),
  maps: z.record(z.string(), z.boolean()),
  stats: z.record(z.string(), z.number()),
}).passthrough();

export type ItemGold = z.infer<typeof ItemGoldSchema>;
export type ItemAsset = z.infer<typeof ItemAssetSchema>;