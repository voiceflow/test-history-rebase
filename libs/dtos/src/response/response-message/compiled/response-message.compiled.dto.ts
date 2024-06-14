import { z } from 'zod';

import { SlateTextValueDTO } from '@/text/text.dto';

import { BaseCompiledResponseVariantDTO } from './base-variant.compiled.dto';

export const CompiledResponseMessageDataDTO = z
  .object({
    text: SlateTextValueDTO,
    delay: z.number().nullable(),
  })
  .strict();

export type CompiledResponseMessageData = z.infer<typeof CompiledResponseMessageDataDTO>;

export const CompiledResponseMessageDTO = BaseCompiledResponseVariantDTO.extend({
  data: CompiledResponseMessageDataDTO,
}).strict();

export type CompiledResponseMessage = z.infer<typeof CompiledResponseMessageDTO>;
