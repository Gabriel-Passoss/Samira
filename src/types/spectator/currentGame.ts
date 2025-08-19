import z from 'zod';
import { BannedChampionSchema } from './bannedChampion';
import { GameCustomizationObjectSchema } from './gameCustomizationObject';
import { SpectatorParticipantSchema } from './participant';

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
  participants: z.array(SpectatorParticipantSchema),
  gameCustomizationObjects: z.array(GameCustomizationObjectSchema).optional(),
});

export type CurrentGame = z.infer<typeof CurrentGameSchema>;
