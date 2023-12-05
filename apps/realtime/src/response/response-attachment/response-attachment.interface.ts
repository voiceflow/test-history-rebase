import type { AttachmentType } from '@voiceflow/orm-designer';

import type { CreateOneData } from '@/common/types';

import type { ResponseCardAttachmentService } from './response-card-attachment.service';
import type { ResponseMediaAttachmentService } from './response-media-attachment.service';

export interface ResponseCardAttachmentCreateOneData extends CreateOneData<ResponseCardAttachmentService> {
  type: typeof AttachmentType.CARD;
}

export interface ResponseMediaAttachmentCreateOneData extends CreateOneData<ResponseMediaAttachmentService> {
  type: typeof AttachmentType.MEDIA;
}

export type ResponseAnyAttachmentCreateData = ResponseCardAttachmentCreateOneData | ResponseMediaAttachmentCreateOneData;

interface ResponseBaseAttachmentReplaceData {
  variantID: string;
  environmentID: string;
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
