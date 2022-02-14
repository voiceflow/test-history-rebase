import { stopPropagation } from '@ui/utils/dom';
import React from 'react';
import ReactToggle from 'react-toggle';

import ToggleContainer from './ToggleContainer';

export enum ToggleSize {
  SMALL = 'small',
  NORMAL = 'normal',
  EXTRA_SMALL = 'extra-small',
}

interface ToggleProps {
  size?: ToggleSize;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
}

const Toggle = React.forwardRef<HTMLDivElement | ReactToggle, ToggleProps>(({ size = ToggleSize.NORMAL, ...props }, ref) => (
  <ToggleContainer size={size}>
    <ReactToggle {...props} ref={ref as React.LegacyRef<ReactToggle>} onClick={stopPropagation()} icons={false} />
  </ToggleContainer>
));

export default Toggle;
