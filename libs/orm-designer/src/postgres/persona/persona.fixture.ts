import type { EntityDTO } from '@mikro-orm/core';
import { AIModel } from '@voiceflow/dtos';

import type { PersonaEntity } from './persona.entity';

export const persona: EntityDTO<PersonaEntity> = {
  id: 'persona-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first persona',
  model: AIModel.GPT_3_5_TURBO,
  temperature: 0.5,
  maxLength: 140,
  systemPrompt: 'You are a helpful assistant',
  assistant: { id: 'assistant-1' } as any,
  createdBy: { id: 1 } as any,
  updatedBy: { id: 2 } as any,
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
