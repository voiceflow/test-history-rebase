import { Nullable, READABLE_VARIABLE_REGEXP, SLOT_REGEXP, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';

import { STRICT_LINKS_REGEXS, URL_ONLY_REGEX, VALID_LINKS_REGEXS } from '@/utils/string.util';

export const isString = (value?: unknown): value is string => typeof value === 'string';

export const createNextName = (prefix: string, items: string[], platform: Platform.Constants.PlatformType): string => {
  let counter = 1;

  const genIntentName = (counter: number) => {
    const name = `${prefix} ${Utils.number.convertToWord(counter)}`;

    return Platform.Config.get(platform).isVoiceflowBased ? name : name.replace(Utils.number.NON_ALPHANUMERIC_REGEXP, '_');
  };

  let intentName = genIntentName(counter);

  while (items.includes(intentName)) {
    counter++;
    intentName = genIntentName(counter);
  }

  return intentName;
};

export const isURL = (str: string): boolean => !!str.match(URL_ONLY_REGEX);

export const isAnyLink = (str: string): boolean => !!VALID_LINKS_REGEXS.some((regexp) => str.match(regexp));

export const isAnyStrictLink = (str: string): boolean => !!STRICT_LINKS_REGEXS.some((regexp) => str.match(regexp));

export const getValidHref = (href: string): string => (href.startsWith('//') || href.includes('://') || isAnyStrictLink(href) ? href : `//${href}`);

export const formatProjectName = (value: string): string => value.trim() || 'Untitled Assistant';

export const containsSlotOtVariable = (str: string): boolean => !!str.match(SLOT_REGEXP);

export const containsReadableVariable = (str: string): boolean => !!str.match(READABLE_VARIABLE_REGEXP);

export const matchAllAndProcess = (text: string, regexp: RegExp, processor: (result: string | RegExpMatchArray) => void): void => {
  let prevMatch: Nullable<RegExpMatchArray> = null;

  for (const match of text.matchAll(regexp)) {
    processor(text.substring(prevMatch ? (prevMatch.index ?? 0) + prevMatch[0].length : 0, match.index));

    processor(match);

    prevMatch = match;
  }

  processor(text.substring(prevMatch ? (prevMatch.index ?? 0) + prevMatch[0].length : 0, text.length));
};
