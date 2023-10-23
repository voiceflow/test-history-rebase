import type { EntityDTO } from '@mikro-orm/core';

import type { MediaAttachmentEntity } from './media-attachment.entity';
import { MediaDatatype } from './media-datatype.enum';

const baseAttachment = {
  createdAt: new Date(),
  updatedAt: new Date(),
  isAsset: true,
  assistant: { id: 'assistant-1' } as any,
};

export const imageAttachment: EntityDTO<MediaAttachmentEntity> = {
  ...baseAttachment,
  id: 'media-attachment-1',
  name: 'image attachment',
  datatype: MediaDatatype.IMAGE,
  url: ['https://example.com/image.png'],
  environmentID: 'environment-1',
};

export const videoAttachment: EntityDTO<MediaAttachmentEntity> = {
  ...baseAttachment,
  id: 'media-attachment-2',
  name: 'video attachment',
  datatype: MediaDatatype.VIDEO,
  url: ['https://example.com/video.mov'],
  environmentID: 'environment-1',
};

export const mediaAttachmentList: EntityDTO<MediaAttachmentEntity>[] = [imageAttachment, videoAttachment];
