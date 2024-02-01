import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

import { CardLayout } from './card-layout.enum';
import { ResponseContext } from './response-context.enum';
import { ResponseVariantType } from './response-variant-type.enum';

const BaseResponseVariantDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    conditionID: z.string().nullable(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
    attachmentOrder: z.array(z.string()),
    discriminatorID: z.string(),
  })
  .strict();

// models

export const JSONResponseVariantDTO = BaseResponseVariantDTO.extend({
  type: z.literal(ResponseVariantType.JSON),
  json: MarkupDTO,
}).strict();

export type JSONResponseVariant = z.infer<typeof JSONResponseVariantDTO>;

export const TextResponseVariantDTO = BaseResponseVariantDTO.extend({
  type: z.literal(ResponseVariantType.TEXT),
  text: MarkupDTO,
  speed: z.number().nullable(),
  cardLayout: z.nativeEnum(CardLayout),
}).strict();

export type TextResponseVariant = z.infer<typeof TextResponseVariantDTO>;

export const PromptResponseVariantDTO = BaseResponseVariantDTO.extend({
  type: z.literal(ResponseVariantType.PROMPT),
  turns: z.number(),
  context: z.nativeEnum(ResponseContext),
  promptID: z.string().nullable(),
}).strict();

export type PromptResponseVariant = z.infer<typeof PromptResponseVariantDTO>;

export const AnyResponseVariantDTO = z.union([JSONResponseVariantDTO, TextResponseVariantDTO]);

export type AnyResponseVariant = z.infer<typeof AnyResponseVariantDTO>;
