import { z } from 'zod';

import { CompiledPromptDTO } from '@/prompt/prompt.compiled.dto';

import { ResponseContext } from '../response-context.enum';
import { ResponseVariantType } from '../response-variant-type.enum';
import { BaseCompiledResponseVariantDTO } from './base-variant.compiled.dto';

export const CompiledPromptResponseVariantDataDTO = z
  .object({
    turns: z.number(),
    context: z.nativeEnum(ResponseContext),
    prompt: CompiledPromptDTO.nullable(),
  })
  .strict();

export type CompiledPromptResponseVariantData = z.infer<typeof CompiledPromptResponseVariantDataDTO>;

export const CompiledPromptResponseVariantDTO = BaseCompiledResponseVariantDTO.extend({
  type: z.literal(ResponseVariantType.PROMPT),
  data: CompiledPromptResponseVariantDataDTO,
}).strict();

export type CompiledPromptResponseVariant = z.infer<typeof CompiledPromptResponseVariantDTO>;
