import React from 'react';

import { ReturnButton, StatusIcon } from '..';
import ErrorMessage from './components/ErrorMessage';

const Error = ({ error, onClearError }) => (
  <>
    <StatusIcon icon="error" />
    <ErrorMessage>
      {error} - <ReturnButton onClick={onClearError}>Return</ReturnButton>
    </ErrorMessage>
  </>
);

export default Error;
