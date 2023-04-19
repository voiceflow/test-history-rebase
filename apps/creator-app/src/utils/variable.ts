import { READABLE_VARIABLE_REGEXP, Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import cloneDeep from 'lodash/cloneDeep';

import { VariableType } from '@/constants';

const DIVIDER = ':';

const VARIABLE_DESCRIPTION: Record<string, string> = {
  [VoiceflowConstants.BuiltInVariable.SESSIONS]: 'The number of times a particular user has opened the app',
  [VoiceflowConstants.BuiltInVariable.USER_ID]: "The user's Amazon/Google unique ID",
  [VoiceflowConstants.BuiltInVariable.TIMESTAMP]: 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC)',
  [VoiceflowConstants.BuiltInVariable.PLATFORM]: 'The platform your skill is running on ("voiceflow", "alexa" or "google")',
  [VoiceflowConstants.BuiltInVariable.LOCALE]: 'The locale of the user (eg. en-US, en-CA, it-IT, fr-FR, ...)',
  [VoiceflowConstants.BuiltInVariable.INTENT_CONFIDENCE]:
    'The confidence interval (measured as a value from 0 to 100) for the most recently matched intent',
  [VoiceflowConstants.BuiltInVariable.LAST_UTTERANCE]: `The user's last utterance in a text string`,
  [VoiceflowConstants.BuiltInVariable.LAST_RESPONSE]: `The assistant's last response (text/speak) in a string`,
  [VoiceflowConstants.BuiltInVariable.CHANNEL]: 'This communicates the actual channel that dialogflow is running on.',
};

export const addVariablePrefix = (prefix: VariableType, variable: string) => `${prefix}${DIVIDER}${variable}`;

export const removeVariablePrefix = (prefixedVariable: string) => {
  const [prefix, variable] = prefixedVariable.split(DIVIDER);

  if (Object.values<string>(VariableType).includes(prefix)) return variable;

  return prefixedVariable;
};

export const getVariableDescription = (variable?: string | null) => (variable && VARIABLE_DESCRIPTION[variable]) || '';

/**
 * When passed in an object, find all instances of a variable being used
 * @param {Object} object
 * @returns {Array} all things matching a variable format in this object
 */
export const deepVariableSearch = <T extends object>(object: T, regex = READABLE_VARIABLE_REGEXP): string[] => {
  const variables = new Set<string>();

  const recurse = (subCollection: unknown) => {
    if (Utils.object.isObject(subCollection)) {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const key in subCollection) {
        recurse(subCollection[key]);
      }
    } else if (typeof subCollection === 'string') {
      const re = new RegExp(regex);

      let m;
      // eslint-disable-next-line no-cond-assign
      while ((m = re.exec(subCollection))) {
        variables.add(m[1]);
      }
    }
    return subCollection;
  };

  recurse(object);

  return [...variables];
};

const variableReplacer = (match: string, inner: string, variablesMap: Record<string, unknown>, uriEncode = false): string => {
  if (inner in variablesMap) {
    const value = String(variablesMap[inner]);

    return uriEncode && typeof value === 'string' ? encodeURI(decodeURI(value)) : value;
  }

  return match;
};

export const deepVariableReplacement = <T extends object>(object: T, variableMap: Record<string, unknown>, regex = READABLE_VARIABLE_REGEXP): T => {
  const recurse = (subCollection: unknown, uriEncode = false) => {
    if (Utils.object.isObject(subCollection)) {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const key in subCollection) {
        subCollection[key] = key === 'url' ? recurse(subCollection[key], true) : recurse(subCollection[key]);
      }
    } else if (typeof subCollection === 'string') {
      return subCollection.replace(regex, (match, inner: string) => variableReplacer(match, inner, variableMap, uriEncode));
    }
    return subCollection;
  };

  return recurse(cloneDeep(object)) as T;
};
