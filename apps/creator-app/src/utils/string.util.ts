import type { Nullable } from '@voiceflow/common';
import { SLOT_REGEXP } from '@voiceflow/common';

export const SPACE_REGEXP = / /g;

const DOMAINS_LIST = [
  'com',
  'cn',
  'de',
  'net',
  'uk',
  'org',
  'nl',
  'info',
  'ru',
  'br',
  'eu',
  'fr',
  'au',
  'it',
  'ca',
  'pl',
  'top',
  'biz',
  'ch',
  'in',
  'us',
  'es',
  'xyz',
  'se',
  'be',
  'jp',
  'loan',
  'dk',
  'cz',
  'at',
  'za',
  'club',
  'kr',
  'pt',
  'mx',
  'ir',
  'ro',
  'рф',
  'vip',
  'no',
  'online',
  'hu',
  'nz',
  'tw',
  'win',
  'cl',
  'ua',
  'ar',
  'nu',
  'fi',
  'ltd',
  'mobi',
  'vn',
  'men',
  'shop',
  'tr',
  'site',
  'sk',
  'my',
  'bid',
  'wang',
  'work',
  'pro',
  'stream',
  'hk',
  'ie',
  'id',
  'il',
  'review',
  'space',
  'app',
  'asia',
  'tech',
  'website',
  'lt',
  'sg',
  'xin',
  'store',
  'live',
  'life',
  'trade',
  'blog',
  'kz',
  'name',
  'cloud',
  'date',
  'si',
  'by',
  'download',
  'party',
  'link',
  'su',
  'ee',
  'ng',
  'cat',
  'ren',
  'pe',
  'hr',
  'edu',
  'gov',
  'mil',
  'rs',
  'io',
  'chat',
];

// this regex is copied from the slack source code
const URL_REGEXP_STR = `([*_]?)((?:([A-Za-z][\\w+.-]{1,50}):(/{1,3})|www[\\.]|(?:[0-9A-Za-z][\\w-]{0,50}\\.(?=([0-9A-Za-z][\\w-]{0,50}\\.){0,20}(?:${DOMAINS_LIST.join(
  '|'
)})(?:/|$|\\)|:|\\s))))(?:[^"\\s&()]|\\([^"\\s&()]*\\)|&amp;|&|&quot;)+(?:\\([^"\\s&()]*\\)|[^!"#$%&'()+,\\.:;<=>?@\\[\\]^\`{|}~\\s]))(?=\\1)#?`;

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

export const isValidURLMatch = (str: string): boolean => str.match(URL_ONLY_REGEXP) !== null;

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

export const formatAssistantName = (value: string): string => value.trim() || 'Untitled Agent';
