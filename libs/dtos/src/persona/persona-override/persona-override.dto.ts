import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { AIGPTModel } from '../../ai/ai-model.enum';

export const PersonaOverrideDTO = CMSObjectResourceDTO.extend({
  name: z.string().min(1, 'Name is required.').max(255, 'Name is too long.').nullable(),
  model: z.nativeEnum(AIGPTModel).nullable(),
  maxLength: z.number().nullable(),
  personaID: z.string(),
  temperature: z.number().nullable(),
  assistantID: z.string(),
  systemPrompt: z.string().nullable(),
  environmentID: z.string(),
}).strict();

export type PersonaOverride = z.infer<typeof PersonaOverrideDTO>;
