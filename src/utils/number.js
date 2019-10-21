import numberToWords from 'number-to-words/src';

// eslint-disable-next-line import/prefer-default-export
export const convertToWord = (number) =>
  numberToWords
    .toWords(number)
    .replace(/\s/g, '_')
    .replace(/,/g, '')
    .replace(/-/g, '_');
