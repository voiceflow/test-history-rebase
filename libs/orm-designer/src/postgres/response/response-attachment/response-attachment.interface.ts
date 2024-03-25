import type { ToJSON, ToObject } from '@/types';

import type {
  BaseResponseAttachmentEntity,
  ResponseCardAttachmentEntity,
  ResponseMediaAttachmentEntity,
} from './response-attachment.entity';

export type BaseResponseAttachmentObject = ToObject<BaseResponseAttachmentEntity>;
export type BaseResponseAttachmentJSON = ToJSON<BaseResponseAttachmentObject>;

export type ResponseCardAttachmentObject = ToObject<ResponseCardAttachmentEntity>;
export type ResponseCardAttachmentJSON = ToJSON<ResponseCardAttachmentObject>;

export type ResponseMediaAttachmentObject = ToObject<ResponseMediaAttachmentEntity>;
export type ResponseMediaAttachmentJSON = ToJSON<ResponseMediaAttachmentObject>;

export type AnyResponseAttachmentJSON = ResponseCardAttachmentJSON | ResponseMediaAttachmentJSON;
export type AnyResponseAttachmentEntity = ResponseCardAttachmentEntity | ResponseMediaAttachmentEntity;
export type AnyResponseAttachmentObject = ResponseCardAttachmentObject | ResponseMediaAttachmentObject;
