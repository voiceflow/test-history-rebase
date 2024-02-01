import type { EntityDTO } from '@mikro-orm/core';

import type { CardButtonEntity } from './card-button.entity';

export const cardButton: EntityDTO<CardButtonEntity> = {
  id: 'card-button-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  label: ['first button'],
  card: { id: 'card-1' } as any,
  assistant: { id: 'assistant-1' } as any,
  environmentID: 'environment-1',
};

export const cardButtonList: EntityDTO<CardButtonEntity>[] = [
  cardButton,
  {
    ...cardButton,
    id: 'card-button-2',
    label: ['second button'],
  },
];
