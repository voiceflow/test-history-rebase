import { z } from 'zod';

export enum RequestType {
  TEXT = 'text',
  ACTION = 'action',
  INTENT = 'intent',
  LAUNCH = 'launch',
  NO_REPLY = 'no-reply',
}

export const RequestDTO = z.object({
  type: z.string(),
  payload: z.record(z.any()).optional(),
  diagramID: z.string().optional(),
});

export const LaunchRequestDTO = RequestDTO.extend({
  type: z.literal(RequestType.LAUNCH),
  payload: z
    .object({
      persona: z.string().optional(),
    })
    .optional(),
});

export const NoReplyRequestDTO = RequestDTO.extend({
  type: z.literal(RequestType.NO_REPLY),
});

export const TextRequestDTO = RequestDTO.extend({
  type: z.literal(RequestType.TEXT),
  payload: z.string(),
});

export const ActionRequestDTO = RequestDTO.extend({
  type: z.literal(RequestType.ACTION),
  payload: z.object({
    label: z.string().optional(),
  }),
});

export const IntentRequestEntityDTO = z.object({
  name: z.string(),
  value: z.string(),
  query: z.string().optional(),
  verboseValue: z.string().optional(),
});

export const IntentRequestDTO = RequestDTO.extend({
  type: z.literal(RequestType.INTENT),
  payload: z.object({
    intent: z.object({
      name: z.string(),
    }),
    entities: z.array(IntentRequestEntityDTO).optional(),
    query: z.string().optional(),
    confidence: z.number().optional(),
    data: z.record(z.any()).optional(),
  }),
});
