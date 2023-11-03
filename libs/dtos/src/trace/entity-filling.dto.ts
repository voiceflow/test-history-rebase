import { z } from 'zod';

import { IntentRequestDTO } from '../request';
import { TraceDTOFactory, TraceType } from './utils.dto';

export const EntityFillingTraceDTO = TraceDTOFactory({
  type: TraceType.ENTITY_FILLING,
  payload: z.object({
    entityToFill: z.string(),
    intent: IntentRequestDTO,
  }),
});

export type EntityFillingTrace = z.infer<typeof EntityFillingTraceDTO>;
