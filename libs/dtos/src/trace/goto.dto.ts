import { z } from 'zod';

import { RequestDTO } from '../request/request.dto';
import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const GoToTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.GOTO),
  payload: z.object({
    request: RequestDTO,
  }),
});

export type GoToTrace = z.infer<typeof GoToTraceDTO>;
