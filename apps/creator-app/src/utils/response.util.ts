import type {
  AnyResponseAttachment,
  AnyResponseVariant,
  AnyResponseVariantWithData,
  Prompt,
  PromptCreate,
  PromptResponseVariantCreate,
  PromptResponseVariantWithPrompt,
  ResponseCardAttachment,
  ResponseMessage,
  ResponseMessageCreate,
  TextResponseVariant,
  TextResponseVariantCreate,
} from '@voiceflow/dtos';
import { AttachmentType, CardLayout, ResponseContext, ResponseVariantType } from '@voiceflow/dtos';
import { isMarkupEmpty, markupFactory } from '@voiceflow/utils-designer';
import { match } from 'ts-pattern';

import { isPromptEmpty } from './prompt.util';

export const responseMessageCreateDataFactory = ({
  text = markupFactory(),
  delay = null,
  condition = null,
}: Partial<ResponseMessageCreate> = {}): ResponseMessageCreate => ({
  text,
  delay,
  condition,
});

// TODO: remove after response-variant migration

export const responseTextVariantCreateDataFactory = ({
  text = markupFactory(),
  speed = null,
  condition = null,
  cardLayout = CardLayout.CAROUSEL,
  attachments = [],
  tempID,
}: Partial<TextResponseVariantCreate> & { tempID?: string } = {}): TextResponseVariantCreate & { tempID?: string } => ({
  text,
  type: ResponseVariantType.TEXT,
  speed,
  condition,
  cardLayout,
  attachments,
  tempID,
});

const isPromptData = (
  data: Partial<PromptResponseVariantCreate>
): data is { promptID: string } | { prompt: PromptCreate } =>
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

type PartialTextResponseVariant = Pick<TextResponseVariant, 'type' | 'text'>;
type PartialPromptResponseVariant = Pick<PromptResponseVariantWithPrompt, 'id' | 'type' | 'prompt'>;

type AnyPartialResponseVariant = PartialTextResponseVariant | PartialPromptResponseVariant;

export const isCardResponseAttachment = (
  responseAttachment: AnyResponseAttachment
): responseAttachment is ResponseCardAttachment => responseAttachment.type === AttachmentType.CARD;

export const isTextResponseVariant = (
  responseVariant: AnyResponseVariant | PartialTextResponseVariant
): responseVariant is TextResponseVariant => responseVariant.type === ResponseVariantType.TEXT;

export const isTextResponseVariantEmpty = (responseVariant: TextResponseVariant | PartialTextResponseVariant) =>
  isMarkupEmpty(responseVariant.text);

export const isResponseMessageEmpty = (responseMessage: ResponseMessage) => isMarkupEmpty(responseMessage.text);

export const isPromptResponseVariantWidthDataEmpty = (
  responseVariant: PromptResponseVariantWithPrompt | PartialPromptResponseVariant
) => isPromptEmpty(responseVariant.prompt);

export const isAnyResponseVariantWithDataEmpty = (
  responseVariant: AnyResponseVariantWithData | AnyPartialResponseVariant
) =>
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
