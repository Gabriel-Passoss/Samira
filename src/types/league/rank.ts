import z from "zod";

export const RankSchema = z.enum([
  'I',
  'II',
  'III',
  'IV',
  'V'
]);

export type Rank = z.infer<typeof RankSchema>;