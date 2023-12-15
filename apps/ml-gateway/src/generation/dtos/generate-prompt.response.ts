import { z } from 'nestjs-zod/z';

export const GeneratePromptResponse = z.object({
  results: z.array(z.string()),
});

export type GeneratePromptResponse = z.infer<typeof GeneratePromptResponse>;
