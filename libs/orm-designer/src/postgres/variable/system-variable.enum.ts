export const SystemVariable = {
  INTENT_CONFIDENCE: 'intent_confidence',
  LAST_RESPONSE: 'last_response',
  LAST_UTTERANCE: 'last_utterance',
  SESSIONS: 'sessions',
  TIMESTAMP: 'timestamp',
  USER_ID: 'user_id',
} as const;

export type SystemVariable = (typeof SystemVariable)[keyof typeof SystemVariable];
