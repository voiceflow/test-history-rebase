import { z } from 'zod';

import { AIModel } from './ai-model.enum';

export const AIParamsDTO = z
  .object({
    stop: z.array(z.string()),
    model: z.nativeEnum(AIModel),
    system: z.string(),
    maxTokens: z.number(),
    temperature: z.number(),
  })
  .partial();

export type AIParams = z.infer<typeof AIParamsDTO>;
