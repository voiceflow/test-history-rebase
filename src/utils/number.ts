import numberToWords from 'number-to-words/src';

export const convertToWord = (value: number) =>
  numberToWords
    .toWords(value)
    .replace(/\s/g, '_')
    .replace(/,/g, '')
    .replace(/-/g, '_');

export const isInRange = (target: number, min: number, max: number) => target >= min && target <= max;
