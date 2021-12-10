import React from 'react';

import DropUpload from '@/components/Upload/Primitive/DropUpload';
import { styled } from '@/hocs';

const Drop = styled(DropUpload)`
  margin-bottom: 10px;
`;

const ACCEPTED_FILE_TYPES = ['.json', '.JSON', 'application/json'];

interface JsonUploadProps {
  fileName: string;
  onUpload: (files: File[]) => void;
  onRemove?: VoidFunction;
  isLoading?: boolean;
}

const JsonUpload: React.FC<JsonUploadProps> = ({ fileName, onUpload, isLoading, onRemove }) => {
  const [error, setError] = React.useState<null | string>(null);

  return (
    <Drop
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
