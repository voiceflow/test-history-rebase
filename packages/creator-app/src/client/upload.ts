import { UploadClient } from '@voiceflow/ui';

import file from './file';

const client: UploadClient = {
  upload: async (endpoint, fileType, data) => {
    if (fileType === 'audio') {
      return (await file.uploadAudio(endpoint, data)).data;
    }

    return (await file.uploadImage(endpoint, data)).data;
  },
};

export default client;
