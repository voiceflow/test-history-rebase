import React from 'react';

import { ReturnButton, StatusIcon } from '../styles';
import * as S from './styles';

interface ErrorContainerProps {
  error: string;
  onClearError: VoidFunction;
}

const ErrorContainer: React.FC<ErrorContainerProps> = ({ error, onClearError }) => (
  <>
    <StatusIcon icon="error" />
    <S.ErrorMessage>
      {error} - <ReturnButton onClick={onClearError}>Return</ReturnButton>
    </S.ErrorMessage>
  </>
);

export default ErrorContainer;
