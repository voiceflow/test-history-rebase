import type { EntityDTO } from '@mikro-orm/core';

import { responseAttachmentList } from '../response-attachment/response-attachment.fixture';
import { CardLayout } from './card-layout.enum';
import { ResponseContext } from './response-context.enum';
import type {
  JSONResponseVariantEntity,
  PromptResponseVariantEntity,
  TextResponseVariantEntity,
} from './response-variant.entity';
import { ResponseVariantType } from './response-variant-type.enum';

const baseResponseVariant = {
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedByID: 1,
  cardLayout: CardLayout.CAROUSEL,
  speed: 2,
  attachmentOrder: ['attachment-1', 'attachment-2'],
  attachments: responseAttachmentList,
  assistant: { id: 'assistant-1' } as any,
  discriminator: { id: 'discriminator-1' } as any,
};

export const jsonResponseVariant: EntityDTO<JSONResponseVariantEntity> = {
  ...baseResponseVariant,
  id: 'response-variant-1',
  type: ResponseVariantType.JSON,
  json: ['{ "foo": "bar" }'],
  condition: null,
  environmentID: 'environment-1',
};

export const promptResponseVariant: EntityDTO<PromptResponseVariantEntity> = {
  ...baseResponseVariant,
  id: 'response-variant-2',
  type: ResponseVariantType.PROMPT,
  turns: 2,
  context: ResponseContext.MEMORY,
  prompt: { id: 'prompt-1' } as any,
  condition: { id: 'condition-1' } as any,
  environmentID: 'environment-1',
};

export const textResponseVariant: EntityDTO<TextResponseVariantEntity> = {
  ...baseResponseVariant,
  id: 'response-variant-3',
  type: ResponseVariantType.TEXT,
  text: ['hello world'],
  condition: null,
  environmentID: 'environment-1',
};

export const responseVariantList = [jsonResponseVariant, promptResponseVariant, textResponseVariant];
