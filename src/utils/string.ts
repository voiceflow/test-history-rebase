import cuid from 'cuid';

import { convertToWord } from './number';

export { cuid };

const TAGS_REGEXP = /(<([^>]+)>)/gi;
const TRAILING_UNDERSCORES_REGEXP = /^_+|_+$/g;
const SPECIAL_CHARACTERS_REGEXP = /[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}-]+/;

export const createNextName = (prefix: string, items: string[]) => {
  let counter = 1;
  while (items.includes(`${prefix}_${convertToWord(counter)}`)) {
    counter++;
  }
  return `${prefix}_${convertToWord(counter)}`;
};

export const capitalizeFirstLetter = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const capitalizeAllWords = (value: string) => value.split(' ').map(capitalizeFirstLetter).join(' ');

export const arrayStringReplace = (targetString: string, newString: string, stringArray: string[]) =>
  stringArray.map((string: string) => string.replace(targetString, newString));

export const stripHTMLTags = (str: string) => str.replace(TAGS_REGEXP, '');

export const removeTrailingUnderscores = (str: string) => str.replace(TRAILING_UNDERSCORES_REGEXP, '');

export const checkForSpecialCharacters = (str: string) => str.match(SPECIAL_CHARACTERS_REGEXP);

export const removeSpecialCharacters = (str: string) => str.replace(SPECIAL_CHARACTERS_REGEXP, '');

export const abbreviate = (name: string, maxLength: number) => (name.length <= maxLength ? name : name.substr(0, maxLength).concat('...'));
