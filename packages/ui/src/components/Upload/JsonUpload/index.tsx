import React from 'react';

import * as S from './styles';

const ACCEPTED_FILE_TYPES = ['.json', '.JSON', 'application/json'];

export interface JsonUploadProps {
  fileName: string;
  onUpload: (files: File[]) => void;
  onRemove?: VoidFunction;
  isLoading?: boolean;
}

const JsonUpload: React.FC<JsonUploadProps> = ({ fileName, onUpload, isLoading, onRemove }) => {
  const [error, setError] = React.useState<null | string>(null);

  return (
    <S.Drop
      error={error}
      label="JSON"
      success={!!fileName}
      canUseLink={false}
      isLoading={isLoading}
      clearError={() => setError(null)}
      successLabel={fileName}
      onDropRejected={() => setError('Invalid file type')}
      onSuccessClose={onRemove}
      onDropAccepted={onUpload}
      acceptedFileTypes={ACCEPTED_FILE_TYPES}
    />
  );
};

export default JsonUpload;
