import type { Markup, ObjectResource } from '../../common';
import type { AnyConditionCreateData } from '../../condition/condition.interface';
import type { PromptCreateData } from '../../prompt/prompt.interface';
import type { AnyResponseAttachmentCreateData } from '../response-attachment/response-attachment.interface';
import type { CardLayout } from './card-layout.enum';
import type { ResponseContext } from './response-context.enum';
import type { ResponseVariantType } from './response-variant-type.enum';

interface BaseResponseVariant extends ObjectResource {
  conditionID: string | null;
  assistantID: string;
  attachmentOrder: string[];
  discriminatorID: string;
}

interface JSONResponseVariantData {
  type: ResponseVariantType.JSON;
  json: Markup;
}

interface TextResponseVariantData {
  type: ResponseVariantType.TEXT;
  text: Markup;
  speed: number | null;
  cardLayout: CardLayout;
}

interface PromptResponseVariantData {
  type: ResponseVariantType.PROMPT;
  turns: number;
  context: ResponseContext;
  promptID: string | null;
}

// models

export interface JSONResponseVariant extends BaseResponseVariant, JSONResponseVariantData {}

export interface TextResponseVariant extends BaseResponseVariant, TextResponseVariantData {}

export interface PromptResponseVariant extends BaseResponseVariant, PromptResponseVariantData {}

export type AnyResponseVariant = JSONResponseVariant | TextResponseVariant | PromptResponseVariant;

// create data

interface BaseResponseVariantCreateData {
  condition: AnyConditionCreateData | null;
  attachments: AnyResponseAttachmentCreateData[];
}

export interface JSONResponseVariantCreateData extends BaseResponseVariantCreateData, JSONResponseVariantData {}
export interface TextResponseVariantCreateData extends BaseResponseVariantCreateData, TextResponseVariantData {}

export type PromptResponseVariantCreateData = BaseResponseVariantCreateData &
  Omit<PromptResponseVariantData, 'promptID'> &
  (Pick<PromptResponseVariantData, 'promptID'> | { prompt: PromptCreateData });

export type AnyResponseVariantCreateData =
  | JSONResponseVariantCreateData
  | TextResponseVariantCreateData
  | PromptResponseVariantCreateData;

// patch data

interface BaseResponseVariantPatchData {
  attachmentOrder?: string[];
}

export interface JSONResponseVariantPatchData extends BaseResponseVariantPatchData, Partial<JSONResponseVariantData> {}
export interface TextResponseVariantPatchData extends BaseResponseVariantPatchData, Partial<TextResponseVariantData> {}
export interface PromptResponseVariantPatchData
  extends BaseResponseVariantPatchData,
    Partial<PromptResponseVariantData> {}
