import { Nullable } from '@voiceflow/common';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { useFileTypesToMimeType } from '../../hooks';
import { BaseInjectedWithUploadProps } from '../../types';
import LinkUpload, { InputRenderer } from '../LinkUpload';
import { UploadMode } from './constants';
import Error from './Error';
import { ErrorMessage } from './Error/styles';
import Loading from './Loading';
import Neutral from './Neutral';
import * as S from './styles';
import Success from './Success';

export interface DropUploadProps extends Partial<BaseInjectedWithUploadProps> {
  label?: string;
  height?: number;
  isImage?: boolean;
  success?: boolean;
  onUpdate?: (url: string | null) => void;
  className?: string;
  canUseLink?: boolean;
  clearError?: VoidFunction;
  successLabel?: string;
  renderInput?: InputRenderer;
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
    renderInput,
    onDropAccepted,
    onValidateLink,
    onDropRejected,
    onSuccessClose,
    linkPlaceholder = 'File link',
    acceptedFileTypes = [],
  },
  ref
) => {
  const [uploadMode, setUploadMode] = React.useState<UploadMode>(UploadMode.DROP);

  const accept = useFileTypesToMimeType(acceptedFileTypes);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
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
        renderInput={renderInput}
      />
    );
  } else {
    content = <Neutral onCornerAction={() => setUploadMode(UploadMode.LINK)} cornerIcon={canUseLink ? 'link' : undefined} label={label} />;
  }

  return (
    <S.Container
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
    </S.Container>
  );
};

export default React.forwardRef<HTMLDivElement, DropUploadProps>(DropUpload);
