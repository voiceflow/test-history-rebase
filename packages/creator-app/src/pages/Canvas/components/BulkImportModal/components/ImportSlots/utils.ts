import Papa from 'papaparse';

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
