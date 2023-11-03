import { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

export const FlowTraceDTO = TraceDTOFactory({
  type: TraceType.FLOW,
  payload: z.object({
    name: z.string().optional(),
    diagramID: z.string(),
  }),
});

export type FlowTrace = z.infer<typeof FlowTraceDTO>;
