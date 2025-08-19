import z from "zod";

export const TierSchema = z.enum([
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER'
]);

export type Tier = z.infer<typeof TierSchema>;