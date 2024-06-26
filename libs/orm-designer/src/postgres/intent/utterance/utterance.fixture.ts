import type { EntityDTO } from '@mikro-orm/core';
import { Language } from '@voiceflow/dtos';

import type { UtteranceEntity } from './utterance.entity';

export const utterance: EntityDTO<UtteranceEntity> = {
  id: 'utterance-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  language: Language.ENGLISH_US,
  text: ['i am hungry'],
  intent: { id: 'intent-id' } as any,
  assistant: { id: 'assistant-id' } as any,
  environmentID: 'environment-1',
};

export const utteranceList: EntityDTO<UtteranceEntity>[] = [
  utterance,
  {
    ...utterance,
    id: 'utterance-2',
    text: ['what are your hours'],
  },
];
