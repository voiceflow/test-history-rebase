import type { AttachmentType } from '@voiceflow/orm-designer';

import type { CreateOneData } from '@/common/types';

import type { ResponseCardAttachmentService } from './response-card-attachment.service';
import type { ResponseMediaAttachmentService } from './response-media-attachment.service';

export interface ResponseCardAttachmentCreateOneData extends CreateOneData<ResponseCardAttachmentService> {
  type: AttachmentType.CARD;
}

export interface ResponseMediaAttachmentCreateOneData extends CreateOneData<ResponseMediaAttachmentService> {
  type: AttachmentType.MEDIA;
}

export type ResponseAnyAttachmentCreateData = ResponseCardAttachmentCreateOneData | ResponseMediaAttachmentCreateOneData;

interface ResponseBaseAttachmentReplaceData {
  variantID: string;
  environmentID: string;
  newAttachmentID: string;
  oldResponseAttachmentID: string;
}

export interface ResponseCardAttachmentReplaceData extends ResponseBaseAttachmentReplaceData {
  type: AttachmentType.CARD;
}

export interface ResponseMediaAttachmentReplaceData extends ResponseBaseAttachmentReplaceData {
  type: AttachmentType.MEDIA;
}

export type ResponseAnyAttachmentReplaceData = ResponseCardAttachmentReplaceData | ResponseMediaAttachmentReplaceData;

export interface ResponseCardAttachmentCreateRefData
  extends Omit<ResponseCardAttachmentCreateOneData, 'variantID' | 'assistantID' | 'environmentID'> {}

export interface ResponseMediaAttachmentCreateRefData
  extends Omit<ResponseMediaAttachmentCreateOneData, 'variantID' | 'assistantID' | 'environmentID'> {}

export type ResponseAnyAttachmentCreateRefData = ResponseCardAttachmentCreateRefData | ResponseMediaAttachmentCreateRefData;
