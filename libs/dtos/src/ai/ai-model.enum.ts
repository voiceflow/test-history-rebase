import type { Enum } from '@/utils/type/enum.util';

export const AIModel = {
  /** @deprecated GPT 3 should be removed */
  DaVinci_003: 'text-davinci-003',
  GPT_3_5_TURBO_1106: 'gpt-3.5-turbo-1106',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_4: 'gpt-4',
  GPT_4_TURBO: 'gpt-4-turbo',
  GPT_4O: 'gpt-4o',
  CLAUDE_V1: 'claude-v1',
  CLAUDE_V2: 'claude-v2',
  CLAUDE_3_HAIKU: 'claude-3-haiku',
  CLAUDE_3_SONNET: 'claude-3-sonnet',
  CLAUDE_3_5_SONNET: 'claude-3.5-sonnet',
  CLAUDE_3_OPUS: 'claude-3-opus',
  CLAUDE_INSTANT_V1: 'claude-instant-v1',
  GEMINI_PRO_1_5: 'gemini-pro-1.5',
} as const;

export type AIModel = Enum<typeof AIModel>;
