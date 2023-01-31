import * as System from '@ui/system';
import React from 'react';

import DefaultInput, { DefaultInputProps } from './DefaultInput';

export interface CounterInputProps extends Omit<DefaultInputProps, 'onChange' | 'readOnly'> {
  onPlusClick?: () => void;
  onMinusClick?: () => void;
}

const CounterInput = React.forwardRef<HTMLInputElement, CounterInputProps>(({ onPlusClick, onMinusClick, ...props }, ref) => (
  <DefaultInput
    ref={ref}
    inline
    readOnly
    leftAction={<System.IconButton.Base icon="minus" onClick={onMinusClick} hoverBackground={false} activeBackground={false} />}
    rightAction={<System.IconButton.Base icon="plus" onClick={onPlusClick} hoverBackground={false} activeBackground={false} />}
    wrapperProps={{ counter: true }}
    {...props}
  />
));

export default CounterInput;
