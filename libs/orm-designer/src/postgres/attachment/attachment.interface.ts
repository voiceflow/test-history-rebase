import type { CardAttachmentEntity } from './card-attachment/card-attachment.entity';
import type { CardAttachmentJSON, CardAttachmentObject } from './card-attachment/card-attachment.interface';
import type { MediaAttachmentEntity } from './media-attachment/media-attachment.entity';
import type { MediaAttachmentJSON, MediaAttachmentObject } from './media-attachment/media-attachment.interface';

export type AnyAttachmentJSON = CardAttachmentJSON | MediaAttachmentJSON;
export type AnyAttachmentObject = CardAttachmentObject | MediaAttachmentObject;
export type AnyAttachmentEntity = CardAttachmentEntity | MediaAttachmentEntity;
