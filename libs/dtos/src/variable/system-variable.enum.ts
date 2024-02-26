import type { Enum } from '@/utils/type/enum.util';

export const SystemVariable = {
  LOCALE: 'locale',
  CHANNEL: 'channel',
  USER_ID: 'user_id',
  SESSIONS: 'sessions',
  PLATFORM: 'platform',
  TIMESTAMP: 'timestamp',
  VF_MEMORY: 'vf_memory',
  LAST_EVENT: 'last_event',
  LAST_RESPONSE: 'last_response',
  LAST_UTTERANCE: 'last_utterance',
  INTENT_CONFIDENCE: 'intent_confidence',
} as const;

export type SystemVariable = Enum<typeof SystemVariable>;
