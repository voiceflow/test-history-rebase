import _isPlainObject from 'lodash/isPlainObject';

import { PlatformType } from '@/constants';
import { Intent, IntentInput, IntentSlot } from '@/models';
import { isCustomizeableBuiltInIntent, removeBuiltInPrefix } from '@/utils/intent';
import { capitalizeFirstLetter } from '@/utils/string';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

export const getUniqSlots = (inputs: IntentInput[]) => [...new Set(inputs.flatMap(({ slots }) => slots || []))];

export const newSlotsCreator = (id: string): IntentSlot => ({
  id,
  dialog: { prompt: [{ text: '', slots: [] }], utterances: [], confirm: [{ text: '', slots: [] }], confirmEnabled: false },
  required: false,
});

export const intentProcessor = ({ inputs = [], ...intent }: Intent): Intent => {
  let { slots } = intent;

  if (!_isPlainObject(slots)) {
    const allKeys = getUniqSlots(inputs);
    const byKey = allKeys.reduce<Record<string, IntentSlot>>((obj, id) => Object.assign(obj, { [id]: newSlotsCreator(id) }), {});

    slots = { byKey, allKeys };
  }

  return { ...intent, slots, inputs };
};

export const applySingleIntentNameFormatting = (intent: Intent, platform: PlatformType) => {
  let { name } = intent ?? { name: '' };
  if (isCustomizeableBuiltInIntent(intent)) {
    // eslint-disable-next-line prefer-destructuring
    name = removeBuiltInPrefix(name);

    if (isAnyGeneralPlatform(platform)) {
      name = capitalizeFirstLetter(name?.toLowerCase());
    } else if (platform === PlatformType.ALEXA) {
      name = name.replace(/(\w)Intent/g, '$1');
    }
  }
  return {
    ...intent,
    name,
  };
};

export const applyIntentNameFormatting = (intents: Intent[], platform: PlatformType) =>
  intents.map((intent) => applySingleIntentNameFormatting(intent, platform));
