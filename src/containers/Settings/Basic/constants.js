export const SAVE_SETTINGS_DEBOUNCE_DELAY = 300;
export const RESUME_PROMPT_MAX_LENGTH = 160;

export const RESUME_PROMPT_OBJECT = { content: '', follow_content: '', follow_voice: 'Alexa', voice: 'Alexa' };

export const REPEAT_OPTIONS = [
  {
    id: 1,
    label: 'Repeat dialog',
  },
  {
    id: 100,
    label: 'Repeat everything',
  },
];

export const CONTINUE_SESSION_OPTIONS = [
  {
    id: 'Alexa',
    label: 'Speak',
    customCheckedCondition: (val) => {
      return val !== 'audio';
    },
  },
  {
    id: 'audio',
    label: 'Audio',
    customCheckedCondition: (val) => {
      return val === 'audio';
    },
  },
];

export const FOLLOW_UP_OPTIONS = [
  {
    id: 'Alexa',
    label: 'Speak',
    customCheckedCondition: (val) => {
      return val !== 'audio';
    },
  },
  {
    id: 'audio',
    label: 'Audio',
    customCheckedCondition: (val) => {
      return val === 'audio';
    },
  },
];
