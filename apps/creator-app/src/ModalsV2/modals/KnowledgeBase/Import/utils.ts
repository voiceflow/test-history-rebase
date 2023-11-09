import { Utils } from '@voiceflow/common';
import React from 'react';

import { HTTPS_URL_REGEX } from '@/constants';

import { MAX_ROWS } from './ImportUrl/ImportModal.constant';

// add https:// if not present
export const sanitizeURL = (url: string): string => {
  if (!/^https?:\/\//.test(url)) {
    url = `https://${url}`;
  }
  return url.trim();
};

export const sanitizeURLs = (urls: string): string[] => {
  return Utils.array.unique(
    urls
      .split('\n')
      .filter((url) => !!url.trim())
      .map(sanitizeURL)
  );
};

export const formatURLs = (urls: string): string[] => {
  return Utils.array.unique(sanitizeURLs(urls));
};

export const appendURLs = (urls: string, newURLs: string[]): string => {
  return Utils.array
    .unique([...urls.trim().split('\n'), ...newURLs])
    .filter(Boolean)
    .join('\n');
};

export const useURLs = () => {
  const [urls, setUrls] = React.useState<string>('');
  const [errors, setErrors] = React.useState<string[]>([]);

  const validate = () => {
    // validate if urls are valid
    const urlList = sanitizeURLs(urls);
    const errors = urlList.filter((url) => !HTTPS_URL_REGEX.test(url)).map((url) => `${url} is not a valid URL`);
    if (urlList.length > MAX_ROWS) errors.push(`Only ${MAX_ROWS} URLs are allowed, currently ${urlList.length}`);

    setErrors(errors);
    return errors.length === 0;
  };

  return { urls, setUrls, errors, validate, disabled: !urls || errors.length > 0 };
};
