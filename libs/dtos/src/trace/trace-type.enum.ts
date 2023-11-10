export const TraceType = {
  LOG: 'log',
  END: 'end',
  TEXT: 'text',
  PATH: 'path',
  FLOW: 'flow',
  GOTO: 'goto',
  SPEAK: 'speak',
  BLOCK: 'block',
  DEBUG: 'debug',
  CHOICE: 'choice',
  STREAM: 'stream',
  VISUAL: 'visual',
  CARD_V2: 'cardV2',
  CAROUSEL: 'carousel',
  NO_REPLY: 'no-reply',
  ENTITY_FILLING: 'entity-filling',
  CHANNEL_ACTION: 'channel-action',
  KNOWLEDGE_BASE: 'knowledgeBase',
} as const;

export type TraceType = (typeof TraceType)[keyof typeof TraceType];
