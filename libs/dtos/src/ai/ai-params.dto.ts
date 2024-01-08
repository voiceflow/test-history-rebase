import { z } from 'zod';

import { AIGPTModel } from './ai-model.enum';

export const AIParamsDTO = z
  .object({
    model: z.nativeEnum(AIGPTModel),
    temperature: z.number(),
    maxTokens: z.number(),
    system: z.string(),
    stop: z.array(z.string()),
  })
  .partial();

export type AIParams = z.infer<typeof AIParamsDTO>;
