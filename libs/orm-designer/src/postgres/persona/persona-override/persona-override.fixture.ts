import type { EntityDTO } from '@mikro-orm/core';

import { PersonaModel } from '../persona-model.enum';
import type { PersonaOverrideEntity } from './persona-override.entity';

export const personaOverride: EntityDTO<PersonaOverrideEntity> = {
  id: 'persona-override-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedByID: 1,
  name: 'first persona override',
  model: PersonaModel.GPT_3_5,
  temperature: 0.5,
  maxLength: 140,
  systemPrompt: 'You are a helpful assistant',
  assistant: { id: 'assistant-1' } as any,
  persona: { id: 'persona-1' } as any,
  environmentID: 'environment-1',
};

export const personaOverrideList: EntityDTO<PersonaOverrideEntity>[] = [
  personaOverride,
  {
    ...personaOverride,
    id: 'persona-override-2',
    name: 'second persona override',
    systemPrompt: 'You are a helpless assistant',
  },
];
