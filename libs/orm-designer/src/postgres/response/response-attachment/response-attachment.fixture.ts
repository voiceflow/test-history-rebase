import type { EntityDTO } from '@mikro-orm/core';
import { AttachmentType } from '@voiceflow/dtos';

import type { ResponseCardAttachmentEntity, ResponseMediaAttachmentEntity } from './response-attachment.entity';

const baseResponseAttachment = {
  createdAt: new Date(),
  assistant: { id: 'assistant-1' } as any,
};

export const responseCardAttachment: EntityDTO<ResponseCardAttachmentEntity> = {
  ...baseResponseAttachment,
  id: 'response-attachment-1',
  type: AttachmentType.CARD,
  card: { id: 'card-attachment-1' } as any,
  variant: { id: 'variant-1' } as any,
  environmentID: 'environment-1',
};

export const responseMediaAttachment: EntityDTO<ResponseMediaAttachmentEntity> = {
  ...baseResponseAttachment,
  id: 'response-attachment-2',
  type: AttachmentType.MEDIA,
  media: { id: 'media-attachment-1' } as any,
  variant: { id: 'variant-1' } as any,
  environmentID: 'environment-1',
};

export const responseAttachmentList = [responseCardAttachment, responseMediaAttachment];
