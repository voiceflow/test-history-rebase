import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { URL_ONLY_REGEX, VALID_LINKS_REGEXS } from '@/constants';
import { isGeneralPlatform } from '@/utils/typeGuards';

export const createNextName = (prefix: string, items: string[], platform: VoiceflowConstants.PlatformType): string => {
  let counter = 1;

  const isGeneral = isGeneralPlatform(platform);

  const genIntentName = (counter: number) => {
    const name = `${prefix} ${Utils.number.convertToWord(counter)}`;

    return isGeneral ? name : name.replace(Utils.number.NON_ALPHANUMERIC_REGEXP, '_');
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

export const getValidHref = (href: string): string => (href.startsWith('//') || href.includes('://') || isAnyLink(href) ? href : `//${href}`);

export const formatProjectName = (value: string): string => value.trim() || 'Untitled Project';
