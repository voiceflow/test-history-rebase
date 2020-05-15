import React from 'react';

import Checkbox, { CheckboxProps, CheckboxType } from '@/components/Checkbox';

import RadioButtonContainer from './components/RadioButtonContainer';
import Container from './components/RadioGroupContainer';

export type RadioOption<T extends any> = {
  id: T;
  label: React.ReactNode;
  customCheckedCondition?: (checked: T) => boolean;
};

export const YES_NO_RADIO_BUTTONS: RadioOption<boolean>[] = [
  { id: true, label: 'Yes' },
  { id: false, label: 'No' },
];

export type RadioGroupProps<T extends any> = Omit<CheckboxProps, 'type' | 'value' | 'checked' | 'onChange'> & {
  options?: RadioOption<T>[];
  checked: T;
  onChange: (value: T) => void;
};

const RadioGroup = <T extends any>({
  options = YES_NO_RADIO_BUTTONS as RadioOption<any>[],
  checked,
  onChange,
  className,
  ...props
}: RadioGroupProps<T>) => {
  return (
    <Container className={className}>
      {options.map((option, index) => {
        const { id, label, customCheckedCondition } = option;

        const isChecked = customCheckedCondition ? customCheckedCondition(checked) : checked === id;

        return (
          <RadioButtonContainer key={index}>
            <Checkbox {...props} type={CheckboxType.RADIO} value={id} checked={isChecked} onChange={() => onChange(id)}>
              <div>{label}</div>
            </Checkbox>
          </RadioButtonContainer>
        );
      })}
    </Container>
  );
};

export default RadioGroup;
