import { z } from 'zod';

import { ActionAndLabelRequestPayloadDTO } from '../payload.dto';
import { RequestType } from '../request-type.enum';
import { BaseRequestDTO } from '../utils.dto';

export const IntentRequestEntityDTO = z
  .object({
    name: z.string(),
    value: z.string(),
    query: z.string().optional(),
    verboseValue: z
      .object({
        rawText: z.string(),
        canonicalText: z.string(),
        startIndex: z.number(),
      })
      .optional(),
  })
  .passthrough();

export type IntentRequestEntity = z.infer<typeof IntentRequestEntityDTO>;

export const IntentRequestPayloadDTO = ActionAndLabelRequestPayloadDTO.extend({
  data: z.record(z.any()).optional(),
  query: z.string().default(''),
  entities: z.array(IntentRequestEntityDTO).default([]),
  intent: z.object({ name: z.string() }).passthrough(),
  confidence: z.number().optional(),
}).passthrough();

export type IntentRequestPayload = z.infer<typeof IntentRequestPayloadDTO>;

export const IntentRequestDTO = BaseRequestDTO.extend({
  type: z.literal(RequestType.INTENT),
  payload: IntentRequestPayloadDTO,
}).passthrough();

export type IntentRequest = z.infer<typeof IntentRequestDTO>;

export const isIntentRequest = (value: unknown): value is IntentRequest => {
  const parsedResult = IntentRequestDTO.safeParse(value);
  return (
    parsedResult.success &&
    // Need to explicitly check that optional properties with default values exist before
    // Zod transforms the input data. When Zod transforms data with a `.default()` tag
    // it inserts the default value before validating that the value matches the type.
    //
    // This is problematic in use-cases where we use Zod purely as a type-guard, in which
    // case, we discard the parsed object and instead use the original object which does
    // not have default values injected, thus, creating a misleading type-guard.
    !!value &&
    typeof value === 'object' &&
    'payload' in value &&
    !!value.payload &&
    typeof value.payload === 'object' &&
    'entities' in value.payload &&
    'query' in value.payload
  );
};
