import { BaseUtils } from '@voiceflow/base-types';

import type * as AI from '@/pages/Canvas/managers/components/AI';

export const PLACEHOLDERS = [
  'Greet {name} with a pun',
  'Provide 5 travel tips for {city}',
  'List all models of {car}',
  'Tell the user a joke using {name}',
  'Say {last_utterance} in {language}',
  'Make some small talk with {name}',
];

export const MEMORY_SELECT_OPTIONS: AI.MemorySelectOption[] = [
  {
    mode: BaseUtils.ai.PROMPT_MODE.PROMPT,
    label: 'Respond using prompt',
    title: 'Prompt',
  },
  {
    mode: BaseUtils.ai.PROMPT_MODE.MEMORY,
    label: 'Respond using memory',
    title: 'Memory',
  },
  {
    mode: BaseUtils.ai.PROMPT_MODE.MEMORY_PROMPT,
    label: 'Respond using memory and prompt',
    title: 'Memory & Prompt',
  },
];
