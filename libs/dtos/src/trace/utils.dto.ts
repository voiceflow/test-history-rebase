import { z } from 'zod';

import { RequestDTO } from '../request/request.dto';
import { TraceType } from './trace-type.enum';

export const TracePathDTO = z.object({
  label: z.string().optional(),
  event: RequestDTO.optional(),
});

export const ButtonDTO = z.object({
  name: z.string(),
  request: RequestDTO.optional(),
});

export const BaseTraceDTO = z.object({
  type: z.nativeEnum(TraceType),
  paths: z.array(TracePathDTO).optional(),
  defaultPath: z.number().optional(),
});
