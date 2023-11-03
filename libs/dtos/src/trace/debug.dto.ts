import { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

export const DebugTraceDTO = TraceDTOFactory({
  type: TraceType.DEBUG,
  payload: z.object({
    type: z.string().optional(),
    message: z.string(),
  }),
});

export type DebugTrace = z.infer<typeof DebugTraceDTO>;
