import cuid from 'cuid';

import { convertToWord } from './number';

export { cuid };

const TAGS_REGEXP = /(<([^>]+)>)/gi;
const TRAILING_UNDERSCORES_REGEXP = /^_+|_+$/g;

export const createNextName = (prefix: string, items: string[]): string => {
  let counter = 1;

  while (items.includes(`${prefix}_${convertToWord(counter)}`)) {
    counter++;
  }

  return `${prefix}_${convertToWord(counter)}`;
};

export const capitalizeFirstLetter = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const capitalizeAllWords = (value: string): string => value.split(' ').map(capitalizeFirstLetter).join(' ');

export const arrayStringReplace = (targetString: string, newString: string, stringArray: string[]): string[] =>
  stringArray.map((string: string) => string.replace(targetString, newString));

export const stripHTMLTags = (str: string): string => str.replace(TAGS_REGEXP, '');

export const removeTrailingUnderscores = (str: string): string => str.replace(TRAILING_UNDERSCORES_REGEXP, '');
