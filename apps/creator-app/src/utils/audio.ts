const BUCKET_PREFIX_REGEX = /(.*?)\/\d+-/;
const BUCKET_STRING = 'voiceflow-audio';

export const prettifyBucketURL = (url?: string | null): string =>
  url?.includes(BUCKET_STRING) ? url.replace(BUCKET_PREFIX_REGEX, '') : url ?? '';
