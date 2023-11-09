import { z } from 'zod';

import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const NoReplyTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.NO_REPLY),
  payload: z.object({
    timeout: z.number(),
  }),
});

export type NoReplyTrace = z.infer<typeof NoReplyTraceDTO>;
