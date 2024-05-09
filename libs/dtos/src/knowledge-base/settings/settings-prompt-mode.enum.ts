import type { Enum } from '@/utils/type/enum.util';

export const KBSettingsPromptMode = {
  PROMPT: 'prompt',
  MEMORY: 'memory',
  MEMORY_PROMPT: 'memory_prompt',
} as const;

export type KBSettingsPromptMode = Enum<typeof KBSettingsPromptMode>;
