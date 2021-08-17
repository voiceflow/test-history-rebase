import { Version } from '@voiceflow/base-types';

export const SAVE_SETTINGS_DEBOUNCE_DELAY = 300;
export const RESUME_PROMPT_MAX_LENGTH = 160;

export const REPEAT_OPTIONS = [
  {
    id: Version.RepeatType.DIALOG,
    label: 'Repeat dialog',
  },
  {
    id: Version.RepeatType.ALL,
    label: 'Repeat everything',
  },
];
