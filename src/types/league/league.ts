import z from 'zod';
import { MiniSeriesSchema } from './miniSeries';
import { RankSchema } from './rank';
import { TierSchema } from './tier';

export const LeagueEntrySchema = z.object({
  leagueId: z.string(),
  puuid: z.string(),
  queueType: z.string(),
  tier: TierSchema,
  rank: RankSchema,
  leaguePoints: z.number(),
  wins: z.number(),
  losses: z.number(),
  hotStreak: z.boolean(),
  veteran: z.boolean(),
  freshBlood: z.boolean(),
  inactive: z.boolean(),
  miniSeries: MiniSeriesSchema.optional(),
});

export type LeagueEntry = z.infer<typeof LeagueEntrySchema>;
