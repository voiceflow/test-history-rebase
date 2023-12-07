import { z } from 'zod';

import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const IntentRequestEntityDTO = z.object({
  name: z.string(),
  value: z.string(),
  query: z.string().optional(),
  verboseValue: z.string().optional(),
});

export type IntentRequestEntity = z.infer<typeof IntentRequestEntityDTO>;

export const IntentRequestDTO = BaseRequestDTO.extend({
  type: z.literal(RequestType.INTENT),
  payload: z.object({
    data: z.record(z.any()).optional(),
    query: z.string().optional(),
    intent: z.object({ name: z.string() }),
    entities: z.array(IntentRequestEntityDTO).optional(),
    confidence: z.number().optional(),
    label: z.string().optional(),
  }),
});

export type IntentRequest = z.infer<typeof IntentRequestDTO>;
