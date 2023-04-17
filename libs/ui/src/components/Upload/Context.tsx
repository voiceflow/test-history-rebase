import { useContextApi } from '@ui/hooks';
import React from 'react';

export type UploadFileType = 'audio' | 'image' | 'video' | 'JSON' | 'TLS';

export interface UploadValue {
  upload: (endpoint: string, fileType: UploadFileType, file: FormData) => Promise<string>;
  onError: (error: Error) => void;
}

export interface UploadClient {
  upload: (endpoint: string, fileType: UploadFileType, file: FormData) => Promise<string>;
}

export interface UploadProviderProps extends React.PropsWithChildren {
  client: UploadClient;
  onError: (error: Error) => void;
}

const UploadContext = React.createContext<UploadValue>({
  upload: () => Promise.resolve(''),
  onError: () => null,
});

export const { Consumer: ExportConsumer } = UploadContext;

const UploadProvider: React.FC<UploadProviderProps> = ({ children, client, onError }) => {
  const upload = React.useCallback((endpoint: string, fileType: UploadFileType, file: FormData) => {
    return client.upload(endpoint, fileType, file);
  }, []);

  const api = useContextApi({
    upload,
    onError,
  });

  return <UploadContext.Provider value={api}>{children}</UploadContext.Provider>;
};

export { UploadContext as Context, UploadProvider as Provider };
