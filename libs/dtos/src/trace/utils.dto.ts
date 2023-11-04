import { z } from 'zod';

import { RequestDTO } from '../request';

export enum TraceType {
  LOG = 'log',
  END = 'end',
  TEXT = 'text',
  PATH = 'path',
  FLOW = 'flow',
  GOTO = 'goto',
  SPEAK = 'speak',
  BLOCK = 'block',
  DEBUG = 'debug',
  CHOICE = 'choice',
  STREAM = 'stream',
  VISUAL = 'visual',
  CARD_V2 = 'cardV2',
  CAROUSEL = 'carousel',
  NO_REPLY = 'no-reply',
  ENTITY_FILLING = 'entity-filling',
  CHANNEL_ACTION = 'channel-action',
  KNOWLEDGE_BASE = 'knowledgeBase',
}

export const TracePathDTO = z.object({
  label: z.string(),
  event: RequestDTO.optional(),
});

export const ButtonDTO = z.object({
  name: z.string(),
  request: RequestDTO.optional(),
});

export const TraceDTOFactory = <
  T extends TraceType,
  Data extends { payload?: z.AnyZodObject | z.ZodRecord<z.ZodString, any> }
>(
  type: T,
  data: Data = {} as Data
) =>
  z.object({
    ...data,
    type: z.literal(type),
    paths: z.array(TracePathDTO).optional(),
    defaultPath: z.number().optional(),
  });
