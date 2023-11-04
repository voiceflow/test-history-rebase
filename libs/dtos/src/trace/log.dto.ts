import { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

// TODO: define this later
export const LogTraceDTO = TraceDTOFactory(TraceType.LOG, { payload: z.record(z.unknown()) });

export type LogTrace = z.infer<typeof LogTraceDTO>;
