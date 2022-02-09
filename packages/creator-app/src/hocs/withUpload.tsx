import _constant from 'lodash/constant';
import React from 'react';

import { UploadConfig, useUpload } from '@/hooks/upload';
import * as Sentry from '@/vendors/sentry';

interface Config extends UploadConfig {
  validate?: (files: File[]) => string | null;
  errorMessage?: string;
}

interface AudioConfig extends Config {
  clientFunc: 'uploadAudio';
}

interface ImageConfig extends Config {
  clientFunc: 'uploadImage';
}

interface AudioWithUploadProps {
  update: (url: string | null) => void;
  endpoint: string;
}

interface ImageWithUploadProps {
  update: (url: string | null) => void;
  endpoint?: string;
}

interface ImagesWithUploadProps {
  update: (url: string[] | null) => void;
  endpoint: string[];
}

export interface BaseInjectedWithUploadProps {
  error: null | string;
  setError: (error: null | string) => void;
  isLoading: boolean;
  onDropRejected: () => void;
  onDropAccepted: (files: File[]) => void;
}

export interface AudioInjectedWithUploadProps extends BaseInjectedWithUploadProps, AudioWithUploadProps {}

export interface ImageInjectedWithUploadProps extends BaseInjectedWithUploadProps {
  update: (url: string | null) => void;
  endpoint?: string;
}

export interface ImagesInjectedWithUploadProps extends BaseInjectedWithUploadProps {
  update: (url: string[] | null) => void;
  endpoint: string[];
}

export type AnyWithUploadProps = AudioWithUploadProps | ImageWithUploadProps | ImagesWithUploadProps;

export type AnyInjectedWithUploadProps = AudioInjectedWithUploadProps | ImageInjectedWithUploadProps;

const isImagesProps = (props: AnyWithUploadProps): props is ImagesWithUploadProps => Array.isArray(props.endpoint);

export function withUpload<R, P>(
  WrappedComponent: React.ForwardRefExoticComponent<P & AudioInjectedWithUploadProps & React.RefAttributes<R>>,
  config: AudioConfig
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & AudioWithUploadProps> & React.RefAttributes<R>>;
export function withUpload<R, P>(
  WrappedComponent: React.ForwardRefExoticComponent<P & ImageInjectedWithUploadProps & React.RefAttributes<R>>,
  config: ImageConfig
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & ImageWithUploadProps> & React.RefAttributes<R>>;
export function withUpload<R, P>(
  WrappedComponent: React.ForwardRefExoticComponent<P & ImagesInjectedWithUploadProps & React.RefAttributes<R>>,
  config: ImageConfig
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & ImagesWithUploadProps> & React.RefAttributes<R>>;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function withUpload<R, P>(
  WrappedComponent: React.ForwardRefExoticComponent<P & React.RefAttributes<R> & (AudioInjectedWithUploadProps | ImageInjectedWithUploadProps)>,
  config: Config
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & AnyWithUploadProps> & React.RefAttributes<R>> {
  return React.forwardRef<R, P & AnyWithUploadProps>((props, ref) => {
    const { fileType, errorMessage, clientFunc, validate = _constant(null) } = config;

    const [error, setError] = React.useState<null | string>(null);
    const { onUpload, isLoading } = useUpload({ fileType, clientFunc });

    const onDropAccepted = React.useCallback(
      async (acceptedFiles: File[]) => {
        const err = validate(acceptedFiles);

        setError(err);

        if (err) {
          return;
        }

        try {
          if (isImagesProps(props)) {
            const urls = await Promise.all(props.endpoint.map((item) => onUpload(item, acceptedFiles[0])));

            props.update(urls);
          } else {
            const url = await onUpload(props.endpoint, acceptedFiles[0]);

            props.update(url);
          }
        } catch (error) {
          props.update(null);
          Sentry.error(error);
          setError(errorMessage || 'There was an error');
        }
      },
      [validate, onUpload, errorMessage, props.update, props.endpoint]
    );

    const onDropRejected = React.useCallback(() => {
      setError('Invalid file type');
    }, []);

    return (
      <WrappedComponent
        ref={ref}
        error={error}
        setError={setError}
        isLoading={isLoading}
        onDropRejected={onDropRejected}
        onDropAccepted={onDropAccepted}
        {...(props as any)}
      />
    );
  });
}
