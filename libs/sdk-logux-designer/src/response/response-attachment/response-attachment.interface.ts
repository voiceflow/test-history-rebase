import type { AttachmentType } from '@/attachment/attachment-type.enum';
import type { RelationshipResource } from '@/common';

interface BaseResponseAttachment extends RelationshipResource {
  assistantID: string;
}

interface ResponseCardAttachmentData {
  type: AttachmentType.CARD;
  cardID: string;
}

interface ResponseMediaAttachmentData {
  type: AttachmentType.MEDIA;
  mediaID: string;
}

// models
export interface ResponseCardAttachment extends BaseResponseAttachment, ResponseCardAttachmentData {}
export interface ResponseMediaAttachment extends BaseResponseAttachment, ResponseMediaAttachmentData {}

export type AnyResponseAttachment = ResponseCardAttachment | ResponseMediaAttachment;

// create data
export interface ResponseCardAttachmentCreateData extends ResponseCardAttachmentData {}
export interface ResponseMediaAttachmentCreateData extends ResponseMediaAttachmentData {}

export type AnyResponseAttachmentCreateData = ResponseCardAttachmentCreateData | ResponseMediaAttachmentCreateData;
