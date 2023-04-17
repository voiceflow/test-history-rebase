import * as System from '@ui/system';
import { stopPropagation } from '@ui/utils';
import React from 'react';

import DefaultInput, { DefaultInputProps } from './DefaultInput';

export interface CounterInputProps extends Omit<DefaultInputProps, 'onChange' | 'readOnly'> {
  onPlusClick?: () => void;
  onMinusClick?: () => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const CounterInput = React.forwardRef<HTMLInputElement, CounterInputProps>(
  ({ min, max, value, onChange, onPlusClick, onMinusClick, ...props }, ref) => (
    <DefaultInput
      ref={ref}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      readOnly={!onChange}
      inline
      leftAction={
        <System.IconButton.Base
          icon="minus"
          onClick={stopPropagation(onMinusClick)}
          disabled={!!min && Number(value) === Number(min)}
          hoverBackground={false}
          activeBackground={false}
        />
      }
      rightAction={
        <System.IconButton.Base
          icon="plus"
          onClick={stopPropagation(onPlusClick)}
          disabled={!!max && Number(value) === Number(max)}
          hoverBackground={false}
          activeBackground={false}
        />
      }
      wrapperProps={{ counter: true }}
      {...props}
    />
  )
);

export default CounterInput;
