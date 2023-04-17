import { BaseVersion } from '@voiceflow/base-types';

export const SAVE_SETTINGS_DEBOUNCE_DELAY = 300;
export const RESUME_PROMPT_MAX_LENGTH = 160;

export const REPEAT_OPTIONS = [
  {
    id: BaseVersion.RepeatType.DIALOG,
    label: 'Repeat dialog',
  },
  {
    id: BaseVersion.RepeatType.ALL,
    label: 'Repeat everything',
  },
];
