import { z } from 'zod';

import { BaseRequestDTO } from '../request/utils.dto';
import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const GoToTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.GOTO),
  payload: z.object({
    request: BaseRequestDTO,
  }),
});

export type GoToTrace = z.infer<typeof GoToTraceDTO>;
