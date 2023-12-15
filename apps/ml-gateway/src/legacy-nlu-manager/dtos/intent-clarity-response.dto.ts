import { z } from 'nestjs-zod/z';

export const ProblematicSentence = z.object({
  sentence: z.string(),
  conflictingSentence: z.string(),
  intentID: z.string(),
});

export const IntentClarityResponse = z.object({
  clarityByClass: z.record(z.number()),
  overallScores: z.object({
    clarity: z.number(),
    confidence: z.number(),
  }),
  problematicSentences: z.record(z.array(ProblematicSentence)),
  utteranceMapper: z.record(z.string()),
});

export type IntentClarityResponse = z.infer<typeof IntentClarityResponse>;
