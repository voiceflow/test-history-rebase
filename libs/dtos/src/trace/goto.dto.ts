import { z } from 'zod';

import { RequestDTO } from '../request';
import { TraceDTOFactory, TraceType } from './utils.dto';

export const GoToTraceDTO = TraceDTOFactory(TraceType.GOTO, {
  payload: z.object({
    request: RequestDTO,
  }),
});

export type GoToTrace = z.infer<typeof GoToTraceDTO>;
