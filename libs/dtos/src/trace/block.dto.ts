import { z } from 'zod';

import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const BlockTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.BLOCK),
  payload: z.object({
    blockID: z.string(),
  }),
});

export type BlockTrace = z.infer<typeof BlockTraceDTO>;
