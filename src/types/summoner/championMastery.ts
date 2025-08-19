import z from "zod";

export const ChampionMasterySchema = z.object({
  championId: z.number(),
  championLevel: z.number(),
  championPoints: z.number(),
  lastPlayTime: z.number(),
  championPointsSinceLastLevel: z.number(),
  championPointsUntilNextLevel: z.number(),
  chestGranted: z.boolean(),
  tokensEarned: z.number(),
  summonerId: z.string(),
});

export type ChampionMastery = z.infer<typeof ChampionMasterySchema>;
