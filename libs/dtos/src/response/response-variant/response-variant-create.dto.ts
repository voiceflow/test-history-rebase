import { z } from 'zod';

import { AnyConditionCreateDTO } from '@/condition/condition-create.dto';
import { PromptCreateDTO } from '@/prompt/prompt-create.dto';

import { AnyResponseAttachmentCreateDTO } from '../response-attachment/response-attachment-create.dto';
import { PromptResponseVariantDTO, TextResponseVariantDTO } from './response-variant.dto';

const BaseResponseVariantCreateDTO = z.object({
  condition: z.nullable(AnyConditionCreateDTO),
  attachments: z.array(AnyResponseAttachmentCreateDTO),
});

export const TextResponseVariantCreateDTO = BaseResponseVariantCreateDTO.extend(
  TextResponseVariantDTO.pick({ type: true, text: true, speed: true, cardLayout: true }).shape
).strict();

export type TextResponseVariantCreate = z.infer<typeof TextResponseVariantCreateDTO>;

const BasePromptResponseVariantCreateDTO = BaseResponseVariantCreateDTO.extend(
  PromptResponseVariantDTO.pick({
    type: true,
    turns: true,
    context: true,
  }).shape
).strict();

export const PromptResponseVariantCreateDTO = z.union([
  BasePromptResponseVariantCreateDTO.extend(PromptResponseVariantDTO.pick({ promptID: true }).shape).strict(),
  BasePromptResponseVariantCreateDTO.extend({ prompt: PromptCreateDTO }).strict(),
]);

export type PromptResponseVariantCreate = z.infer<typeof PromptResponseVariantCreateDTO>;

// TODO: add prompt response type variant
export const AnyResponseVariantCreateDTO = TextResponseVariantCreateDTO;

export type AnyResponseVariantCreate = z.infer<typeof AnyResponseVariantCreateDTO>;
