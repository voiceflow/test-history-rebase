import { AxiosResponse } from 'axios';

import { UploadClient } from '@/components/legacy/Upload/Context';

import file from './file';

const client: UploadClient = {
  upload: async (endpoint: string, fileType: string, data: FormData): Promise<string> => {
    let res: AxiosResponse<string, any>;

    switch (fileType) {
      case 'audio':
        res = await file.uploadAudio(data);
        break;
      case 'video':
        res = await file.uploadVideo(data);
        break;
      default:
        res = await file.uploadImage(endpoint, data);
    }

    return res.data;
  },
};

export default client;
