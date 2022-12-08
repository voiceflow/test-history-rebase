import SvgIcon from '@ui/components/SvgIcon';
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
      leftAction={<SvgIcon icon="minus" clickable variant={SvgIcon.Variant.STANDARD} onClick={onMinusClick} />}
      rightAction={<SvgIcon icon="plus" clickable variant={SvgIcon.Variant.STANDARD} onClick={onPlusClick} />}
      wrapperProps={{ counter: true }}
      {...props}
    />
  );
});

export default CounterInput;
