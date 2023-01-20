import IconButton from '@ui/components/IconButton';
import React from 'react';

import DefaultInput, { DefaultInputProps } from './DefaultInput';

export interface CounterInputProps extends Omit<DefaultInputProps, 'onChange' | 'readOnly'> {
  onPlusClick?: () => void;
  onMinusClick?: () => void;
}

const CounterInput = React.forwardRef<HTMLInputElement, CounterInputProps>(({ onPlusClick, onMinusClick, ...props }, ref) => {
  return (
    <DefaultInput
      ref={ref}
      readOnly
      leftAction={<IconButton icon="minus" onClick={onMinusClick} variant={IconButton.Variant.BASIC} transparent style={{ margin: '0' }} />}
      rightAction={<IconButton icon="plus" onClick={onPlusClick} variant={IconButton.Variant.BASIC} transparent style={{ margin: '0' }} />}
      wrapperProps={{ counter: true }}
      inline
      {...props}
    />
  );
});

export default CounterInput;
