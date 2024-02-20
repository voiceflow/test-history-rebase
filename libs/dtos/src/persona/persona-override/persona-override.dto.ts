import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { AIModel } from '../../ai/ai-model.enum';

export const PersonaOverrideDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    name: z.string().max(255, 'Name is too long.').nullable(),
    model: z.nativeEnum(AIModel).nullable(),
    maxLength: z.number().nullable(),
    personaID: z.string(),
    temperature: z.number().nullable(),
    assistantID: z.string().optional(),
    systemPrompt: z.string().nullable(),
    environmentID: z.string().optional(),
  })
  .strict();

export type PersonaOverride = z.infer<typeof PersonaOverrideDTO>;
