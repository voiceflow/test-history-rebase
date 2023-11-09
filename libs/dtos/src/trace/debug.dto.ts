import { z } from 'zod';

import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const DebugTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.DEBUG),
  payload: z.object({
    type: z.string().optional(),
    message: z.string(),
  }),
});

export type DebugTrace = z.infer<typeof DebugTraceDTO>;
