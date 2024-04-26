import { READABLE_VARIABLE_REGEXP, SLOT_REGEXP } from '@voiceflow/common';

import {
  BUCKET_PREFIX_REGEX,
  BUCKET_STRING,
  HTTPS_URL_REGEX,
  IMAGE_FILE_TYPES,
  LINK_ERROR,
  MAX_SIZE,
  UPLOAD_ERROR,
} from './constants';

export const transformVariablesToReadable = (text?: string) => text?.replace(SLOT_REGEXP, '{$1}').trim() || '';
export const hasVariables = (value: string) => !!value.match(READABLE_VARIABLE_REGEXP);

export const validateImageUrl = async (value: string): Promise<null> => {
  return new Promise((resolve, reject) => {
    if (hasVariables(value)) {
      resolve(null);
      return;
    }

    const urlError = validateURL(value);
    if (urlError) {
      reject(urlError);
      return;
    }

    const image = new Image();
    image.onload = () => resolve(null);
    image.onerror = () => reject(LINK_ERROR.INVALID_FILE);
    image.src = value;
  });
};

export const validateURL = (value: string) => {
  if (!value.match(READABLE_VARIABLE_REGEXP) && !value.match(HTTPS_URL_REGEX)) {
    return LINK_ERROR.INVALID_URL;
  }

  return null;
};

export const validateFiles = (files: File[]) => {
  if (files.length !== 1) {
    return UPLOAD_ERROR.ONE_FILE_LIMIT;
  }

  if (files[0].size > MAX_SIZE) {
    return UPLOAD_ERROR.TOO_LARGE;
  }

  return null;
};

export const hasValidImages = (acceptedFiles: File[]) =>
  !IMAGE_FILE_TYPES.includes(`.${acceptedFiles[0].type.split('/')[1] || acceptedFiles[0].type}`)
    ? 'File type Not Supported'
    : null;

export const prettifyBucketURL = (url = '') =>
  url?.includes(BUCKET_STRING) ? url?.replace(BUCKET_PREFIX_REGEX, '') : url;
