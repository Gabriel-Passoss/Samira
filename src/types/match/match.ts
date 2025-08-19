import z from "zod";
import { MatchParticipantSchema } from "./participant";
import { TeamSchema } from "./team";

export const MetadataSchema = z.object({
  dataVersion: z.string(),
  matchId: z.string(),
  participants: z.array(z.string()),
});

export const MatchSchema = z.object({
  metadata: MetadataSchema,
  info: z.object({
    gameCreation: z.number(),
    gameDuration: z.number(),
    gameEndTimestamp: z.number(),
    gameId: z.number(),
    gameMode: z.string(),
    gameName: z.string(),
    gameStartTimestamp: z.number(),
    gameType: z.string(),
    gameVersion: z.string(),
    mapId: z.number(),
    platformId: z.string(),
    queueId: z.number(),
    tournamentCode: z.string().optional(),
    teams: z.array(TeamSchema),
    participants: z.array(MatchParticipantSchema),
  }),
});

export type Metadata = z.infer<typeof MetadataSchema>;
export type Match = z.infer<typeof MatchSchema>;