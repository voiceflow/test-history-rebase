import { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

export enum TraceSpeakType {
  AUDIO = 'audio',
  MESSAGE = 'message',
}

export const SpeakTraceDTO = TraceDTOFactory(TraceType.SPEAK, {
  payload: z.object({
    src: z.string().nullable().optional(),
    type: z.nativeEnum(TraceSpeakType),
    voice: z.string().optional(),
    isPrompt: z.boolean().optional(),
  }),
});

export type SpeakTrace = z.infer<typeof SpeakTraceDTO>;
