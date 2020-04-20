import { AUDIO_FILE_BUCKET_NAME } from '@/constants';

const AUDIO_REGEX = new RegExp(`${AUDIO_FILE_BUCKET_NAME}/\\d+-`);

// eslint-disable-next-line import/prefer-default-export
export const getAudioTitle = (url = '') => url.replace(AUDIO_REGEX, '');
