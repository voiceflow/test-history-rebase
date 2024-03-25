import type { ToJSON, ToObject } from '@/types';

import type { MediaAttachmentEntity } from './media-attachment.entity';

export type MediaAttachmentObject = ToObject<MediaAttachmentEntity>;
export type MediaAttachmentJSON = ToJSON<MediaAttachmentObject>;
