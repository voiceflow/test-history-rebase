export const SAVE_SETTINGS_DEBOUNCE_DELAY = 300;
export const ERROR_PROMPT_OPTIONS = [
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
