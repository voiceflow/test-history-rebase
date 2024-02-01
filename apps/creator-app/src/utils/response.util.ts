import type {
  AnyResponseAttachment,
  AnyResponseVariant,
  AnyResponseVariantWithData,
  JSONResponseVariant,
  JSONResponseVariantCreate,
  Prompt,
  PromptCreate,
  PromptResponseVariantCreate,
  PromptResponseVariantWithPrompt,
  ResponseCardAttachment,
  TextResponseVariant,
  TextResponseVariantCreate,
} from '@voiceflow/dtos';
import { AttachmentType, CardLayout, ResponseContext, ResponseVariantType } from '@voiceflow/dtos';
import { isMarkupEmpty, markupFactory } from '@voiceflow/utils-designer';
import { match } from 'ts-pattern';

import { isPromptEmpty } from './prompt.util';

export const responseTextVariantCreateDataFactory = ({
  text = markupFactory(),
  speed = null,
  condition = null,
  cardLayout = CardLayout.CAROUSEL,
  attachments = [],
}: Partial<TextResponseVariantCreate> = {}): TextResponseVariantCreate => ({
  text,
  type: ResponseVariantType.TEXT,
  speed,
  condition,
  cardLayout,
  attachments,
});

export const responseJSONVariantCreateDataFactory = ({
  json = markupFactory(),
  condition = null,
  attachments = [],
}: Partial<JSONResponseVariantCreate> = {}): JSONResponseVariantCreate => ({
  json,
  type: ResponseVariantType.JSON,
  condition,
  attachments,
});

const isPromptData = (data: Partial<PromptResponseVariantCreate>): data is { promptID: string } | { prompt: PromptCreate } =>
  ('promptID' in data && data.promptID !== undefined) || ('prompt' in data && data.prompt !== undefined);

export const responsePromptVariantCreateDataFactory = ({
  turns = 1,
  context = ResponseContext.PROMPT,
  condition = null,
  attachments = [],
  ...data
}: Partial<PromptResponseVariantCreate> = {}): PromptResponseVariantCreate => ({
  ...(isPromptData(data) ? data : { promptID: null }),
  type: ResponseVariantType.PROMPT,
  turns,
  context,
  condition,
  attachments,
});

type PartialJSONResponseVariant = Pick<JSONResponseVariant, 'id' | 'type' | 'json'>;
type PartialTextResponseVariant = Pick<TextResponseVariant, 'id' | 'type' | 'text'>;
type PartialPromptResponseVariant = Pick<PromptResponseVariantWithPrompt, 'id' | 'type' | 'prompt'>;

type AnyPartialResponseVariant = PartialJSONResponseVariant | PartialTextResponseVariant | PartialPromptResponseVariant;

export const isCardResponseAttachment = (responseAttachment: AnyResponseAttachment): responseAttachment is ResponseCardAttachment =>
  responseAttachment.type === AttachmentType.CARD;

export const isTextResponseVariant = (responseVariant: AnyResponseVariant): responseVariant is TextResponseVariant =>
  responseVariant.type === ResponseVariantType.TEXT;

export const isJSONResponseVariant = (responseVariant: AnyResponseVariant): responseVariant is JSONResponseVariant =>
  responseVariant.type === ResponseVariantType.JSON;

export const isJSONResponseVariantEmpty = (responseVariant: JSONResponseVariant | PartialJSONResponseVariant) => isMarkupEmpty(responseVariant.json);

export const isTextResponseVariantEmpty = (responseVariant: TextResponseVariant | PartialTextResponseVariant) => isMarkupEmpty(responseVariant.text);

export const isPromptResponseVariantWidthDataEmpty = (responseVariant: PromptResponseVariantWithPrompt | PartialPromptResponseVariant) =>
  isPromptEmpty(responseVariant.prompt);

export const isAnyResponseVariantWithDataEmpty = (responseVariant: AnyResponseVariantWithData | AnyPartialResponseVariant) =>
  match(responseVariant)
    .with({ type: ResponseVariantType.JSON }, isJSONResponseVariantEmpty)
    .with({ type: ResponseVariantType.TEXT }, isTextResponseVariantEmpty)
    .with({ type: ResponseVariantType.PROMPT }, isPromptResponseVariantWidthDataEmpty)
    .exhaustive();

export const getResponseVariantWithData = ({
  variant,
}: {
  variant: AnyResponseVariant;
  promptsMap: Record<string, Prompt>;
}): AnyResponseVariantWithData => {
  return match(variant)
    .when(isJSONResponseVariant, (variant) => ({ ...variant }))
    .when(isTextResponseVariant, (variant) => ({ ...variant }))
    .exhaustive();
};
