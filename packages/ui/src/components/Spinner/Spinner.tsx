import Loader from '@ui/components/Loader';
import { colors, styled, ThemeColor } from '@ui/styles';
import cn from 'classnames';
import React from 'react';

const Text = styled.div`
  color: ${colors(ThemeColor.PRIMARY)};
  font-weight: 400;
  font-size: 18px;
`;

export interface SpinnerProps {
  message?: string;
  name?: string;
  isMd?: boolean;
  isEmpty?: boolean;
  color?: string;
  className?: string;
  borderLess?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ message, name, isMd, color, className, borderLess }) => (
  <div className={cn('text-center', className)}>
    <Loader isMd={isMd} color={color} borderLess={borderLess} />
    {!!(message || name) && <Text>{message || `Loading ${name}...`}</Text>}
  </div>
);

export default Spinner;
