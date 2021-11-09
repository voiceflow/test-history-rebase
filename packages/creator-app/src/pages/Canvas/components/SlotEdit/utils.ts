import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

export const generateSlotInput = (value = '', synonyms = ''): Realtime.SlotInput => ({
  id: Utils.id.cuid.slug(),
  value,
  synonyms,
});

export const mergeSlotInputs = (inputs1: Realtime.SlotInput[], inputs2: Realtime.SlotInput[]): Realtime.SlotInput[] => {
  const mergeMap = new Map<string, { id: string; value: string; synonyms: string[] }>();

  [...inputs1, ...inputs2].forEach((input) => {
    const mergeInput = mergeMap.get(input.value);
    const synonyms = input.synonyms
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (mergeInput) {
      mergeMap.set(input.value, {
        ...mergeInput,
        synonyms: [...new Set([...mergeInput.synonyms, ...synonyms])],
      });
    } else {
      mergeMap.set(input.value, {
        id: input.id,
        value: input.value,
        synonyms: [...new Set(synonyms)],
      });
    }
  });

  return [...mergeMap.values()].map((mergeInput) => ({
    ...mergeInput,
    synonyms: mergeInput.synonyms.join(', '),
  }));
};
