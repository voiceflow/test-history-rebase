import type { z } from 'zod';

import { IntentRequestDTO, IntentRequestPayloadDTO } from './intent-request.dto';

export const AlexaIntentRequestDTO = IntentRequestDTO.extend({
  payload: IntentRequestPayloadDTO.required({ data: true, entities: true }),
})
  .passthrough()
  .describe('Legacy intent request type that `general-runtime` expects Alexa to send');

export type AlexaIntentRequest = z.infer<typeof AlexaIntentRequestDTO>;

export const isAlexaIntentRequest = (request: unknown): request is AlexaIntentRequest =>
  AlexaIntentRequestDTO.safeParse(request).success;
