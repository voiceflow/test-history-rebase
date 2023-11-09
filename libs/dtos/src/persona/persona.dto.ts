import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { PersonaModel } from './persona-model.enum';

export const PersonaDTO = CMSTabularResourceDTO.extend({
  model: z.nativeEnum(PersonaModel),
  maxLength: z.number(),
  temperature: z.number(),
  systemPrompt: z.string(),
}).strict();

export type Persona = z.infer<typeof PersonaDTO>;
