import { z } from 'nestjs-zod/z';

export const GenerateUtteranceResponse = z.object({
  results: z.array(z.string()),

  suggestedIntentName: z.string().optional(),
});

export type GenerateUtteranceResponse = z.infer<typeof GenerateUtteranceResponse>;
