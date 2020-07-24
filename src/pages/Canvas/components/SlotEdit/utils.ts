import cuid from 'cuid';

import { SlotInput } from '@/models';

export const generateSlotInput = (value = '', synonyms = ''): SlotInput => ({
  id: cuid.slug(),
  value,
  synonyms,
});

export const mergeSlotInputs = (inputs1: SlotInput[], inputs2: SlotInput[]): SlotInput[] => {
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
