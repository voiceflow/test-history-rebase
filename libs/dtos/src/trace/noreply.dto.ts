import { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

export const NoReplyTraceDTO = TraceDTOFactory({
  type: TraceType.NO_REPLY,
  payload: z.object({
    timeout: z.number(),
  }),
});

export type NoReplyTrace = z.infer<typeof NoReplyTraceDTO>;
