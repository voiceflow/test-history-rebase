import type { ToJSON, ToObject } from '@/types';

import type { CardAttachmentEntity } from './card-attachment.entity';

export type CardAttachmentObject = ToObject<CardAttachmentEntity>;
export type CardAttachmentJSON = ToJSON<CardAttachmentObject>;
