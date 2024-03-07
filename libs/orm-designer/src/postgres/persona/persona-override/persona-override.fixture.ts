import type { EntityDTO } from '@mikro-orm/core';
import { AIModel } from '@voiceflow/dtos';

import type { PersonaOverrideEntity } from './persona-override.entity';

export const personaOverride: EntityDTO<PersonaOverrideEntity> = {
  id: 'persona-override-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  name: 'first persona override',
  model: AIModel.GPT_3_5_TURBO,
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
