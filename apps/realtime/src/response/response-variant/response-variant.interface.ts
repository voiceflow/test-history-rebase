import type { AnyResponseVariantCreate, ResponseVariantType } from '@voiceflow/dtos';
import type { ResponseTextVariantORM } from '@voiceflow/orm-designer';

import type { CMSCreateForUserData, CMSPatchData } from '@/common/types';

import type {
  ResponseCardAttachmentCreateOneData,
  ResponseMediaAttachmentCreateOneData,
} from '../response-attachment/response-attachment.interface';

export interface ResponseTextVariantCreateData extends CMSCreateForUserData<ResponseTextVariantORM> {
  type: typeof ResponseVariantType.TEXT;
}

export type ResponseAnyVariantCreateData = ResponseTextVariantCreateData;

export interface ResponseTextVariantPatchData extends CMSPatchData<ResponseTextVariantORM> {
  type: typeof ResponseVariantType.TEXT;
}

export type ResponseAnyVariantPatchData = ResponseTextVariantPatchData;

interface ResponseBaseVariantCreateWithSubResourcesData {
  condition: AnyResponseVariantCreate['condition'];
  attachments: Array<
    | Omit<ResponseCardAttachmentCreateOneData, 'variantID' | 'assistantID' | 'environmentID'>
    | Omit<ResponseMediaAttachmentCreateOneData, 'variantID' | 'assistantID' | 'environmentID'>
  >;
}

export type ResponseTextVariantCreateWithSubResourcesData<Exclude extends keyof ResponseTextVariantCreateData = never> =
  ResponseBaseVariantCreateWithSubResourcesData &
    Omit<ResponseTextVariantCreateData, 'attachmentOrder' | 'conditionID' | Exclude>;

export type ResponseAnyVariantCreateWithSubResourcesData = ResponseTextVariantCreateWithSubResourcesData;
