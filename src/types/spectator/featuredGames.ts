import z from "zod";
import { SpectatorParticipantSchema } from "./participant";
import { BannedChampionSchema } from "./bannedChampion";

export const FeaturedGameInfoSchema = z.object({
  gameMode: z.string(),
  gameLength: z.number(),
  mapId: z.number(),
  gameType: z.string(),
  bannedChampions: z.array(BannedChampionSchema),
  gameId: z.number(),
  observers: z.object({
    encryptionKey: z.string(),
  }),
  gameQueueConfigId: z.number(),
  participants: z.array(SpectatorParticipantSchema),
  platformId: z.string(),
});

export const FeaturedGamesSchema = z.object({
  gameList: z.array(FeaturedGameInfoSchema),
  clientRefreshInterval: z.number().optional(),
});

export type FeaturedGameInfo = z.infer<typeof FeaturedGameInfoSchema>;
export type FeaturedGames = z.infer<typeof FeaturedGamesSchema>;