import { Utils } from '@voiceflow/common';
import { composeValidators, validatorFactory } from '@voiceflow/utils-designer';

import { URL_ONLY_REGEX } from '@/utils/string.util';

import { URLS_LIMIT } from './KnowledgeBaseImport.constant';
// add https:// if not present
export const sanitizeURL = (url: string): string => {
  const trimmedURL = url.trim();

  if (!trimmedURL) return '';

  return trimmedURL.match(/^https?:\/\//) ? trimmedURL : `https://${trimmedURL}`;
};

export const sanitizeURLs = (urls: string[]): string[] => Utils.array.unique(urls.map(sanitizeURL).filter(Boolean));

export const urlsValidator = composeValidators(
  validatorFactory((str: string) => str.trim(), 'At least one URL is required.'),
  validatorFactory((str: string) => str.split('\n').length <= URLS_LIMIT, 'URLs must be less than 300'),
  validatorFactory(
    (urls) => urls.split('\n').every((url) => url.trim().match(URL_ONLY_REGEX)),
    (urls) =>
      urls
        .split('\n')
        .filter((url) => !url.trim().match(URL_ONLY_REGEX))
        .map((url) => `"${url}" is not a valid URL.`)
        .slice(0, 5)
        .join('\n')
  )
);
