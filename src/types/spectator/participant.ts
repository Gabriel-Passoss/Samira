import z from 'zod';
import { GameCustomizationObjectSchema } from './gameCustomizationObject';

export const SpectatorPerksSchema = z.object({
  perkIds: z.array(z.number()),
  perkStyle: z.number(),
  perkSubStyle: z.number(),
});

export const SpectatorParticipantSchema = z.object({
  championId: z.number(),
  profileIconId: z.number(),
  bot: z.boolean(),
  teamId: z.number(),
  puuid: z.string(),
  spell1Id: z.number(),
  spell2Id: z.number(),
  perks: SpectatorPerksSchema.optional(),
  gameCustomizationObjects: z.array(GameCustomizationObjectSchema).optional(),
});

export type Perks = z.infer<typeof SpectatorPerksSchema>;
export type Participant = z.infer<typeof SpectatorParticipantSchema>;
