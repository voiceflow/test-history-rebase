import { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

export const ChannelActionTraceDTO = TraceDTOFactory(TraceType.CHANNEL_ACTION, {
  payload: z.object({
    name: z.string(),
    payload: z.record(z.any()),
  }),
});

export type ChannelActionTrace = z.infer<typeof ChannelActionTraceDTO>;
