import React from 'react';

import Loader from '@/components/Loader';

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
