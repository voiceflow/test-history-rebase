import type {
  AnyResponseAttachment,
  AnyResponseVariant,
  AnyResponseVariantWithData,
  JSONResponseVariant,
  Prompt,
  PromptResponseVariant,
  PromptResponseVariantWithPrompt,
  ResponseCardAttachment,
  TextResponseVariant,
} from '@voiceflow/sdk-logux-designer';
import { AttachmentType, ResponseVariantType } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { isMarkupEmpty } from './markup.util';
import { isPromptEmpty } from './prompt.util';

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

export const isPromptResponseVariant = (responseVariant: AnyResponseVariant): responseVariant is PromptResponseVariant =>
  responseVariant.type === ResponseVariantType.PROMPT;

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
  promptsMap,
}: {
  variant: AnyResponseVariant;
  promptsMap: Record<string, Prompt>;
}): AnyResponseVariantWithData => {
  return match(variant)
    .when(isJSONResponseVariant, (variant) => ({ ...variant }))
    .when(isPromptResponseVariant, (variant): AnyResponseVariantWithData => ({ ...variant, prompt: promptsMap[variant.promptID || ''] }))
    .when(isTextResponseVariant, (variant) => ({ ...variant }))
    .exhaustive();
};
