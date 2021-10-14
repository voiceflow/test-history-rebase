export enum BuiltInVariable {
  SESSIONS = 'sessions',
  USER_ID = 'user_id',
  TIMESTAMP = 'timestamp',
  PLATFORM = 'platform',
  LOCALE = 'locale',
  INTENT_CONFIDENCE = 'intent_confidence',
  LAST_UTTERANCE = 'last_utterance',
  CHANNEL = 'channel',
}

export const BUILT_IN_VARIABLES: string[] = [
  BuiltInVariable.SESSIONS,
  BuiltInVariable.USER_ID,
  BuiltInVariable.TIMESTAMP,
  BuiltInVariable.PLATFORM,
  BuiltInVariable.LOCALE,
  BuiltInVariable.INTENT_CONFIDENCE,
];
