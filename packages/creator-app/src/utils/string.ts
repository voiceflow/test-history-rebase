import { Constants } from '@voiceflow/general-types';
import cuid from 'cuid';

import { URL_ONLY_REGEX } from '@/constants';
import { isGeneralPlatform } from '@/utils/typeGuards';

import { convertToWord, NON_ALPHANUMERIC_REGEXP } from './number';

export { cuid };

const TAGS_REGEXP = /(<([^>]+)>)/gi;
const TRAILING_UNDERSCORES_REGEXP = /^_+|_+$/g;

export const createNextName = (prefix: string, items: string[], platform: Constants.PlatformType): string => {
  let counter = 1;

  const isGeneral = isGeneralPlatform(platform);

  const genIntentName = (counter: number) => {
    const name = `${prefix} ${convertToWord(counter)}`;

    return isGeneral ? name : name.replace(NON_ALPHANUMERIC_REGEXP, '_');
  };

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

export const conditionalReplace = (base: string, pattern: RegExp, value?: string) => {
  return value ? base.replace(pattern, value) : base;
};

export const isURL = (str: string): boolean => !!str.match(URL_ONLY_REGEX);

export const getValidHref = (href: string): string => (href.startsWith('//') || href.includes('://') ? href : `//${href}`);

export const formatProjectName = (value: string): string => value.trim() || 'Untitled Project';
