import React from 'react';

import { ReturnButton, StatusIcon } from '..';
import ErrorMessage from './components/ErrorMessage';

function Error({ error, onClearError }) {
  return (
    <>
      <StatusIcon icon="error" />
      <ErrorMessage>
        {error} - <ReturnButton onClick={onClearError}>Return</ReturnButton>
      </ErrorMessage>
    </>
  );
}

export default Error;
