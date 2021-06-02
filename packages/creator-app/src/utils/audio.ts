import { AUDIO_FILE_BUCKET_NAME } from '@/constants';

const AUDIO_REGEX = new RegExp(`${AUDIO_FILE_BUCKET_NAME}/\\d+-`);

// eslint-disable-next-line import/prefer-default-export
export const getAudioTitle = (url = '') => url?.replace(AUDIO_REGEX, '');

const BUCKET_PREFIX_REGEX = new RegExp(`(.*?)/\\d+-`);

const BUCKET_STRING = 'getstoryflow.audio';

export const prettifyBucketURL = (url = '') => (url?.includes(BUCKET_STRING) ? url?.replace(BUCKET_PREFIX_REGEX, '') : url);
