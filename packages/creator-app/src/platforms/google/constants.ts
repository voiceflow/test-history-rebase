import { GoogleConstants } from '@voiceflow/google-types';

export const UTTERANCE_RECOMMENDATIONS_LOCALES: GoogleConstants.Locale[] = [
  GoogleConstants.Locale.EN_AU,
  GoogleConstants.Locale.EN_CA,
  GoogleConstants.Locale.EN_GB,
  GoogleConstants.Locale.EN_IN,
  GoogleConstants.Locale.EN_BE,
  GoogleConstants.Locale.EN_SG,
  GoogleConstants.Locale.EN_US,
];

export const GOOGLE_CONSOLE_URL = 'https://console.actions.google.com/';

export const GOOGLE_CONSOLE_PROJECT_URL = (projectID: string) => `https://console.actions.google.com/project/${projectID}/simulator/`;
