import { z } from 'nestjs-zod/z';

export const GenerateEntityRepromptResponse = z.object({
  results: z.array(z.string()),
});

export type GenerateEntityRepromptResponse = z.infer<typeof GenerateEntityRepromptResponse>;
