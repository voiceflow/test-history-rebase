export const IMAGE_FILE_TYPES = ['.jpg', '.jpeg', '.png', '.gif'];
export const HTTPS_URL_REGEX = /https:\/\/(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,10}\b([\w#%&+./:=?@~-]*)/;

export const UPLOAD_ERROR = {
  BACKEND: 'There was a problem uploading the file',
  INVALID_FILE_TYPE: 'Invalid file type',
  INVALID_URL: 'Link invalid, make sure to use https links.',
  ONE_FILE_LIMIT: 'Only single file uploads allowed',
  TOO_LARGE: 'File exceeds 10MB, upload as a link',
  UNKNOWN: 'There was an error',
};

export const LINK_ERROR = {
  INVALID_URL: 'Link invalid, make sure to use https links.',
  INVALID_FILE: 'Link invalid, make sure to use link for a valid file.',
};

export const FILE_TYPE_MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mpeg': 'video/mpeg',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.csv': 'text/csv',
  '.zip': 'application/zip',
  '.xml': 'application/xml',
  '.json': 'application/json',
};

export const MAX_SIZE = 10 * 1024 * 1024;

export const BUCKET_PREFIX_REGEX = /(.*?)\/\d+-/;
export const BUCKET_STRING = 'getstoryflow.audio';
