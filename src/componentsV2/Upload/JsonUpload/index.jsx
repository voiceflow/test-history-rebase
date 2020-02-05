import _ from 'lodash';
import React from 'react';

import DropUpload from '@/componentsV2/Upload/Primitive/DropUpload';
import { styled, withUpload } from '@/hocs';

const Drop = styled(DropUpload)`
  margin-bottom: 10px;
`;

const ACCEPTED_FILE_TYPES = '.json,.JSON,application/json';

function JsonUpload({ file, customOnDropAccept, isLoading, onDropRejected, error, setError, onRemove }) {
  return (
    <Drop
      acceptedFileTypes={ACCEPTED_FILE_TYPES}
      onDropAccepted={customOnDropAccept}
      clearError={() => setError(null)}
      onDropRejected={onDropRejected}
      isLoading={isLoading}
      onSuccessClose={onRemove}
      error={error}
      success={!!file}
      successLabel={file}
      label="JSON"
      canUseLink={false}
    />
  );
}

export default withUpload(JsonUpload, { fileType: 'json', clientFunc: 'uploadJson', validate: _.noop });
