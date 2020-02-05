import { constants } from '@voiceflow/common';
import { find } from 'lodash';

import { FILTERED_AMAZON_INTENTS, PlatformType } from '@/constants';

const AMAZON_INTENT_PREFIX = 'AMAZON.';

export const formatIntentName = (name = '') => {
  return name
    .replace(' ', '_')
    .replace(/[^A-Z_a-z]/g, '')
    .toLowerCase();
};

export const prettifyIntentName = (name = '') =>
  name
    .replace(/(\w)Intent/g, '$1')
    .replace(/([A-Za-z])([A-Z])(?=[a-z])/g, '$1 $2') // camelCase => camel Case
    .replace(/([a-z])([A-Z]{2})(?=[a-z])/g, '$1 $2') // camelCaseSH => camel Case SH
    .replace(/([a-z])([A-Z]+)(?=[A-Z])/g, '$1 $2') // camelCaseSHORT => camel Case SHORT
    .trim();

export const prettifyIntentNames = (intents) => {
  return intents.map((intent) => ({
    ...intent,
    name: prettifyIntentName(intent.name),
  }));
};

export const filterIntents = (intents, activeIntent) => {
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

export const intentHasSlots = (intent) => {
  for (let i = 0; i < intent.inputs.length; i++) {
    const input = intent.inputs[i];
    if (input.slots && input.slots.length > 0) {
      return true;
    }
  }
  return false;
};

export const getIntentSlots = (intent, slotsSet) => {
  if (!intent) {
    return [];
  }
  const slotKeys = new Set();
  const slots = [];
  for (let i = 0; i < intent.inputs.length; i++) {
    const input = intent.inputs[i];
    if (input.slots && input.slots.length > 0) {
      input.slots.forEach((slotKey) => {
        if (!slotKeys.has(slotKey)) {
          slotKeys.add(slotKey);
          const slotObj = find(slotsSet, {
            key: slotKey,
          });
          if (slotObj) slots.push(slotObj);
        }
      });
    }
  }
  return slots;
};

export const intentFactory = (platform) => (intent) => {
  const truncatedName = intent.name.split('.')[1];

  return {
    platform,
    builtIn: true,
    name: truncatedName ?? intent.name,
    id: intent.name,
    inputs: [
      {
        text: '',
        slots: intent.slots,
      },
    ],
  };
};

export const ALEXA_BUILT_INS = constants.intents.BUILT_IN_INTENTS_ALEXA.map(intentFactory(PlatformType.ALEXA));

export const GOOGLE_BUILT_INS = constants.intents.BUILT_IN_INTENTS_GOOGLE.map(intentFactory(PlatformType.GOOGLE));

export const BUILT_IN_INTENTS = {
  [PlatformType.ALEXA]: ALEXA_BUILT_INS,
  [PlatformType.GOOGLE]: GOOGLE_BUILT_INS,
};

export const isBuiltInIntent = (intentID) => [...ALEXA_BUILT_INS, ...GOOGLE_BUILT_INS].some((intent) => intent.id === intentID);
