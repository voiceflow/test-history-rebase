import { READABLE_VARIABLE_REGEXP } from '@voiceflow/common';
import React from 'react';

import { CONTEXT_MENU_IGNORED_CLASS_NAME } from '@/components/ContextMenu';
import DropUpload from '@/components/Upload/Primitive/DropUpload';
import { HTTPS_URL_REGEX } from '@/constants';
import { withUpload } from '@/hocs';

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

const validate = (acceptedFiles) => {
  if (acceptedFiles.length !== 1) {
    return UPLOAD_ERROR.ONE_FILE_LIMIT;
  }
  if (acceptedFiles[0].size > MAX_SIZE) {
    return UPLOAD_ERROR.TOO_LARGE;
  }
  return false;
};

const validateURL = (value) => {
  if (!value.match(READABLE_VARIABLE_REGEXP) && !value.match(HTTPS_URL_REGEX)) {
    return LINK_ERROR.INVALID_URL;
  }

  return null;
};

const DropAudio = ({ isLoading, onDropAccepted, onDropRejected, error, setError, update, withVariables }) => (
  <DropUpload
    withVariables={withVariables}
    linkPlaceholder={withVariables ? "Add link or Variable using '{'" : 'Add link'}
    onDropAccepted={onDropAccepted}
    clearError={() => setError(null)}
    onDropRejected={onDropRejected}
    isLoading={isLoading}
    className={CONTEXT_MENU_IGNORED_CLASS_NAME}
    error={error}
    label="audio file"
    onUpdate={update}
    onValidateLink={validateURL}
  />
);

export default withUpload(DropAudio, { fileType: 'audio', clientFunc: 'uploadAudio', validate });
