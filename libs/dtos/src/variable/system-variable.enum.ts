export const SystemVariable = {
  LOCALE: 'locale',
  CHANNEL: 'channel',
  USER_ID: 'user_id',
  SESSIONS: 'sessions',
  PLATFORM: 'platform',
  TIMESTAMP: 'timestamp',
  LAST_EVENT: 'last_event',
  LAST_RESPONSE: 'last_response',
  LAST_UTTERANCE: 'last_utterance',
  INTENT_CONFIDENCE: 'intent_confidence',
} as const;

export type SystemVariable = (typeof SystemVariable)[keyof typeof SystemVariable];
