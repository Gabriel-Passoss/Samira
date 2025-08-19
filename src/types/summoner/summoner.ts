import z from 'zod';

export const SummonerSchema = z.object({
  profileIconId: z.number(),
  revisionDate: z.number(),
  puuid: z.string(),
  summonerLevel: z.number(),
});

export type Summoner = z.infer<typeof SummonerSchema>;
