import { constants } from '@voiceflow/common';

import { FILTERED_AMAZON_INTENTS, PlatformType, SLOT_REGEXP } from '@/constants';
import { Intent } from '@/models';

const AMAZON_INTENT_PREFIX = 'AMAZON.';

export const formatIntentName = (name = '') => {
  return name
    .replace(' ', '_')
    .replace(/[^A-Z_a-z]/g, '')
    .replace(/_+$/g, '')
    .toLowerCase();
};

export const prettifyIntentName = (name = '') =>
  name
    .replace(/(\w)Intent/g, '$1')
    .replace(/([A-Za-z])([A-Z])(?=[a-z])/g, '$1 $2') // camelCase => camel Case
    .replace(/([a-z])([A-Z]{2})(?=[a-z])/g, '$1 $2') // camelCaseSH => camel Case SH
    .replace(/([a-z])([A-Z]+)(?=[A-Z])/g, '$1 $2') // camelCaseSHORT => camel Case SHORT
    .trim();

export const prettifyIntentNames = (intents: Intent[]) => {
  return intents.map((intent) => ({
    ...intent,
    name: prettifyIntentName(intent.name),
  }));
};

export const filterIntents = (intents: Intent[], activeIntent: Intent) => {
  return intents.filter((intent) => {
    const isActiveIntent = intent.id === activeIntent?.id;

    if (isActiveIntent) {
      return true;
    }

    if (intent.builtIn) {
      return !FILTERED_AMAZON_INTENTS.includes(intent.name.replace(AMAZON_INTENT_PREFIX, ''));
    }

    return true;
  });
};

export const intentFactory = (platform: PlatformType) => (intent: { name: string; slots?: never }): Intent => {
  const truncatedName = intent.name.split('.')[1];

  return {
    id: intent.name,
    name: truncatedName ?? intent.name,
    slots: {
      byKey: {},
      allKeys: [],
    },
    builtIn: true,
    inputs: [{ text: '', slots: intent.slots || [] }],
    platform,
  };
};

export const ALEXA_BUILT_INS = constants.intents.BUILT_IN_INTENTS_ALEXA.map(intentFactory(PlatformType.ALEXA));

export const GOOGLE_BUILT_INS = constants.intents.BUILT_IN_INTENTS_GOOGLE.map(intentFactory(PlatformType.GOOGLE));

export const BUILT_IN_INTENTS = {
  [PlatformType.ALEXA]: ALEXA_BUILT_INS,
  [PlatformType.GOOGLE]: GOOGLE_BUILT_INS,
};

export const isBuiltInIntent = (intentID: string) => [...ALEXA_BUILT_INS, ...GOOGLE_BUILT_INS].some((intent) => intent.id === intentID);

const NUMERIC_UTTERANCE_REGEXP = /\d/;

export function validateUtterance(utterance: string, intentID: string, intents: Intent[]) {
  const utteranceWithoutSlots = utterance.replace(SLOT_REGEXP, '');
  let err = '';

  if (utterance === '') {
    return 'Utterances must contain text';
  }

  if (utteranceWithoutSlots.match(NUMERIC_UTTERANCE_REGEXP)) {
    return 'Utterances cannot contain numbers, replace them with words or a slot that accepts numbers as a value.';
  }

  const lowercaseUtterance = utterance.toLowerCase();

  intents.some(({ inputs, id, name }) =>
    inputs.some(({ text }) => {
      if (text.toLowerCase() === lowercaseUtterance) {
        err =
          id === intentID ? 'You already have this utterance in this intent.' : `You already have this utterance defined in the "${name}" intent.`;

        return true;
      }

      return false;
    })
  );

  return err;
}
