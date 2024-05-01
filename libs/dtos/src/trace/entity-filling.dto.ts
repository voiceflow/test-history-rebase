import { z } from 'zod';

import { IntentRequestDTO } from '../request/intent/intent-request.dto';
import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const EntityFillingTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.ENTITY_FILLING),
  payload: z.object({
    entityToFill: z.string(),
    intent: IntentRequestDTO,
  }),
});

export type EntityFillingTrace = z.infer<typeof EntityFillingTraceDTO>;
