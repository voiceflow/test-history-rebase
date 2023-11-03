import { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

export const BlockTraceDTO = TraceDTOFactory({
  type: TraceType.BLOCK,
  payload: z.object({
    blockID: z.string(),
  }),
});

export type BlockTrace = z.infer<typeof BlockTraceDTO>;
