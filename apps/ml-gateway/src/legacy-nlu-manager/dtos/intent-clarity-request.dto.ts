import { z } from 'nestjs-zod/z';

export const IntentClarityRequest = z.object({
  intents: z.array(z.any()),
  platform: z.string(),
  slots: z.array(z.any()),
  topConflicting: z.number(),
});

export type IntentClarityRequest = z.infer<typeof IntentClarityRequest>;
