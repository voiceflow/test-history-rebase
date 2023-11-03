import type { AttachmentType } from '@/attachment/attachment-type.enum';
import type { RelationshipResource } from '@/common';

interface BaseResponseAttachment extends RelationshipResource {
  assistantID: string;
  environmentID: string;
}

// models
export interface ResponseCardAttachment extends BaseResponseAttachment {
  type: AttachmentType.CARD;
  cardID: string;
}

export interface ResponseMediaAttachment extends BaseResponseAttachment {
  type: AttachmentType.MEDIA;
  mediaID: string;
}

export type AnyResponseAttachment = ResponseCardAttachment | ResponseMediaAttachment;

// create data

export interface ResponseCardAttachmentCreateData extends Pick<ResponseCardAttachment, 'type' | 'cardID'> {}

export interface ResponseMediaAttachmentCreateData extends Pick<ResponseMediaAttachment, 'type' | 'mediaID'> {}

export type AnyResponseAttachmentCreateData = ResponseCardAttachmentCreateData | ResponseMediaAttachmentCreateData;
