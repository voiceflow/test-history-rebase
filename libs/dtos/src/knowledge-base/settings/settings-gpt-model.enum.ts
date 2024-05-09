import type { Enum } from '@/utils/type/enum.util';

export const KBSettingsGptModel = {
  DaVinci_003: 'text-davinci-003',
  GPT_3_5_turbo: 'gpt-3.5-turbo',
  GPT_4: 'gpt-4',
  GPT_4_turbo: 'gpt-4-turbo',
  CLAUDE_V1: 'claude-v1',
  CLAUDE_V2: 'claude-v2',
  CLAUDE_INSTANT_V1: 'claude-instant-v1',
} as const;

export type KBSettingsGptModel = Enum<typeof KBSettingsGptModel>;
