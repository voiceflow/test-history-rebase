import { READABLE_VARIABLE_REGEXP } from '@voiceflow/common';
import { Entity, IntentWithUtterances } from '@voiceflow/dtos';
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

export const validateUtterancesOnUpload = ({
  intents,
  builtIn,
  platform,
  entities,
  intentID,
  utterances,
}: {
  intents: Array<Platform.Base.Models.Intent.Model | IntentWithUtterances>;
  builtIn: boolean;
  intentID: string | null;
  entities: Array<Realtime.Slot | Entity>;
  platform: Platform.Constants.PlatformType;
  utterances: string[];
}) => {
  const errors = new Map<number, string>();
  const validUtterances: { text: string; slots: string[] }[] = [];
  const entityMapByName = entities.reduce<{ [name: string]: string }>((acc, entity) => Object.assign(acc, { [entity.name]: entity.id }), {});

  utterances.forEach((utterance, index) => {
    const error = validateUtterance(utterance, intentID, intents, platform);

    if (error) {
      errors.set(index, error);

      return;
    }

    const uniqSlotNames = getUniqSlots(utterance);

    if (builtIn && uniqSlotNames.length) {
      errors.set(index, `Built-in intents cannot have entities.`);
    } else if (uniqSlotNames.some((name) => !entityMapByName[name])) {
      const name = uniqSlotNames.find((name) => !entityMapByName[name]);

      errors.set(index, `The Entity "${name}" does not exist, please create the entity in Voiceflow and re-upload.`);
    } else {
      let text = '';
      let utteranceSlots: string[] = [];
      const str = rawTextToUtteranceFormat(utterance, entityMapByName);

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
