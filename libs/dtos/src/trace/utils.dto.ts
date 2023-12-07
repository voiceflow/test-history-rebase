import { z } from 'zod';

import { BaseRequestDTO } from '../request/utils.dto';
import { TraceType } from './trace-type.enum';

export const TracePathDTO = z.object({
  label: z.string().optional(),
  event: BaseRequestDTO.optional(),
});

export const ButtonDTO = z.object({
  name: z.string(),
  request: BaseRequestDTO.optional(),
});

export const BaseTraceDTO = z.object({
  type: z.nativeEnum(TraceType),
  paths: z.array(TracePathDTO).optional(),
  defaultPath: z.number().optional(),
});
