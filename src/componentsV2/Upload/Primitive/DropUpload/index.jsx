import React from 'react';
import { useDropzone } from 'react-dropzone10';

import LinkUpload from '../LinkUpload';
import Container from './components/Container';
import Error from './components/Error';
import ErrorMessage from './components/Error/components/ErrorMessage';
import Loading from './components/Loading';
import Neutral from './components/Neutral';
import Success from './components/Success';
import { UploadMode } from './constants';

function DropUpload({
  label,
  onDropAccepted,
  onUpdate,
  onValidateLink,
  canUseLink = true,
  linkPlaceholder = 'File link',
  clearError,
  onDropRejected,
  isLoading,
  error,
  success,
  successLabel,
  onSuccessClose,
  acceptedFileTypes = [], // MIME FORMAT
  className,
  withVariables,
}) {
  const [uploadMode, setUploadMode] = React.useState(UploadMode.DROP);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: acceptedFileTypes.toString(),
    onDropAccepted,
    onDropRejected,
    disabled: error || success || isLoading || uploadMode === UploadMode.LINK,
  });

  let content = null;
  if (error) {
    content = <Error error={error} onClearError={clearError} />;
  } else if (isDragReject) {
    content = <ErrorMessage>Invalid file type</ErrorMessage>;
  } else if (isLoading) {
    content = <Loading />;
  } else if (success) {
    content = <Success onClose={onSuccessClose} successLabel={successLabel} />;
  } else if (uploadMode === UploadMode.LINK && canUseLink) {
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
    content = <Neutral onCornerAction={() => setUploadMode(UploadMode.LINK)} cornerIcon={canUseLink ? 'link' : null} label={label} />;
  }

  return (
    <Container isDragReject={isDragReject} error={error} active={isDragActive} {...getRootProps()} className={className} mode={uploadMode}>
      <input {...getInputProps()} />
      {content}
    </Container>
  );
}

export default DropUpload;
