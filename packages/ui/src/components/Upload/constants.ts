export const IMAGE_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/gif'];
export const HTTPS_URL_REGEX = /https:\/\/(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,10}\b([\w#%&+./:=?@~-]*)/;

export const UPLOAD_ERROR = {
  BACKEND: 'There was a problem uploading the file',
  INVALID_FILE_TYPE: 'Invalid file type',
  INVALID_URL: 'The link is invalid, make sure to use https',
  ONE_FILE_LIMIT: 'Only single file uploads allowed',
  TOO_LARGE: 'File exceeds 10MB, upload as a link',
};

export const LINK_ERROR = {
  INVALID_URL: 'The link is invalid, make sure to use https',
};

export const MAX_SIZE = 10 * 1024 * 1024;

export const BUCKET_PREFIX_REGEX = /(.*?)\/\d+-/;
export const BUCKET_STRING = 'getstoryflow.audio';
