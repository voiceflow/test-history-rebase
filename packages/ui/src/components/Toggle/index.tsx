import { stopPropagation } from '@ui/utils/dom';
import { Utils } from '@voiceflow/common';
import React from 'react';
import ReactToggle from 'react-toggle';

import { Size } from './constants';
import ToggleContainer from './ToggleContainer';

interface ToggleProps {
  size?: Size;
  name?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

const Toggle = React.forwardRef<HTMLDivElement | ReactToggle, ToggleProps>(
  ({ size = Size.NORMAL, onChange = Utils.functional.noop, ...props }, ref) => (
    <ToggleContainer size={size}>
      <ReactToggle {...props} onChange={onChange} ref={ref as React.LegacyRef<ReactToggle>} onClick={stopPropagation()} icons={false} />
    </ToggleContainer>
  )
);

export default Object.assign(Toggle, { Size });
