import z from 'zod';

export const AssetImageSchema = z.object({
  full: z.string(),
  sprite: z.string(),
  group: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

export type AssetImage = z.infer<typeof AssetImageSchema>;
