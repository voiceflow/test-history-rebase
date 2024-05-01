import type { z } from 'zod';

import { IntentRequestDTO, IntentRequestPayloadDTO } from './intent-request.dto';

export const LegacyIntentRequestDTO = IntentRequestDTO.extend({
  payload: IntentRequestPayloadDTO.omit({ data: true }).required({ entities: true }),
})
  .passthrough()
  .describe('The legacy intent request type that `general-runtime` expects from its clients.');

export type LegacyIntentRequest = z.infer<typeof LegacyIntentRequestDTO>;

export const isLegacyIntentRequest = (request: unknown): request is LegacyIntentRequest =>
  LegacyIntentRequestDTO.safeParse(request).success;
