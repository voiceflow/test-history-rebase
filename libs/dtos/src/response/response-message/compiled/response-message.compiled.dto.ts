import { z } from 'zod';

import { AnyCompiledConditionDTO } from '@/condition/compiled/condition.compiled.dto';
import { SlateTextValueDTO } from '@/text/text.dto';

export const CompiledResponseMessageDataDTO = z
  .object({
    text: SlateTextValueDTO,
    delay: z.number().nullable(),
  })
  .strict();

export type CompiledResponseMessageData = z.infer<typeof CompiledResponseMessageDataDTO>;

export const CompiledResponseMessageDTO = z
  .object({
    conditions: AnyCompiledConditionDTO.array(),
    data: CompiledResponseMessageDataDTO,
  })
  .strict();

export type CompiledResponseMessage = z.infer<typeof CompiledResponseMessageDTO>;
