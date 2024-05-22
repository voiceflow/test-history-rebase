import { z } from 'zod';

import { AIModel } from '@/ai/ai-model.enum';

export const PromptSettingsDTO = z
  .object({
    model: z.nativeEnum(AIModel),
    maxLength: z.number().nullable(),
    temperature: z.number().nullable(),
    systemPrompt: z.string().nullable(),
  })
  .strict();

export type PromptSettings = z.infer<typeof PromptSettingsDTO>;
