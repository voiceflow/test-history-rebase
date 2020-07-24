import _trim from 'lodash/trim';
import Papa from 'papaparse';

const NEW_LINE_REGEXP = /\n/g;

export const getSlotsWithSynonyms = (value: string) =>
  Papa.parse<string[]>(value, { skipEmptyLines: true })
    .data.map((arr) => arr.map((s) => _trim(s).replace(NEW_LINE_REGEXP, '')).filter(Boolean))
    .filter((arr) => arr.length);

// eslint-disable-next-line import/prefer-default-export
export const validateSlots = (slotsWithSynonyms: string[][]) => {
  const errors = new Map<number, string>();
  const slotsNames = new Map<string, number>();
  const validSlotsWithSynonyms: string[][] = [];

  slotsWithSynonyms.forEach(([slot, ...synonym], index) => {
    const name = _trim(slot);

    if (!name) {
      errors.set(index, "Slot value can't be empty.");
    } else {
      slotsNames.set(name, index);
      validSlotsWithSynonyms.push([slot, ...synonym.map(_trim).filter(Boolean)]);
    }
  });

  return [errors, validSlotsWithSynonyms] as const;
};
