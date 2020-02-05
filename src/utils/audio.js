import { AUDIO_FILE_BUCKET_NAME } from '@/constants';

// eslint-disable-next-line import/prefer-default-export
export const getAudioTitle = (url) => {
  const isUploadedFile = url?.includes(AUDIO_FILE_BUCKET_NAME);
  let fileName = '';
  if (isUploadedFile) {
    fileName = url
      .split('/')
      .pop()
      .split('-')
      .pop();
  }

  return (isUploadedFile ? fileName : url) || 'Audio';
};
