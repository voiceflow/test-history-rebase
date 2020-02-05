/* eslint-disable react/display-name, import/prefer-default-export */
import { noop } from 'lodash';
import React, { useCallback } from 'react';

import client from '@/client';
import { useEnableDisable } from '@/hooks/toggle';

export const withUpload = (WrappedComponent, config) => ({ endpoint, update, ...props }) => {
  const { fileType, errorMessage, clientFunc, validate: hasError = noop() } = config;

  const [isLoading, loadingOn, loadingOff] = useEnableDisable();
  const [error, setError] = React.useState(null);

  const onDropAccepted = useCallback(
    async (acceptedFiles) => {
      setError(hasError(acceptedFiles));
      if (error) return;

      const data = new FormData();
      data.append(fileType, acceptedFiles[0]);

      loadingOn();

      try {
        const uploadedURL = (await client.file[clientFunc](endpoint, data)).data;

        update(uploadedURL);
      } catch (e) {
        update(null);
        setError(errorMessage || 'There was an error');
      } finally {
        loadingOff();
      }
    },
    [clientFunc, endpoint, error, errorMessage, fileType, hasError, loadingOff, loadingOn, update]
  );

  const onDropRejected = useCallback(() => {
    setError('Invalid file type');
  }, []);

  return (
    <WrappedComponent
      isLoading={isLoading}
      setError={setError}
      error={error}
      update={update}
      onDropRejected={onDropRejected}
      onDropAccepted={onDropAccepted}
      {...props}
    />
  );
};
