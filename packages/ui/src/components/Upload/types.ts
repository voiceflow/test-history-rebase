export interface BaseInjectedWithUploadProps {
  error: null | string;
  setError: (error: null | string) => void;
  isLoading: boolean;
  onDropRejected: () => void;
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
