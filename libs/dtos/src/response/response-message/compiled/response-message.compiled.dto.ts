import { z } from 'zod';

import { AnyCompiledConditionDTO } from '@/condition/compiled/condition.compiled.dto';
import { SlateTextValueDTO } from '@/text/text.dto';

export const CompiledResponseMessageDTO = z
  .object({
    text: SlateTextValueDTO,
    delay: z.number().nullable(),
    conditions: z.array(AnyCompiledConditionDTO).optional(),
  })
  .strict();

export type CompiledResponseMessage = z.infer<typeof CompiledResponseMessageDTO>;
