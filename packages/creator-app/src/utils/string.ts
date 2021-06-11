import cuid from 'cuid';

import { PlatformType } from '@/constants';
import { isGeneralPlatform } from '@/utils/typeGuards';

import { convertToWord } from './number';

export { cuid };

const TAGS_REGEXP = /(<([^>]+)>)/gi;
const TRAILING_UNDERSCORES_REGEXP = /^_+|_+$/g;

export const createNextName = (prefix: string, items: string[], platform: PlatformType): string => {
  let counter = 1;

  const isGeneral = isGeneralPlatform(platform);
  const genIntentName = (counter: number) => (isGeneral ? `${prefix} ${convertToWord(counter)}` : `${prefix}_${convertToWord(counter)}`);

  let intentName = genIntentName(counter);

  while (items.includes(intentName)) {
    counter++;
    intentName = genIntentName(counter);
  }

  return intentName;
};

export const capitalizeFirstLetter = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const capitalizeAllWords = (value: string): string => value.split(' ').map(capitalizeFirstLetter).join(' ');

export const arrayStringReplace = (targetString: string, newString: string, stringArray: string[]): string[] =>
  stringArray.map((string: string) => string.replace(targetString, newString));

export const stripHTMLTags = (str: string): string => str.replace(TAGS_REGEXP, '');

export const removeTrailingUnderscores = (str: string): string => str.replace(TRAILING_UNDERSCORES_REGEXP, '');
