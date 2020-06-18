import _isString from 'lodash/isString';
import _trim from 'lodash/trim';

import { matchVariables } from '@/client/adapters/textEditor';
import { VARIABLE_STRING_REGEXP } from '@/constants';
import { Intent, Slot } from '@/models';
import { validateUtterance } from '@/utils/intent';

export const getUniqSlots = (value: string) => [...new Set([...value.matchAll(VARIABLE_STRING_REGEXP)].map((res) => res[1]))];
export const getUtterances = (value: string) => value.split('\n').map(_trim).filter(Boolean);

// eslint-disable-next-line import/prefer-default-export
export const validateUtterances = (utterances: string[], intentID: string, intents: Intent[], slots: Slot[]) => {
  const errors = new Map<number, string>();
  const slotsMap = slots.reduce<Record<string, string>>((acc, slot) => Object.assign(acc, { [slot.name]: slot.id }), {});
  const validUtterances: { text: string; slots: string[] }[] = [];

  utterances.forEach((utterance, index) => {
    const name = _trim(utterance);

    const error = validateUtterance(name, intentID, intents);

    if (error) {
      errors.set(index, error);

      return;
    }

    const uniqSlot = getUniqSlots(utterance);

    if (uniqSlot.some((slotName) => !slotsMap[slotName])) {
      const slotName = uniqSlot.find((slotName) => !slotsMap[slotName]);

      errors.set(index, `The Slot "${slotName}" does not exist, please create the slot in Voiceflow and re-upload.`);
    } else {
      let text = '';
      const utteranceSlots: string[] = [];

      matchVariables(utterance).forEach((str) => {
        if (_isString(str)) {
          text += str;
        } else {
          const slotID = slotsMap[str.name];

          text += `{{[${str.name}].${slotID}}}`;
          utteranceSlots.push(slotID);
        }
      });

      validUtterances.push({ text, slots: utteranceSlots });
    }
  });

  return [errors, validUtterances] as const;
};
