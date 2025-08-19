import z from 'zod';

export const DataDragonConfigSchema = z.object({
  version: z.string().optional(),
  language: z.string().optional(),
  baseUrl: z.string().optional(),
  includeFullUrl: z.boolean().optional(),
});

export type DataDragonConfig = z.infer<typeof DataDragonConfigSchema>;
