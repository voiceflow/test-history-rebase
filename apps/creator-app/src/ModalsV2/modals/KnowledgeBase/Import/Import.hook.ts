import React from 'react';

import { HTTPS_URL_REGEX } from '@/constants';

import { sanitizeURLs } from './Import.utils';
import { MAX_ROWS } from './ImportUrl/ImportUrl.constant';

export const useURLs = () => {
  const [urls, setUrls] = React.useState<string>('');
  const [errors, setErrors] = React.useState<string[]>([]);

  const validate = () => {
    // validate if urls are valid
    const urlList = sanitizeURLs(urls);
    const errors = urlList.filter((url) => !HTTPS_URL_REGEX.test(url)).map((url) => `${url} is not a valid URL`);
    if (urlList.length > MAX_ROWS) errors.push(`URLs must be less than 300`);

    setErrors(errors);
    return errors.length === 0;
  };

  return { urls, setUrls, errors, validate, disabled: !urls || errors.length > 0 };
};
