import { z } from 'zod';

import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const FlowTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.FLOW),
  payload: z.object({
    name: z.string().optional(),
    diagramID: z.string(),
  }),
});

export type FlowTrace = z.infer<typeof FlowTraceDTO>;
