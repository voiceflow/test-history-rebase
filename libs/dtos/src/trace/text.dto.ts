import { z } from 'zod';

import { SlateTextValueDTO } from '../text/text.dto';
import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const TextTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.TEXT),
  payload: z.object({
    message: z.string(),
    delay: z.number().optional(),
    ai: z.boolean().optional(),

    slate: SlateTextValueDTO.optional(),
  }),
});

export type TextTrace = z.infer<typeof TextTraceDTO>;
