import type { AttachmentType } from '@voiceflow/dtos';
import type { ResponseCardAttachmentORM, ResponseMediaAttachmentORM } from '@voiceflow/orm-designer';

import type { CMSCreateData } from '@/common/types';

export interface ResponseCardAttachmentCreateOneData extends CMSCreateData<ResponseCardAttachmentORM> {
  type: typeof AttachmentType.CARD;
}

export interface ResponseMediaAttachmentCreateOneData extends CMSCreateData<ResponseMediaAttachmentORM> {
  type: typeof AttachmentType.MEDIA;
}

export type ResponseAnyAttachmentCreateData = ResponseCardAttachmentCreateOneData | ResponseMediaAttachmentCreateOneData;

interface ResponseBaseAttachmentReplaceData {
  variantID: string;
  newAttachmentID: string;
  oldResponseAttachmentID: string;
}

export interface ResponseCardAttachmentReplaceData extends ResponseBaseAttachmentReplaceData {
  type: typeof AttachmentType.CARD;
}

export interface ResponseMediaAttachmentReplaceData extends ResponseBaseAttachmentReplaceData {
  type: typeof AttachmentType.MEDIA;
}

export type ResponseAnyAttachmentReplaceData = ResponseCardAttachmentReplaceData | ResponseMediaAttachmentReplaceData;
