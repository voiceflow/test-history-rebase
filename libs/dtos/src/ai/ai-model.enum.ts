export const AIModel = {
  /** @deprecated GPT 3 should be removed */
  DaVinci_003: 'text-davinci-003',
  GPT_3_5_TURBO_1106: 'gpt-3.5-turbo-1106',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_4: 'gpt-4',
  GPT_4_TURBO: 'gpt-4-turbo',
  CLAUDE_V1: 'claude-v1',
  CLAUDE_V2: 'claude-v2',
  CLAUDE_INSTANT_V1: 'claude-instant-v1',
  GEMINI_PRO: 'gemini-pro',
} as const;

export type AIModel = (typeof AIModel)[keyof typeof AIModel];
