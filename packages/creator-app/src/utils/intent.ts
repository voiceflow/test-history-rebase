import { Constants as AlexaConstants } from '@voiceflow/alexa-types';
import { SLOT_REGEXP } from '@voiceflow/common';
import { Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as GoogleConstants } from '@voiceflow/google-types';
import { PlatformType } from '@voiceflow/internal';

import { FILTERED_AMAZON_INTENTS } from '@/constants';
import { Intent, Slot } from '@/models';
import { capitalizeFirstLetter } from '@/utils/string';

import { createPlatformSelector } from './platform';

const AMAZON_INTENT_PREFIX = 'AMAZON.';

const amazonBuiltInIntentsArray = Object.values(AlexaConstants.AmazonIntent) as string[];
const generalBuiltInIntentsArray = Object.values(GeneralConstants.IntentName) as string[];
const builtInIntentMap = new Map([...amazonBuiltInIntentsArray, ...generalBuiltInIntentsArray].map((id) => [id, true]));

const intentLabel: { [key in GeneralConstants.IntentName]?: string } = {
  [GeneralConstants.IntentName.NONE]: 'Fallback',
};

export const isCustomizableBuiltInIntent = (intent?: Intent | null) => !!intent && builtInIntentMap.has(intent.id);

export const formatIntentName = (name = '') =>
  name
    .replace(' ', '_')
    .replace(/[^A-Z_a-z]/g, '')
    .toLowerCase();

export const prettifyIntentName = (name = '') =>
  intentLabel[name as GeneralConstants.IntentName] ??
  name
    .replace(/(\w)Intent/g, '$1')
    .replace(/([A-Za-z])([A-Z])(?=[a-z])/g, '$1 $2') // camelCase => camel Case
    .replace(/([a-z])([A-Z]{2})(?=[a-z])/g, '$1 $2') // camelCaseSH => camel Case SH
    .replace(/([a-z])([A-Z]+)(?=[A-Z])/g, '$1 $2') // camelCaseSHORT => camel Case SHORT
    .trim();

export const prettifyIntentNames = (intents: Intent[]) =>
  intents.map((intent) => ({
    ...intent,
    name: prettifyIntentName(intent.name),
  }));

export const filterIntents = (intents: Intent[], activeIntent: Intent) =>
  intents.filter((intent) => {
    const isActiveIntent = intent.id === activeIntent?.id;

    if (isActiveIntent) {
      return true;
    }

    if (isCustomizableBuiltInIntent(intent)) {
      return !FILTERED_AMAZON_INTENTS.includes(intent.name.replace(AMAZON_INTENT_PREFIX, ''));
    }

    return true;
  });

export const intentFactory =
  (platform: PlatformType) =>
  (intent: { name: string; slots?: string[] }): Intent => {
    const truncatedName = intent.name.split('.')[1];

    return {
      id: intent.name,
      name: truncatedName ?? intent.name,
      slots: { byKey: {}, allKeys: [] },
      inputs: [{ text: '', slots: intent.slots ?? [] }],
      platform,
    };
  };

export const generalIntentFactory = (generalIntent: GeneralConstants.DefaultIntent): Intent => {
  const intent = intentFactory(PlatformType.GENERAL)(generalIntent);

  return {
    ...intent,
    name: capitalizeFirstLetter(generalIntent.samples[0] ?? intent.name),
  };
};

export const validateIntentName = (intentName: string, intents: Intent[], slots: Slot[]) => {
  const lowerCasedIntentName = intentName.toLowerCase();

  if (intents.some(({ name }) => name.toLowerCase() === lowerCasedIntentName)) {
    return `The '${intentName}' intent already exists.`;
  }

  if (slots.some(({ name }) => name.toLowerCase() === lowerCasedIntentName)) {
    return `You have an entity defined with the '${intentName}' name already. Intent/entity name must be unique.`;
  }

  return null;
};

export const ALEXA_BUILT_INS = AlexaConstants.BUILT_IN_INTENTS.map(intentFactory(PlatformType.ALEXA));

export const GOOGLE_BUILT_INS = GoogleConstants.BUILT_IN_INTENTS.map(intentFactory(PlatformType.GOOGLE));

export const GENERAL_BUILT_INS_MAP = Object.keys(GeneralConstants.DEFAULT_INTENTS_MAP).reduce<Record<string, Intent[]>>(
  (acc, key) => Object.assign(acc, { [key]: GeneralConstants.DEFAULT_INTENTS_MAP[key].map(generalIntentFactory) }),
  {}
);

export const getBuiltInIntents = createPlatformSelector(
  {
    [PlatformType.ALEXA]: ALEXA_BUILT_INS,
    [PlatformType.GOOGLE]: GOOGLE_BUILT_INS,
  },
  GENERAL_BUILT_INS_MAP[GeneralConstants.Locale.EN_US]
);

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

export const removeSlotRefFromInput = (text: string, slotDetails: Slot) =>
  text.replace(SLOT_REGEXP, (match, inner) => {
    if (inner.match(slotDetails.name)) {
      return slotDetails.name;
    }

    return match;
  });

export const removeBuiltInPrefix = (name: string) => {
  let newName = name;
  if (name.includes('.')) {
    // eslint-disable-next-line prefer-destructuring
    newName = name.split('.')[1];
  }
  return newName;
};
