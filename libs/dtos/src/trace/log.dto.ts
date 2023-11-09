import { z } from 'zod';

import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const LogTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.LOG),
  // TODO: define this later
  payload: z.record(z.unknown()),
});

export type LogTrace = z.infer<typeof LogTraceDTO>;
