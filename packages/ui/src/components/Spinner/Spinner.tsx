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
  name?: string;
  isMd?: boolean;
  color?: string;
  isEmpty?: boolean;
  message?: string;
  className?: string;
  borderLess?: boolean;
  fillContainer?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ message, name, isMd, color, className, borderLess, fillContainer = false }) => (
  <div
    className={cn('text-center', className)}
    style={fillContainer ? { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}
  >
    <Loader isMd={isMd} color={color} borderLess={borderLess} />
    {!!(message || name) && <Text>{message || `Loading ${name}...`}</Text>}
  </div>
);

export default Spinner;
