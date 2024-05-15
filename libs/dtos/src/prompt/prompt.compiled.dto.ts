import { z } from 'zod';

import { AIModel } from '@/ai/ai-model.enum';

export const CompiledPromptSettingsDTO = z.object({
  model: z.nativeEnum(AIModel),
  maxLength: z.number(),
  temperature: z.number(),
  systemPrompt: z.string(),
});

export type CompiledPromptSettings = z.infer<typeof CompiledPromptSettingsDTO>;

export const CompiledPromptDTO = z.object({
  text: z.string(),
  settings: CompiledPromptSettingsDTO.nullable(),
});

export type CompiledPrompt = z.infer<typeof CompiledPromptDTO>;
