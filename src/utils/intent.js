import { constants } from '@voiceflow/common';
import { find } from 'lodash';

import { PlatformType } from '@/constants';

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

export const intentFactory = (platform) => (intent) => ({
  platform,
  built_in: true,
  name: intent.name,
  key: intent.name,
  inputs: [
    {
      text: '',
      slots: intent.slots,
    },
  ],
});

export const ALEXA_BUILT_INS = constants.intents.BUILT_IN_INTENTS_ALEXA.map(intentFactory(PlatformType.ALEXA));

export const GOOGLE_BUILT_INS = constants.intents.BUILT_IN_INTENTS_GOOGLE.map(intentFactory(PlatformType.GOOGLE));

export const isBuiltInIntent = (intentID) => [...ALEXA_BUILT_INS, ...GOOGLE_BUILT_INS].some((intent) => intent.key === intentID);
