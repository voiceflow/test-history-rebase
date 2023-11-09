import { z } from 'zod';

import { TraceType } from '../trace-type.enum';
import { BaseTraceDTO } from '../utils.dto';
import { TraceStreamAction } from './trace-stream-action.enum';

export const StreamTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.STREAM),
  payload: z.object({
    src: z.string(),
    token: z.string(),
    action: z.nativeEnum(TraceStreamAction),
    loop: z.boolean().optional(),
    title: z.string().optional(),
    iconImage: z.string().optional(),
    description: z.string().optional(),
    backgroundImage: z.string().optional(),
  }),
});

export type StreamTrace = z.infer<typeof StreamTraceDTO>;
