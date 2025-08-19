import z from 'zod';

export const MiniSeriesSchema = z.object({
  losses: z.number(),
  progress: z.string(),
  target: z.number(),
  wins: z.number(),
});

export type MiniSeries = z.infer<typeof MiniSeriesSchema>;
