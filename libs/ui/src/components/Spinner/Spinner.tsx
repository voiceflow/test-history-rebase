import Loader from '@ui/components/Loader';
import React from 'react';

import * as S from './styles';

export interface SpinnerProps {
  name?: string;
  isMd?: boolean;
  color?: string;
  isEmpty?: boolean;
  message?: string;
  className?: string;
  borderLess?: boolean;
  fillContainer?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  message,
  name,
  isMd,
  color,
  className,
  borderLess,
  fillContainer = false,
}) => (
  <S.Container fillContainer={fillContainer} className={className}>
    <Loader isMd={isMd} color={color} borderLess={borderLess} />
    {!!(message || name) && <S.Text>{message || `Loading ${name}...`}</S.Text>}
  </S.Container>
);

export default Spinner;
