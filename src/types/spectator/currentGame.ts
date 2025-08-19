import z from "zod";
import { ParticipantSchema } from "./participant";
import { BannedChampionSchema } from "./bannedChampion";
import { GameCustomizationObjectSchema } from "./gameCustomizationObjectSchema";

export const CurrentGameSchema = z.object({
  gameId: z.number(),
  gameType: z.string(),
  gameStartTime: z.number(),
  mapId: z.number(),
  gameLength: z.number(),
  platformId: z.string(),
  gameMode: z.string(),
  bannedChampions: z.array(BannedChampionSchema),
  gameQueueConfigId: z.number(),
  observers: z.object({
    encryptionKey: z.string(),
  }),
  participants: z.array(ParticipantSchema),
  gameCustomizationObjects: z.array(GameCustomizationObjectSchema),
});

export type CurrentGame = z.infer<typeof CurrentGameSchema>;