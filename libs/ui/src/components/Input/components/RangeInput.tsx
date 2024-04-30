import React from 'react';

import { useLinkedState } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import DefaultInput from './DefaultInput';

type RangeInputProps = Omit<React.ComponentProps<typeof DefaultInput>, 'onChange' | 'onBlur' | 'value'> & {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
};

const RangeInput: React.FC<RangeInputProps> = ({ min, max, value, onChange, ...props }) => {
  const [length, setLength] = useLinkedState<string>(String(value));

  const onSave = () => {
    let nextValue = Number(length) ?? min;

    nextValue = Math.max(min, nextValue);
    nextValue = Math.min(max, nextValue);

    onChange(nextValue);
  };

  const onUpdate = (input: string) => {
    const newLength = input.replace(/\D/g, '').substring(0, 4);
    setLength(newLength);
  };

  return (
    <DefaultInput
      {...props}
      type="text"
      value={length}
      onChange={withTargetValue(onUpdate)}
      onBlur={withTargetValue(onSave)}
    />
  );
};

export default RangeInput;
