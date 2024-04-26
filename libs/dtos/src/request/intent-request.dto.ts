import { z } from 'zod';

import { ActionAndLabelRequestPayloadDTO } from './payload.dto';
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
  payload: ActionAndLabelRequestPayloadDTO.extend({
    data: z.record(z.any()).optional(),
    query: z.string().optional(),
    intent: z.object({ name: z.string() }),
    entities: z.array(IntentRequestEntityDTO).optional(),
    confidence: z.number().optional(),
  }),
});

export type IntentRequest = z.infer<typeof IntentRequestDTO>;

export const isIntentRequest = (value: unknown): value is IntentRequest => IntentRequestDTO.safeParse(value).success;
