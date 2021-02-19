import _isPlainObject from 'lodash/isPlainObject';

import { Intent, IntentInput, IntentSlot } from '@/models';

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
