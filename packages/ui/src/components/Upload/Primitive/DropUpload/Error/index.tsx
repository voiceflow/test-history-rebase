import React from 'react';

import { ReturnButton, StatusIcon } from '../styles';
import * as S from './styles';

interface ErrorProps {
  error: string;
  onClearError: VoidFunction;
}

const Error: React.FC<ErrorProps> = ({ error, onClearError }) => (
  <>
    <StatusIcon icon="error" />
    <S.ErrorMessage>
      {error} - <ReturnButton onClick={onClearError}>Return</ReturnButton>
    </S.ErrorMessage>
  </>
);

export default Error;
