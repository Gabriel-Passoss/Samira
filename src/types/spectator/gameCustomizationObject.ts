import z from "zod";

export const GameCustomizationObjectSchema = z.object({
  category: z.string(),
  content: z.string(),
});

export type GameCustomizationObject = z.infer<typeof GameCustomizationObjectSchema>;