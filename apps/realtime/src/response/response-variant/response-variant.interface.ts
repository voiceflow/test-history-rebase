import type { ResponseJSONVariantORM, ResponsePromptVariantORM, ResponseTextVariantORM, ResponseVariantType } from '@voiceflow/orm-designer';

import type { CreateOneData, PatchOneData } from '@/common/types';
import { PromptCreateData } from '@/prompt/prompt.interface';

import type { ResponseCardAttachmentCreateOneData, ResponseMediaAttachmentCreateOneData } from '../response-attachment/response-attachment.interface';

export interface ResponseTextVariantCreateData extends CreateOneData<ResponseTextVariantORM> {
  type: typeof ResponseVariantType.TEXT;
}

export interface ResponseJSONVariantCreateData extends CreateOneData<ResponseJSONVariantORM> {
  type: typeof ResponseVariantType.JSON;
}

export interface ResponsePromptVariantCreateData extends CreateOneData<ResponsePromptVariantORM> {
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

export type ResponsePromptVariantCreateWithSubResourcesData<Exclude extends keyof ResponsePromptVariantCreateData = never> =
  ResponseBaseVariantCreateWithSubResourcesData &
    Omit<ResponsePromptVariantCreateData, 'attachmentOrder' | 'conditionID' | 'promptID' | Exclude> &
    (Pick<ResponsePromptVariantCreateData, 'promptID'> | { prompt: Pick<PromptCreateData, 'text' | 'personaID'> & { name?: string } });

export type ResponseAnyVariantCreateWithSubResourcesData =
  | ResponseTextVariantCreateWithSubResourcesData
  | ResponseJSONVariantCreateWithSubResourcesData
  | ResponsePromptVariantCreateWithSubResourcesData;

export interface ResponseTextVariantCreateOptions {
  discriminatorOrderInsertIndex?: number;
}
