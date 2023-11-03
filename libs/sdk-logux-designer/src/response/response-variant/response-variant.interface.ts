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
  environmentID: string;
  attachmentOrder: string[];
  discriminatorID: string;
}

// models

export interface JSONResponseVariant extends BaseResponseVariant {
  type: ResponseVariantType.JSON;
  json: Markup;
}

export interface TextResponseVariant extends BaseResponseVariant {
  type: ResponseVariantType.TEXT;
  text: Markup;
  speed: number | null;
  cardLayout: CardLayout;
}

export interface PromptResponseVariant extends BaseResponseVariant {
  type: ResponseVariantType.PROMPT;
  turns: number;
  context: ResponseContext;
  promptID: string | null;
}

export type AnyResponseVariant = JSONResponseVariant | TextResponseVariant | PromptResponseVariant;

// create data

interface BaseResponseVariantCreateData {
  condition: AnyConditionCreateData | null;
  attachments: AnyResponseAttachmentCreateData[];
}

export interface JSONResponseVariantCreateData
  extends BaseResponseVariantCreateData,
    Pick<JSONResponseVariant, 'type' | 'json'> {}

export interface TextResponseVariantCreateData
  extends BaseResponseVariantCreateData,
    Pick<TextResponseVariant, 'type' | 'text' | 'speed' | 'cardLayout'> {}

export type PromptResponseVariantCreateData = BaseResponseVariantCreateData &
  Pick<PromptResponseVariant, 'type' | 'turns' | 'context'> &
  (Pick<PromptResponseVariant, 'promptID'> | { prompt: PromptCreateData });

export type AnyResponseVariantCreateData =
  | JSONResponseVariantCreateData
  | TextResponseVariantCreateData
  | PromptResponseVariantCreateData;

// patch data

interface BaseResponseVariantPatchData {
  attachmentOrder?: string[];
}

export interface JSONResponseVariantPatchData
  extends BaseResponseVariantPatchData,
    Partial<Pick<JSONResponseVariant, 'type' | 'json'>> {}

export interface TextResponseVariantPatchData
  extends BaseResponseVariantPatchData,
    Partial<Pick<TextResponseVariant, 'type' | 'text' | 'speed' | 'cardLayout'>> {}

export interface PromptResponseVariantPatchData
  extends BaseResponseVariantPatchData,
    Partial<Pick<PromptResponseVariant, 'type' | 'turns' | 'context' | 'promptID'>> {}
