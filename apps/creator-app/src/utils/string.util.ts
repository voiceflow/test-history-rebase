import type { Nullable } from '@voiceflow/common';
import { SLOT_REGEXP } from '@voiceflow/common';

export const SPACE_REGEXP = / /g;

const URL_REGEXP_STR = '(((https?:)?\\/\\/)?(www\\.)?[\\w#%+.:=@~-]{2,256}\\.[a-z]{2,10}\\b(([\\w#%&()+./:=?@~,!-]*[^!,.])|([\\w#%&()+./:=?@~-]*)))';
export const URL_ONLY_REGEXP = new RegExp(`^${URL_REGEXP_STR}$`);
export const ALL_URLS_REGEX = new RegExp(URL_REGEXP_STR, 'g');

export const isString = (value?: unknown): value is string => typeof value === 'string';

export const getURLWithProtocol = (str: string) => {
  if (str.match(/^(\w*):/)) {
    return str;
  }

  if (str.startsWith('//')) {
    return `https:${str}`;
  }

  return `https://${str}`;
};

export const isValidURLMatch = (str: string): boolean => getURLWithProtocol(str).match(URL_ONLY_REGEXP) !== null;

export const isValidURL = (str: string): boolean => {
  try {
    return !!new URL(str);
  } catch {
    return isValidURLMatch(str);
  }
};

export const isHTTPsURL = (str: string): boolean => {
  try {
    return new URL(str).protocol === 'https:';
  } catch {
    return false;
  }
};

export const containsVariable = (str: string): boolean => !!str.match(SLOT_REGEXP);

export const matchAllAndProcess = (text: string, regexp: RegExp, processor: (result: string | RegExpMatchArray) => void): void => {
  let prevMatch: Nullable<RegExpMatchArray> = null;

  for (const match of text.matchAll(regexp)) {
    processor(text.substring(prevMatch ? (prevMatch.index ?? 0) + prevMatch[0].length : 0, match.index));

    processor(match);

    prevMatch = match;
  }

  processor(text.substring(prevMatch ? (prevMatch.index ?? 0) + prevMatch[0].length : 0, text.length));
};

export const formatAssistantName = (value: string): string => value.trim() || 'Untitled Assistant';
