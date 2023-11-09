import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { AIGPTModel } from '../ai/ai-model.enum';

export const PersonaDTO = CMSTabularResourceDTO.extend({
  model: z.nativeEnum(AIGPTModel),
  maxLength: z.number(),
  temperature: z.number(),
  systemPrompt: z.string(),
}).strict();

export type Persona = z.infer<typeof PersonaDTO>;
