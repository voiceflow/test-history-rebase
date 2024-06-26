import type { EntityDTO } from '@mikro-orm/core';

import type { PromptEntity } from './prompt.entity';

export const prompt: EntityDTO<PromptEntity> = {
  id: 'prompt-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first prompt',
  text: ['hello world'],
  persona: { id: 'persona-override-1' } as any,
  assistant: { id: 'assistant-1' } as any,
  createdBy: { id: 1 } as any,
  updatedBy: { id: 2 } as any,
  folder: null,
  environmentID: 'environment-1',
};

export const promptList: EntityDTO<PromptEntity>[] = [
  prompt,
  {
    ...prompt,
    id: 'prompt-2',
    name: 'second prompt',
    text: ['see ya later alligator'],
  },
];
