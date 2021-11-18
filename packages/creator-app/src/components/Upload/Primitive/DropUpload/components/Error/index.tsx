import React from 'react';

import { ReturnButton, StatusIcon } from '..';
import ErrorMessage from './components/ErrorMessage';

interface ErrorProps {
  error: string;
  onClearError: VoidFunction;
}

const Error: React.FC<ErrorProps> = ({ error, onClearError }) => (
  <>
    <StatusIcon icon="error" />
    <ErrorMessage>
      {error} - <ReturnButton onClick={onClearError}>Return</ReturnButton>
    </ErrorMessage>
  </>
);

export default Error;
