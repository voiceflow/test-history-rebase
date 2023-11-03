import type { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

export const ExitTraceDTO = TraceDTOFactory({ type: TraceType.END });

export type ExitTrace = z.infer<typeof ExitTraceDTO>;
