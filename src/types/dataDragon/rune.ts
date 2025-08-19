import z from 'zod';

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
  .passthrough();

export type Rune = z.infer<typeof RuneSchema>;
export type RuneSlot = z.infer<typeof RuneSlotSchema>;
export type RuneAsset = z.infer<typeof RuneAssetSchema>;
