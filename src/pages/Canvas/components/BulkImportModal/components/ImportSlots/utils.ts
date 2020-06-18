import _trim from 'lodash/trim';
import Papa from 'papaparse';

const NEW_LINE_REGEXP = /\n/g;

export const getSlotsWithSynonyms = (value: string) =>
  Papa.parse<string[]>(value, { skipEmptyLines: true })
    .data.map((arr) => arr.map((s) => _trim(s).replace(NEW_LINE_REGEXP, '')).filter(Boolean))
    .filter((arr) => arr.length);

// eslint-disable-next-line import/prefer-default-export
export const validateSlots = (slotsWithSynonyms: string[][], values: string[]) => {
  const errors = new Map<number, string>();
  const slotsNames = new Map<string, number>();
  const validSlotsWithSynonyms: string[][] = [];

  slotsWithSynonyms.forEach(([slot, ...synonym], index) => {
    const name = _trim(slot);

    if (!name) {
      errors.set(index, "Slot value can't be empty.");
    } else if (slotsNames.has(name)) {
      errors.set(index, `An identical slot value already exists on ${slotsNames.get(name)! + 1} line.`);
    } else if (values.includes(name)) {
      errors.set(index, 'An identical slot value already exists inside this slot.');
    } else {
      slotsNames.set(name, index);
      validSlotsWithSynonyms.push([slot, ...synonym.map(_trim).filter(Boolean)]);
    }
  });

  return [errors, validSlotsWithSynonyms] as const;
};
