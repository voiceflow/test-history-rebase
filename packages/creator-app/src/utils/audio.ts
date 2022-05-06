const BUCKET_PREFIX_REGEX = /(.*?)\/\d+-/;
const BUCKET_STRING = 'getstoryflow.audio';

export const prettifyBucketURL = (url = '') => (url?.includes(BUCKET_STRING) ? url?.replace(BUCKET_PREFIX_REGEX, '') : url);
