import { BuiltInVariable } from '@/constants';

// eslint-disable-next-line import/prefer-default-export
export const VARIABLE_DESCRIPTION = {
  [BuiltInVariable.SESSIONS]: 'The Number of times a particular user has opened the app',
  [BuiltInVariable.USER_ID]: "The user's Amazon/Google unique id",
  [BuiltInVariable.TIMESTAMP]: 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC.)',
  [BuiltInVariable.PLATFORM]: 'The platform your skill is running on ("alexa" or "google")',
  [BuiltInVariable.LOCALE]: 'The locale of the user (eg en-US, en-CA, it-IT, fr-FR ...)',
  [BuiltInVariable.INTENT_CONFIDENCE]: 'The confidence interval for the most recently matched intent during a test',
};

export enum VariableType {
  LOCAL = 'local',
  GLOBAL = 'global',
  BUILT_IN = 'built-in',
}
