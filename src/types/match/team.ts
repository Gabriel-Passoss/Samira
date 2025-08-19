import z from 'zod';

export const BanSchema = z.object({
  championId: z.number(),
  pickTurn: z.number(),
});

export const ObjectiveSchema = z.object({
  first: z.boolean(),
  kills: z.number(),
});

export const ObjectivesSchema = z.object({
  baron: ObjectiveSchema,
  champion: ObjectiveSchema,
  dragon: ObjectiveSchema,
  horde: ObjectiveSchema.optional(),
  inhibitor: ObjectiveSchema,
  riftHerald: ObjectiveSchema,
  tower: ObjectiveSchema,
});

export const TeamSchema = z.object({
  bans: z.array(BanSchema),
  objectives: ObjectivesSchema,
  teamId: z.number(),
  win: z.boolean(),
});

export type Ban = z.infer<typeof BanSchema>;
export type Objective = z.infer<typeof ObjectiveSchema>;
export type Objectives = z.infer<typeof ObjectivesSchema>;
export type Team = z.infer<typeof TeamSchema>;
