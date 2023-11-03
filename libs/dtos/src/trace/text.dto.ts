import { z } from 'zod';

import { SlateTextValueDTO } from '../text';
import { TraceDTOFactory, TraceType } from './utils.dto';

export const TextTraceDTO = TraceDTOFactory({
  type: TraceType.TEXT,
  payload: z.object({
    slate: SlateTextValueDTO,
    delay: z.number().optional(),
  }),
});

export type TextTrace = z.infer<typeof TextTraceDTO>;
