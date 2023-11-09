import { z } from 'zod';

import { TraceType } from '../trace-type.enum';
import { BaseTraceDTO } from '../utils.dto';
import { TraceSpeakType } from './trace-speak-type.enum';

export const SpeakTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.SPEAK),
  payload: z.object({
    src: z.string().nullable().optional(),
    type: z.nativeEnum(TraceSpeakType),
    voice: z.string().optional(),
    isPrompt: z.boolean().optional(),
  }),
});

export type SpeakTrace = z.infer<typeof SpeakTraceDTO>;
