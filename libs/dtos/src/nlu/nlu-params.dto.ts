import { z } from 'zod';

export const NLUParamsDTO = z.object({
  confidence: z.number(),
});

export type NLUParams = z.infer<typeof NLUParamsDTO>;
