import { READABLE_VARIABLE_REGEXP } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import _isString from 'lodash/isString';
import Papa from 'papaparse';

import { rawTextToUtteranceFormat } from '@/client/adapters/textEditor';
import { validateUtterance } from '@/utils/intent';

const NEW_LINE_REGEXP = /\n/g;

export const getSlotsWithSynonyms = (value: string) =>
  Papa.parse<string[]>(value, { skipEmptyLines: true })
    .data.map((arr) => arr.map((s) => s.trim().replace(NEW_LINE_REGEXP, '')).filter(Boolean))
    .filter((arr) => arr.length);

export const validateSlots = (slotsWithSynonyms: string[][]) => {
  const errors = new Map<number, string>();
  const validSlotsWithSynonyms: string[][] = [];

  slotsWithSynonyms.forEach(([slot, ...synonym], index) => {
    const name = slot.trim();

    if (!name) {
      errors.set(index, "Slot value can't be empty.");
    } else {
      validSlotsWithSynonyms.push([slot, ...synonym.map((part) => part.trim()).filter(Boolean)]);
    }
  });

  return [errors, validSlotsWithSynonyms] as const;
};

export const getUniqSlots = (value: string) => [...new Set([...value.matchAll(READABLE_VARIABLE_REGEXP)].map((res) => res[1]))];
export const getUtterances = (value: string) =>
  value
    .split('\n')
    .map((part) => part.trim())
    .filter(Boolean);

export const validateUtterances = ({
  slots,
  intents,
  builtIn,
  platform,
  intentID,
  utterances,
}: {
  slots: Realtime.Slot[];
  intents: Platform.Base.Models.Intent.Model[];
  builtIn: boolean;
  intentID: string | null;
  platform: Platform.Constants.PlatformType;
  utterances: string[];
}) => {
  const errors = new Map<number, string>();
  const slotsMap = slots.reduce<Record<string, string>>((acc, slot) => Object.assign(acc, { [slot.name]: slot.id }), {});
  const validUtterances: { text: string; slots: string[] }[] = [];

  utterances.forEach((utterance, index) => {
    const name = utterance.trim();

    const error = validateUtterance(name, intentID, intents, platform);

    if (error) {
      errors.set(index, error);

      return;
    }

    const uniqSlot = getUniqSlots(utterance);
    if (builtIn && uniqSlot.length) {
      errors.set(index, `Built-in intents cannot have slots`);
    } else if (uniqSlot.some((slotName) => !slotsMap[slotName])) {
      const slotName = uniqSlot.find((slotName) => !slotsMap[slotName]);

      errors.set(index, `The Slot "${slotName}" does not exist, please create the slot in Voiceflow and re-upload.`);
    } else {
      let text = '';
      let utteranceSlots: string[] = [];
      const str = rawTextToUtteranceFormat(utterance, slotsMap);

      if (_isString(str)) {
        text = str;
      } else {
        text = str.text;
        utteranceSlots = str.utteranceSlots;
      }

      validUtterances.push({ text, slots: utteranceSlots });
    }
  });

  return [errors, validUtterances] as const;
};
