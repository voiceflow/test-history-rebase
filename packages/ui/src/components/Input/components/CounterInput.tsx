import * as System from '@ui/system';
import React from 'react';

import DefaultInput, { DefaultInputProps } from './DefaultInput';

export interface CounterInputProps extends Omit<DefaultInputProps, 'onChange' | 'readOnly'> {
  onPlusClick?: () => void;
  onMinusClick?: () => void;
}

const CounterInput = React.forwardRef<HTMLInputElement, CounterInputProps>(({ min, max, value, onPlusClick, onMinusClick, ...props }, ref) => (
  <DefaultInput
    ref={ref}
    min={min}
    max={max}
    value={value}
    inline
    readOnly
    leftAction={
      <System.IconButton.Base
        icon="minus"
        onClick={onMinusClick}
        disabled={!!min && Number(value) === Number(min)}
        hoverBackground={false}
        activeBackground={false}
      />
    }
    rightAction={
      <System.IconButton.Base
        icon="plus"
        onClick={onPlusClick}
        disabled={!!max && Number(value) === Number(max)}
        hoverBackground={false}
        activeBackground={false}
      />
    }
    wrapperProps={{ counter: true }}
    {...props}
  />
));

export default CounterInput;
