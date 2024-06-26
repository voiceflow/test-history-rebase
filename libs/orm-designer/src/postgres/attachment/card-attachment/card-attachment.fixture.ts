import type { EntityDTO } from '@mikro-orm/core';

import type { CardAttachmentEntity } from './card-attachment.entity';

export const cardAttachment: EntityDTO<CardAttachmentEntity> = {
  id: 'card-attachment-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  title: ['first card'],
  description: ['card description'],
  buttonOrder: ['card-button-1', 'card-button-2'],
  media: { id: 'media-attachment-1' } as any,
  assistant: { id: 'assistant-1' } as any,
  environmentID: 'environment-1',
};

export const cardAttachmentList: EntityDTO<CardAttachmentEntity>[] = [
  cardAttachment,
  {
    ...cardAttachment,
    id: 'card-attachment-2',
    title: ['second card'],
  },
];
