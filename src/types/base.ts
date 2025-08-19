import { z } from 'zod';

export const BaseApiResponse = z.object({
  status: z.number(),
  message: z.string().optional(),
});

export type BaseApiResponse = z.infer<typeof BaseApiResponse>;
