import { CheckboxTypes } from '@voiceflow/ui';
import React from 'react';

import Container from './RadioGroupContainer';
import RadioItem from './RadioItem';

export interface RadioOption<T extends any> {
  id: T;
  label: React.ReactNode;
  customCheckedCondition?: (checked?: T) => boolean;
}

export interface RadioGroupProps<T extends any> extends Omit<CheckboxTypes.Props, 'id' | 'value' | 'checked' | 'onChange'> {
  column?: boolean;
  options?: RadioOption<T>[];
  checked?: T;
  onChange: (value: T) => void;
}

const YES_NO_RADIO_BUTTONS: RadioOption<boolean>[] = [
  { id: true, label: 'Yes' },
  { id: false, label: 'No' },
];

const RadioGroup = <T extends any = boolean>({
  options = YES_NO_RADIO_BUTTONS as RadioOption<any>[],
  checked,
  onChange,
  className,
  column,
  ...props
}: RadioGroupProps<T>): React.ReactElement => (
  <Container className={className} column={column}>
    {options.map((option, index) => {
      const { id, label, customCheckedCondition } = option;

      const isChecked = customCheckedCondition ? customCheckedCondition(checked) : checked === id;

      return <RadioItem<T> key={index} column={column} id={id} label={label} isChecked={isChecked} onChange={onChange} {...props} />;
    })}
  </Container>
);

export default RadioGroup;
