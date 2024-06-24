import { Utils } from '@voiceflow/common';
import React from 'react';

import Checkbox from '@/components/legacy/Checkbox';

import { RadioGroupProps, RadioOption } from './RadioGroup';
import Container from './RadioGroupContainer';
import RadioItem from './RadioItem';

export interface CheckboxOption<T> extends Omit<RadioOption<T>, 'customCheckedCondition'> {
  customCheckedCondition?: (checked: T[]) => boolean;
}

export interface CheckboxGroupProps<T> extends Omit<RadioGroupProps<T>, 'type' | 'checked' | 'options' | 'onChange'> {
  checked: T[];
  options: CheckboxOption<T>[];
  onChange: (value: T[]) => void;
}

const CheckboxGroup = <T extends any>({
  options,
  checked,
  onChange,
  className,
  column,
  ...props
}: CheckboxGroupProps<T>): React.ReactElement => (
  <Container className={className} column={column}>
    {options.map((option) => {
      const { id, label, customCheckedCondition } = option;

      const isChecked = customCheckedCondition ? customCheckedCondition(checked) : checked.includes(id);

      return (
        <RadioItem<T>
          id={id}
          key={String(id)}
          type={Checkbox.Type.CHECKBOX}
          label={label}
          column={column}
          onChange={() => onChange(isChecked ? Utils.array.withoutValue(checked, id) : [...checked, id])}
          isChecked={isChecked}
          {...props}
        />
      );
    })}
  </Container>
);

export default CheckboxGroup;
