import type { ResponseVariantType } from '@voiceflow/dtos';
import type { ResponseJSONVariantORM, ResponsePromptVariantORM, ResponseTextVariantORM } from '@voiceflow/orm-designer';

import type { CreateOneForUserData, PatchOneData } from '@/common/types';

import type { ResponseCardAttachmentCreateOneData, ResponseMediaAttachmentCreateOneData } from '../response-attachment/response-attachment.interface';

export interface ResponseTextVariantCreateData extends CreateOneForUserData<ResponseTextVariantORM> {
  type: typeof ResponseVariantType.TEXT;
}

export interface ResponseJSONVariantCreateData extends CreateOneForUserData<ResponseJSONVariantORM> {
  type: typeof ResponseVariantType.JSON;
}

export interface ResponsePromptVariantCreateData extends CreateOneForUserData<ResponsePromptVariantORM> {
  type: typeof ResponseVariantType.PROMPT;
}

export type ResponseAnyVariantCreateData = ResponseTextVariantCreateData | ResponseJSONVariantCreateData | ResponsePromptVariantCreateData;

export interface ResponseTextVariantPatchData extends PatchOneData<ResponseTextVariantORM> {
  type: typeof ResponseVariantType.TEXT;
}

export interface ResponseJSONVariantPatchData extends PatchOneData<ResponseJSONVariantORM> {
  type: typeof ResponseVariantType.JSON;
}

export interface ResponsePromptVariantPatchData extends PatchOneData<ResponsePromptVariantORM> {
  type: typeof ResponseVariantType.PROMPT;
}

export type ResponseAnyVariantPatchData = ResponseTextVariantPatchData | ResponseJSONVariantPatchData | ResponsePromptVariantPatchData;

// TODO: add condition support
interface ResponseBaseVariantCreateWithSubResourcesData {
  attachments: Array<
    | Omit<ResponseCardAttachmentCreateOneData, 'variantID' | 'assistantID' | 'environmentID'>
    | Omit<ResponseMediaAttachmentCreateOneData, 'variantID' | 'assistantID' | 'environmentID'>
  >;
}

export type ResponseTextVariantCreateWithSubResourcesData<Exclude extends keyof ResponseTextVariantCreateData = never> =
  ResponseBaseVariantCreateWithSubResourcesData & Omit<ResponseTextVariantCreateData, 'attachmentOrder' | 'conditionID' | Exclude>;

export type ResponseJSONVariantCreateWithSubResourcesData<Exclude extends keyof ResponseJSONVariantCreateData = never> =
  ResponseBaseVariantCreateWithSubResourcesData & Omit<ResponseJSONVariantCreateData, 'attachmentOrder' | 'conditionID' | Exclude>;

export type ResponseAnyVariantCreateWithSubResourcesData =
  | ResponseTextVariantCreateWithSubResourcesData
  | ResponseJSONVariantCreateWithSubResourcesData;

export interface ResponseTextVariantCreateOptions {
  discriminatorOrderInsertIndex?: number;
}
