import React from 'react';

import client from '@/client';
import { useEnableDisable } from '@/hooks/toggle';

export type UploadConfig = {
  fileType: string;
  clientFunc: keyof typeof client.file;
};

// eslint-disable-next-line import/prefer-default-export
export const useUpload = <C extends UploadConfig>(config: C) => {
  const { fileType, clientFunc } = config;

  const [isLoading, loadingOn, loadingOff] = useEnableDisable();

  const onUpload = React.useCallback(
    async (endpoint: Parameters<typeof client.file[C['clientFunc']]>[0], file: Blob) => {
      const data = new FormData();

      data.append(fileType, file);

      loadingOn();

      try {
        const uploadedURL = (await client.file[clientFunc](endpoint!, data)).data;

        loadingOff();

        return uploadedURL;
      } catch (e) {
        loadingOff();

        throw e;
      }
    },
    [clientFunc, fileType]
  );

  return { onUpload, isLoading };
};
