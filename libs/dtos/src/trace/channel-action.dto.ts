import { z } from 'zod';

import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const ChannelActionTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.CHANNEL_ACTION),
  payload: z.object({
    name: z.string(),
    payload: z.record(z.any()),
  }),
});

export type ChannelActionTrace = z.infer<typeof ChannelActionTraceDTO>;
