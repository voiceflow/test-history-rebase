import { z } from 'zod';

import { SlateTextValueDTO } from '../text/text.dto';
import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const TextTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.TEXT),
  payload: z.object({
    slate: SlateTextValueDTO,
    delay: z.number().optional(),
  }),
});

export type TextTrace = z.infer<typeof TextTraceDTO>;
