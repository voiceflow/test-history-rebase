import { z } from 'zod';

import { TraceDTOFactory, TraceType } from './utils.dto';

export enum TraceStreamAction {
  LOOP = 'LOOP',
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  END = 'END',
}

export const StreamTraceDTO = TraceDTOFactory({
  type: TraceType.STREAM,
  payload: z.object({
    src: z.string(),
    token: z.string(),
    action: z.nativeEnum(TraceStreamAction),
    loop: z.boolean(),
    title: z.string().optional(),
    iconImage: z.string().optional(),
    description: z.string().optional(),
    backgroundImage: z.string().optional(),
  }),
});

export type StreamTrace = z.infer<typeof StreamTraceDTO>;
