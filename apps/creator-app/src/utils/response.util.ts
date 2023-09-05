import type {
  AnyResponseAttachment,
  AnyResponseVariant,
  AnyResponseVariantData,
  AnyResponseVariantWithData,
  JSONResponseVariant,
  JSONResponseVariantData,
  Prompt,
  PromptResponseVariant,
  PromptResponseVariantData,
  PromptResponseVariantWithPrompt,
  ResponseCardAttachment,
  TextResponseVariant,
  TextResponseVariantData,
} from '@voiceflow/sdk-logux-designer';
import { AttachmentType, ResponseVariantType } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { isMarkupEmpty } from './markup.util';
import { isPromptEmpty } from './prompt.util';

export const isCardResponseAttachment = (responseAttachment: AnyResponseAttachment): responseAttachment is ResponseCardAttachment =>
  responseAttachment.type === AttachmentType.CARD;

export const isTextResponseVariant = (responseVariant: AnyResponseVariant): responseVariant is TextResponseVariant =>
  responseVariant.type === ResponseVariantType.TEXT;

export const isJSONResponseVariant = (responseVariant: AnyResponseVariant): responseVariant is JSONResponseVariant =>
  responseVariant.type === ResponseVariantType.JSON;

export const isPromptResponseVariant = (responseVariant: AnyResponseVariant): responseVariant is PromptResponseVariant =>
  responseVariant.type === ResponseVariantType.PROMPT;

export const isJSONResponseVariantEmpty = (responseVariant: JSONResponseVariant) => isMarkupEmpty(responseVariant.json);

export const isTextResponseVariantEmpty = (responseVariant: TextResponseVariant) => isMarkupEmpty(responseVariant.text);

export const isPromptResponseVariantWidthDataEmpty = (responseVariant: PromptResponseVariantWithPrompt) => isPromptEmpty(responseVariant.prompt);

export const isAnyResponseVariantWithDataEmpty = (responseVariant: AnyResponseVariantWithData) =>
  match(responseVariant)
    .with({ type: ResponseVariantType.JSON }, isJSONResponseVariantEmpty)
    .with({ type: ResponseVariantType.TEXT }, isTextResponseVariantEmpty)
    .with({ type: ResponseVariantType.PROMPT }, isPromptResponseVariantWidthDataEmpty)
    .exhaustive();

export const getResponseVariantData = (responseVariant: AnyResponseVariant): AnyResponseVariantData => {
  return match(responseVariant)
    .when(isJSONResponseVariant, ({ json, type }): JSONResponseVariantData => ({ json, type }))
    .when(isPromptResponseVariant, ({ context, promptID, turns, type }): PromptResponseVariantData => ({ context, promptID, turns, type }))
    .when(isTextResponseVariant, ({ cardLayout, speed, text, type }): TextResponseVariantData => ({ cardLayout, speed, text, type }))
    .exhaustive();
};

export const getResponseVariantWithData = (responseVariant: AnyResponseVariant, promptsByID: Record<string, Prompt>): AnyResponseVariantWithData => {
  return match(responseVariant)
    .when(isJSONResponseVariant, (variant) => ({ ...variant }))
    .when(isPromptResponseVariant, (variant): AnyResponseVariantWithData => ({ ...variant, prompt: promptsByID[variant.promptID || ''] }))
    .when(isTextResponseVariant, (variant) => ({ ...variant }))
    .exhaustive();
};
