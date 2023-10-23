import type { EntityDTO } from '@mikro-orm/core';

import type { PersonaEntity } from './persona.entity';
import { PersonaModel } from './persona-model.enum';

export const persona: EntityDTO<PersonaEntity> = {
  id: 'persona-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first persona',
  model: PersonaModel.GPT_3_5,
  temperature: 0.5,
  maxLength: 140,
  systemPrompt: 'You are a helpful assistant',
  assistant: { id: 'assistant-1' } as any,
  createdByID: 1,
  updatedByID: 2,
  folder: null,
  environmentID: 'environment-1',
};

export const personaList: EntityDTO<PersonaEntity>[] = [
  persona,
  {
    ...persona,
    id: 'persona-2',
    name: 'second persona',
    systemPrompt: 'You are a helpless assistant',
  },
];
