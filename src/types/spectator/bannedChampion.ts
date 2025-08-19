import z from "zod";

export const BannedChampionSchema = z.object({
  championId: z.number(),
  teamId: z.number(),
  pickTurn: z.number(),
});

export type BannedChampion = z.infer<typeof BannedChampionSchema>;