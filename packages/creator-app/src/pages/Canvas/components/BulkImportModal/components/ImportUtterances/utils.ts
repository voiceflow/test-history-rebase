import { READABLE_VARIABLE_REGEXP } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _isString from 'lodash/isString';

import { rawTextToUtteranceFormat } from '@/client/adapters/textEditor';
import { validateUtterance } from '@/utils/intent';

export const getUniqSlots = (value: string) => [...new Set([...value.matchAll(READABLE_VARIABLE_REGEXP)].map((res) => res[1]))];
export const getUtterances = (value: string) =>
  value
    .split('\n')
    .map((part) => part.trim())
    .filter(Boolean);

export const validateUtterances = ({
  utterances,
  intentID,
  intents,
  slots,
  builtIn,
  platform,
}: {
  utterances: string[];
  intentID: string;
  intents: Realtime.Intent[];
  slots: Realtime.Slot[];
  builtIn: boolean;
  platform: VoiceflowConstants.PlatformType;
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
