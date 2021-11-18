/* eslint-disable import/prefer-default-export */
import _constant from 'lodash/constant';
import React from 'react';

import { UploadConfig, useUpload } from '@/hooks/upload';
import * as Sentry from '@/vendors/sentry';

type Config = UploadConfig & {
  validate?: (files: Blob[]) => string | null;
  errorMessage?: string;
};

export type RequiredWithUploadProps<F> = {
  update: (url: string | string[] | null) => void;
} & (F extends 'uploadImage' ? { endpoint?: null | string | string[] } : F extends 'uploadAudio' ? { endpoint: string } : never);

export interface InjectedWithUploadProps {
  error: null | string;
  setError: (error: null | string) => void;
  isLoading: boolean;
  onDropRejected: () => void;
  onDropAccepted: ((files: Blob[]) => void) | ((files: File[]) => void);
  endpoint?: null | string | string[];
}

export const withUpload = <C extends Config, P extends RequiredWithUploadProps<C['clientFunc']>, R extends any = any>(
  WrappedComponent: React.ComponentType<InjectedWithUploadProps>,
  config: Config
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<R>> =>
  React.forwardRef<R, P>(({ endpoint, update, ...props }: P, ref) => {
    const { fileType, errorMessage, clientFunc, validate = _constant(null) } = config;

    const [error, setError] = React.useState<null | string>(null);
    const { onUpload, isLoading } = useUpload({ fileType, clientFunc });

    const onDropAccepted = React.useCallback(
      async (acceptedFiles: Blob[]) => {
        const err = validate(acceptedFiles);

        setError(err);

        if (err) {
          return;
        }

        try {
          if (Array.isArray(endpoint)) {
            const urls = await Promise.all(endpoint.map((item) => onUpload(item, acceptedFiles[0])));
            update(urls);
          } else {
            const url = await onUpload(endpoint, acceptedFiles[0]);
            update(url);
          }
        } catch (error) {
          update(null);
          Sentry.error(error);
          setError(errorMessage || 'There was an error');
        }
      },
      [endpoint, validate, update, onUpload, errorMessage]
    );

    const onDropRejected = React.useCallback(() => {
      setError('Invalid file type');
    }, []);

    return (
      <WrappedComponent
        ref={ref}
        error={error}
        update={update}
        setError={setError}
        isLoading={isLoading}
        onDropRejected={onDropRejected}
        onDropAccepted={onDropAccepted}
        {...props}
      />
    );
  });
