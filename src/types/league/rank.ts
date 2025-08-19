import z from "zod";

export const RankSchema = z.enum([
  '',   // Empty string for Master, Grandmaster, Challenger tiers
  'I',
  'II',
  'III',
  'IV',
  'V'
]);

export type Rank = z.infer<typeof RankSchema>;