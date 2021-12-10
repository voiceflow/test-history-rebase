import { READABLE_VARIABLE_REGEXP } from '@voiceflow/common';
import React from 'react';

import { CONTEXT_MENU_IGNORED_CLASS_NAME } from '@/components/ContextMenu';
import DropUpload from '@/components/Upload/Primitive/DropUpload';
import { HTTPS_URL_REGEX } from '@/constants';
import { AudioInjectedWithUploadProps, withUpload } from '@/hocs';

const MAX_SIZE = 10 * 1024 * 1024;

const UPLOAD_ERROR = {
  TOO_LARGE: 'File exceeds 10MB, upload as a link',
  ONE_FILE_LIMIT: 'Only single file uploads allowed',
  BACKEND: 'There was a problem uploading the file',
  INVALID_FILE_TYPE: 'Invalid file type',
};

const LINK_ERROR = {
  INVALID_URL: 'The link is invalid, make sure to use https',
};

const validate = (acceptedFiles: File[]) => {
  if (acceptedFiles.length !== 1) {
    return UPLOAD_ERROR.ONE_FILE_LIMIT;
  }

  if (acceptedFiles[0].size > MAX_SIZE) {
    return UPLOAD_ERROR.TOO_LARGE;
  }

  return null;
};

const validateURL = (value: string) => {
  if (!value.match(READABLE_VARIABLE_REGEXP) && !value.match(HTTPS_URL_REGEX)) {
    return LINK_ERROR.INVALID_URL;
  }

  return null;
};

interface DropAudioOunProps {
  withVariables?: boolean;
}

interface DropAudioProps extends DropAudioOunProps, AudioInjectedWithUploadProps {}

const DropAudio = React.forwardRef<HTMLDivElement, DropAudioProps>(
  ({ error, update, setError, isLoading, withVariables, onDropAccepted, onDropRejected }, ref) => (
    <DropUpload
      ref={ref}
      error={error}
      label="audio file"
      onUpdate={update}
      setError={setError}
      className={CONTEXT_MENU_IGNORED_CLASS_NAME}
      isLoading={isLoading}
      clearError={() => setError(null)}
      withVariables={withVariables}
      onValidateLink={validateURL}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
      linkPlaceholder={withVariables ? "Add link or Variable using '{'" : 'Add link'}
    />
  )
);

export default withUpload<HTMLDivElement, DropAudioOunProps>(DropAudio, { fileType: 'audio', clientFunc: 'uploadAudio', validate });
