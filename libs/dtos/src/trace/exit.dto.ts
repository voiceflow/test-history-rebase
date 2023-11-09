import { z } from 'zod';

import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const ExitTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.END),
});

export type ExitTrace = z.infer<typeof ExitTraceDTO>;
