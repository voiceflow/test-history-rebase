import type {
  AnyResponseAttachment,
  AnyResponseVariant,
  AnyResponseVariantWithData,
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

type PartialTextResponseVariant = Pick<TextResponseVariant, 'id' | 'type' | 'text'>;
type PartialPromptResponseVariant = Pick<PromptResponseVariantWithPrompt, 'id' | 'type' | 'prompt'>;

type AnyPartialResponseVariant = PartialTextResponseVariant | PartialPromptResponseVariant;

export const isCardResponseAttachment = (responseAttachment: AnyResponseAttachment): responseAttachment is ResponseCardAttachment =>
  responseAttachment.type === AttachmentType.CARD;

export const isTextResponseVariant = (responseVariant: AnyResponseVariant): responseVariant is TextResponseVariant =>
  responseVariant.type === ResponseVariantType.TEXT;

export const isTextResponseVariantEmpty = (responseVariant: TextResponseVariant | PartialTextResponseVariant) => isMarkupEmpty(responseVariant.text);

export const isPromptResponseVariantWidthDataEmpty = (responseVariant: PromptResponseVariantWithPrompt | PartialPromptResponseVariant) =>
  isPromptEmpty(responseVariant.prompt);

export const isAnyResponseVariantWithDataEmpty = (responseVariant: AnyResponseVariantWithData | AnyPartialResponseVariant) =>
  match(responseVariant)
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
    .when(isTextResponseVariant, (variant) => ({ ...variant }))
    .exhaustive();
};
