import type { ResponseJSONVariantORM, ResponsePromptVariantORM, ResponseTextVariantORM, ResponseVariantType } from '@voiceflow/orm-designer';

import type { CreateOneData, PatchOneData } from '@/common/types';

import type { PromptCreateRefData } from '../../prompt/prompt.interface';
import type { ResponseAnyAttachmentCreateRefData } from '../response-attachment/response-attachment.interface';

// TODO: add condition support
interface ResponseBaseVariantCreateData {
  attachments: ResponseAnyAttachmentCreateRefData[];
}

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

export type ResponseTextVariantCreateRefData<Exclude extends keyof ResponseTextVariantCreateData = never> = ResponseBaseVariantCreateData &
  Omit<ResponseTextVariantCreateData, 'attachmentOrder' | 'conditionID' | Exclude>;

export type ResponseJSONVariantCreateRefData<Exclude extends keyof ResponseJSONVariantCreateData = never> = ResponseBaseVariantCreateData &
  Omit<ResponseJSONVariantCreateData, 'attachmentOrder' | 'conditionID' | Exclude>;

export type ResponsePromptVariantCreateRefData<Exclude extends keyof ResponsePromptVariantCreateData = never> = ResponseBaseVariantCreateData &
  Omit<ResponsePromptVariantCreateData, 'attachmentOrder' | 'conditionID' | 'promptID' | Exclude> &
  (Pick<ResponsePromptVariantCreateData, 'promptID'> | { prompt: PromptCreateRefData });

export type ResponseAnyVariantCreateRefData =
  | ResponseTextVariantCreateRefData
  | ResponseJSONVariantCreateRefData
  | ResponsePromptVariantCreateRefData;
