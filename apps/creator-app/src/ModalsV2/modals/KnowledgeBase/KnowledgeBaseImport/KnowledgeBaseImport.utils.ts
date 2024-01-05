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

export const hasUrlValidator = validatorFactory((urls: string) => urls.trim(), 'At least one URL is required.');

export const urlMaxNumberValidator = validatorFactory(
  (urls: string) => urls.split('\n').length <= URLS_LIMIT,
  `URLs must be less than ${URLS_LIMIT}`
);

export const urlRegexValidator = validatorFactory(
  (urls: string) => urls.split('\n').every((url) => url.trim().match(URL_ONLY_REGEX)),
  (urls) => {
    const filteredUrls = urls.split('\n').filter((url) => !url.trim().match(URL_ONLY_REGEX));

    return filteredUrls
      .map((url, index) =>
        filteredUrls.length === 0 || index === filteredUrls.length - 1 ? `"${url}" is not a valid URL.` : `"${url}" is not a valid URL,`
      )
      .slice(0, 5)
      .join('\n');
  }
);

export const urlsValidator = composeValidators(hasUrlValidator, urlMaxNumberValidator, urlRegexValidator);
