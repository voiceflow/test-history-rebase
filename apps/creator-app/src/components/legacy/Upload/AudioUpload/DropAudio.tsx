import React from 'react';

import DropUpload from '../Primitive/DropUpload';
import { InputRenderer } from '../Primitive/LinkUpload';
import { SingleUploadConfig, useUpload } from '../useUpload';
import { validateFiles, validateURL } from '../utils';

export interface DropAudioOwnProps {
  className?: string;
  renderInput?: InputRenderer;
}

export interface DropAudioProps extends DropAudioOwnProps, Pick<SingleUploadConfig, 'update' | 'errorMessage'> {}

const DropAudio = React.forwardRef<HTMLDivElement, DropAudioProps>(({ update, renderInput, errorMessage, className }, ref) => {
  const { error, setError, isLoading, onDropAccepted, onDropRejected } = useUpload({
    fileType: 'audio',
    endpoint: 'audio',
    update,
    validate: validateFiles,
    errorMessage,
  });

  return (
    <DropUpload
      ref={ref}
      error={error}
      label="audio file"
      onUpdate={update}
      setError={setError}
      className={className}
      isLoading={isLoading}
      clearError={() => setError(null)}
      renderInput={renderInput}
      onValidateLink={validateURL}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
      linkPlaceholder={renderInput ? "Add link or variable using '{'" : 'Add link'}
    />
  );
});

export default DropAudio;
