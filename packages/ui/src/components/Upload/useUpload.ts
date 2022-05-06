import { useEnableDisable } from '@ui/hooks';
import React from 'react';

import { Context, UploadFileType } from './Context';
import { AnyWithUploadProps, WithMultiUploadProps, WithSingleUploadProps } from './types';

export interface UploadConfig {
  fileType: UploadFileType;
  validate?: (files: File[]) => string | null;
  errorMessage?: string;
  endpoint: string;
}

const isMultiUploadProps = (config: AnyWithUploadProps): config is WithMultiUploadProps => Array.isArray(config.endpoint);
const isSingleUploadProps = (config: AnyWithUploadProps): config is WithSingleUploadProps => !Array.isArray(config.endpoint);

export type SingleUploadConfig = UploadConfig & WithSingleUploadProps;
export type MultiUploadConfig = UploadConfig & WithMultiUploadProps;
export type AnyUploadConfig = SingleUploadConfig & MultiUploadConfig;

export interface UploadAPI {
  isLoading: boolean;
  error: null | string;
  onDropRejected: () => void;
  onDropAccepted: (acceptedFiles: File[]) => Promise<void>;
  onUpload: (endpoint: string, file: File) => Promise<string>;
  setError: (error: null | string) => void;
  loadingOn: () => void;
  loadingOff: () => void;
}

export function useUpload<C extends SingleUploadConfig>(config: C): UploadAPI;
export function useUpload<C extends MultiUploadConfig>(config: C): UploadAPI;
export function useUpload<C extends AnyUploadConfig>(config: C): UploadAPI {
  const { fileType, validate = () => null, errorMessage, update, endpoint } = config;
  const uploadApi = React.useContext(Context)!;

  const [isLoading, loadingOn, loadingOff] = useEnableDisable();
  const [error, setError] = React.useState<null | string>(null);

  const onUpload = React.useCallback(
    async (endpoint: string, file: File) => {
      const data = new FormData();

      data.append(fileType, file);

      return uploadApi.upload(endpoint, fileType, data);
    },
    [fileType]
  );

  const onDropAccepted = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (!uploadApi) {
        return;
      }

      const err = validate(acceptedFiles);

      setError(err);

      if (err) {
        return;
      }

      try {
        loadingOn();
        if (isMultiUploadProps(config)) {
          const urls = await Promise.all(config.endpoint.map((item) => onUpload(item, acceptedFiles[0])));

          config.update?.(urls);
        }

        if (isSingleUploadProps(config)) {
          const url = await onUpload(endpoint, acceptedFiles[0]);
          config.update?.(url);
        }
      } catch (error) {
        config.update?.(null);
        uploadApi.onError(error);
        setError(errorMessage || 'There was an error');
      } finally {
        loadingOff();
      }
    },
    [validate, onUpload, errorMessage, update, endpoint]
  );

  const onDropRejected = React.useCallback(() => {
    setError('Invalid file type');
  }, []);

  return { isLoading, loadingOn, loadingOff, error, setError, onDropRejected, onDropAccepted, onUpload };
}
