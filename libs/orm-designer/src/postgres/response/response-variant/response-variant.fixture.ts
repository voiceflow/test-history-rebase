import type { EntityDTO } from '@mikro-orm/core';
import { CardLayout, ResponseContext, ResponseVariantType } from '@voiceflow/dtos';

import { responseAttachmentList } from '../response-attachment/response-attachment.fixture';
import type { PromptResponseVariantEntity, TextResponseVariantEntity } from './response-variant.entity';

const baseResponseVariant = {
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  cardLayout: CardLayout.CAROUSEL,
  speed: 2,
  attachmentOrder: ['attachment-1', 'attachment-2'],
  attachments: responseAttachmentList,
  assistant: { id: 'assistant-1' } as any,
  discriminator: { id: 'discriminator-1' } as any,
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

export const responseVariantList = [promptResponseVariant, textResponseVariant];
