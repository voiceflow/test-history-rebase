import type { Nullable } from '@voiceflow/common';

export const URL_REGEX = /(((https?:)?\/\/)?(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,10}\b([\w#%&+./:=?@~-]*))/;
export const URL_ONLY_REGEX = /^(((https?:)?\/\/)?(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,10}\b([\w#%&()+./:=?@~-]*))$/;
export const ALL_URLS_REGEX = RegExp(URL_REGEX, 'g');
export const HTTPS_URL_REGEX = /https:\/\/(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,10}\b([\w#%&+./:=?@~-]*)/;
export const LINK_ABOUT_ONLY_REGEX = /^about:[\w#%+.:=@~-]{2,256}\b([\w#%&+./:=?@~-]*)$/;
export const LINK_BITCOIN_ONLY_REGEX = /^bitcoin:[\dA-Za-z]{26,35}([\w#%&+./:=?@~-]*)$/;
export const LINK_CALLTO_ONLY_REGEX = /^callto:[+\d-\s()]+$/;
export const LINK_TEL_ONLY_REGEX = /^tel:[+\d-\s()]+$/;
export const LINK_SMS_ONLY_REGEX = /^sms:[+\d-\s()]+$/;
export const LINK_MAILTO_ONLY_REGEX = /^mailto:([^\s?]+)\b([\w#%&+./:=?@~-]*)$/;
export const LINK_IM_ONLY_REGEX = /^im:([^\s?]+)\b([\w#%&+./:=?@~-]*)$/;
export const LINK_FACETIME_ONLY_REGEX = /^facetime(-(audio|group))?:([^\s?]+|([+\d-()]+))$/;
export const LINK_SKYPE_ONLY_REGEX = /^skype:(\S+)\b$/;
export const LINK_WEBCALL_ONLY_REGEX = /^webcal:(\S+)\b$/;

export const VARIABLE_REGEX = /{([\w-]{1,36})}/;

export const STRICT_LINKS_REGEXS = [
  LINK_ABOUT_ONLY_REGEX,
  LINK_BITCOIN_ONLY_REGEX,
  LINK_CALLTO_ONLY_REGEX,
  LINK_TEL_ONLY_REGEX,
  LINK_SMS_ONLY_REGEX,
  LINK_MAILTO_ONLY_REGEX,
  LINK_IM_ONLY_REGEX,
  LINK_FACETIME_ONLY_REGEX,
  LINK_SKYPE_ONLY_REGEX,
  LINK_WEBCALL_ONLY_REGEX,
];

export const VALID_LINKS_REGEXS = [URL_ONLY_REGEX, ...STRICT_LINKS_REGEXS];

export const isString = (value?: unknown): value is string => typeof value === 'string';

export const isURL = (str: string): boolean => !!str.match(URL_ONLY_REGEX);

export const isHttpsURL = (str: string): boolean => !!str.match(HTTPS_URL_REGEX);

export const isAnyLink = (str: string): boolean => !!VALID_LINKS_REGEXS.some((regexp) => str.match(regexp));

export const isAnyStrictLink = (str: string): boolean => !!STRICT_LINKS_REGEXS.some((regexp) => str.match(regexp));

export const getValidHref = (href: string): string => (href.startsWith('//') || href.includes('://') || isAnyStrictLink(href) ? href : `//${href}`);

export const containsVariable = (str: string): boolean => !!str.match(VARIABLE_REGEX);

export const formatAssistantName = (value: string): string => value.trim() || 'Untitled Assistant';

export const matchAllAndProcess = (text: string, regexp: RegExp, processor: (result: string | RegExpMatchArray) => void): void => {
  let prevMatch: Nullable<RegExpMatchArray> = null;

  for (const match of text.matchAll(regexp)) {
    processor(text.substring(prevMatch ? (prevMatch.index ?? 0) + prevMatch[0].length : 0, match.index));

    processor(match);

    prevMatch = match;
  }

  processor(text.substring(prevMatch ? (prevMatch.index ?? 0) + prevMatch[0].length : 0, text.length));
};
