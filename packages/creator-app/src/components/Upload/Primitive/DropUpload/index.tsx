import { Nullable } from '@voiceflow/common';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { BaseInjectedWithUploadProps } from '@/hocs';

import LinkUpload from '../LinkUpload';
import Container from './components/Container';
import Error from './components/Error';
import ErrorMessage from './components/Error/components/ErrorMessage';
import Loading from './components/Loading';
import Neutral from './components/Neutral';
import Success from './components/Success';
import { UploadMode } from './constants';

interface DropUploadProps extends Partial<BaseInjectedWithUploadProps> {
  label?: string;
  height?: number;
  isImage?: boolean;
  success?: boolean;
  onUpdate?: (url: string | null) => void;
  className?: string;
  canUseLink?: boolean;
  clearError?: VoidFunction;
  successLabel?: string;
  withVariables?: boolean;
  onSuccessClose?: VoidFunction;
  onValidateLink?: (text: string) => Nullable<string>;
  linkPlaceholder?: string;
  acceptedFileTypes?: string[];
}

const DropUpload: React.ForwardRefRenderFunction<HTMLDivElement, DropUploadProps> = (
  {
    label,
    error,
    height,
    success,
    isImage,
    onUpdate,
    isLoading,
    className,
    canUseLink = true,
    clearError,
    successLabel,
    withVariables,
    onDropAccepted,
    onValidateLink,
    onDropRejected,
    onSuccessClose,
    linkPlaceholder = 'File link',
    acceptedFileTypes = [], // MIME FORMAT
  },
  ref
) => {
  const [uploadMode, setUploadMode] = React.useState<UploadMode>(UploadMode.DROP);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: acceptedFileTypes.toString(),
    disabled: !!error || !!success || !!isLoading || uploadMode === UploadMode.LINK,
    onDropAccepted,
    onDropRejected,
  });

  let content = null;
  if (error && clearError) {
    content = <Error error={error} onClearError={clearError} />;
  } else if (isDragReject) {
    content = <ErrorMessage>Invalid file type</ErrorMessage>;
  } else if (isLoading) {
    content = <Loading />;
  } else if (success && onSuccessClose) {
    content = <Success onClose={onSuccessClose} successLabel={successLabel} />;
  } else if (uploadMode === UploadMode.LINK && canUseLink && onUpdate) {
    content = (
      <LinkUpload
        onBack={() => setUploadMode(UploadMode.DROP)}
        validate={onValidateLink}
        onUpdate={onUpdate}
        placeholder={linkPlaceholder}
        withVariables={withVariables}
      />
    );
  } else {
    content = <Neutral onCornerAction={() => setUploadMode(UploadMode.LINK)} cornerIcon={canUseLink ? 'link' : undefined} label={label} />;
  }

  return (
    <Container
      ref={ref}
      error={error}
      height={height}
      isImage={isImage}
      active={isDragActive}
      isDragReject={isDragReject}
      {...(getRootProps() as any)}
      mode={uploadMode}
      className={className}
    >
      <input {...getInputProps()} />
      {content}
    </Container>
  );
};

export default React.forwardRef<HTMLDivElement, DropUploadProps>(DropUpload);
