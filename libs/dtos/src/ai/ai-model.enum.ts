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
  CLAUDE_3_OPUS: 'claude-3-opus',
  CLAUDE_INSTANT_V1: 'claude-instant-v1',
  GEMINI_PRO: 'gemini-pro',
  GROQ_LLAMA3_70B_8192: 'groq-llama3-70b-8192',
  GROQ_MIXTRAL_8X7B_32768: 'groq-mixtral-8x7b-32768',
} as const;

export type AIModel = Enum<typeof AIModel>;
