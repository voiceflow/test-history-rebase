import { BuiltInVariable } from '@voiceflow/realtime-sdk';

import { VariableType } from '@/constants';

const DIVIDER = ':';

const VARIABLE_DESCRIPTION: Record<string, string> = {
  [BuiltInVariable.SESSIONS]: 'The number of times a particular user has opened the app',
  [BuiltInVariable.USER_ID]: "The user's Amazon/Google unique ID",
  [BuiltInVariable.TIMESTAMP]: 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC)',
  [BuiltInVariable.PLATFORM]: 'The platform your skill is running on ("voiceflow", "alexa" or "google")',
  [BuiltInVariable.LOCALE]: 'The locale of the user (eg. en-US, en-CA, it-IT, fr-FR, ...)',
  [BuiltInVariable.INTENT_CONFIDENCE]: 'The confidence interval (measured as a value from 0 to 100) for the most recently matched intent',
  [BuiltInVariable.LAST_UTTERANCE]: `The user's last utterance in a text string`,
  [BuiltInVariable.CHANNEL]: 'This communicates the actual channel that dialogflow is running on.',
};

export const addVariablePrefix = (prefix: VariableType, variable: string) => `${prefix}${DIVIDER}${variable}`;

export const removeVariablePrefix = (prefixedVariable: string) => {
  const [prefix, variable] = prefixedVariable.split(DIVIDER);

  if (Object.values<string>(VariableType).includes(prefix)) return variable;

  return prefixedVariable;
};

export const getVariableDescription = (variable?: string | null) => (variable && VARIABLE_DESCRIPTION[variable]) || '';
