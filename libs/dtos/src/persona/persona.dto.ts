import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { AIModel } from '../ai/ai-model.enum';

export const PersonaDTO = CMSTabularResourceDTO.extend({
  model: z.nativeEnum(AIModel),
  maxLength: z.number(),
  temperature: z.number(),
  systemPrompt: z.string(),
}).strict();

export type Persona = z.infer<typeof PersonaDTO>;
