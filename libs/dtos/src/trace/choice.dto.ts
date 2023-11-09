import { z } from 'zod';

import { TraceType } from './trace-type.enum';
import { BaseTraceDTO, ButtonDTO } from './utils.dto';

export const ChoiceTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.CHOICE),
  payload: z.object({
    buttons: z.array(ButtonDTO),
  }),
});

export type ChoiceTrace = z.infer<typeof ChoiceTraceDTO>;
