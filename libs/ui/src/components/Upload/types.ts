import React from 'react';
import { SpaceProps } from 'styled-system';

export interface BaseInjectedWithUploadProps {
  error: null | string;
  setError: (error: null | string) => void;
  isLoading: boolean;
  onDropRejected: VoidFunction;
  onDropAccepted: (files: File[]) => void;
}

export interface ImageInjectedWithUploadProps extends BaseInjectedWithUploadProps {
  update?: (url: string | null) => void;
  endpoint?: string;
}

export interface WithSingleUploadProps {
  update?: (url: string | null) => void;
  endpoint: string;
}

export interface WithMultiUploadProps {
  update?: (url: string[] | null) => void;
  endpoint: string[];
}

export type AnyWithUploadProps = WithSingleUploadProps | WithMultiUploadProps;

export interface ValueRendererProps {
  value: string;
  openFileSelection?: React.MouseEventHandler<HTMLElement>;
}

export interface RootDropAreaProps extends SpaceProps {}
