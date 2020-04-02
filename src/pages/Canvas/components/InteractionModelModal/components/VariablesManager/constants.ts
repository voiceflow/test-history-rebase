import { GlobalVariable } from '@/constants';

// eslint-disable-next-line import/prefer-default-export
export const VARIABLE_DESCRIPTION = {
  [GlobalVariable.SESSIONS]: 'The Number of times a particular user has opened the app',
  [GlobalVariable.USER_ID]: "The user's Amazon/Google unique id",
  [GlobalVariable.TIMESTAMP]: 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC.)',
  [GlobalVariable.PLATFORM]: 'The platform your skill is running on ("alexa" or "google")',
  [GlobalVariable.LOCALE]: 'The locale of the user (eg en-US, en-CA, it-IT, fr-FR ...)',
};
