import React, { ReactNode } from 'react';

import Checkbox, { CheckboxProps, CheckboxType } from '@/components/Checkbox';

import RadioButtonContainer from './components/RadioButtonContainer';
import Container from './components/RadioGroupContainer';

export interface RadioOption<T extends any> {
  id: T;
  label: React.ReactNode;
  customCheckedCondition?: (checked?: T) => boolean;
}

export const YES_NO_RADIO_BUTTONS: RadioOption<boolean>[] = [
  { id: true, label: 'Yes' },
  { id: false, label: 'No' },
];

export interface RadioItemProps<T extends any> {
  id: T;
  type?: CheckboxType;
  index: number;
  label: ReactNode;
  column?: boolean;
  isChecked: boolean;
  onChange: (val: T) => void;
}

export const RadioItem = <T extends any>({
  id,
  type = CheckboxType.RADIO,
  index,
  label,
  column,
  isChecked,
  onChange,
  ...props
}: RadioItemProps<T>): React.ReactElement => (
  <RadioButtonContainer key={index} column={column}>
    <Checkbox {...props} type={type} value={String(id)} checked={isChecked} onChange={() => onChange(id)} isFlat>
      <div>{label}</div>
    </Checkbox>
  </RadioButtonContainer>
);

export interface RadioGroupProps<T extends any> extends Omit<CheckboxProps, 'id' | 'type' | 'value' | 'checked' | 'onChange'> {
  type?: CheckboxType;
  column?: boolean;
  options?: RadioOption<T>[];
  checked?: T;
  onChange: (value: T) => void;
}

const RadioGroup = <T extends any>({
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

      return <RadioItem<T> key={index} index={index} column={column} id={id} label={label} isChecked={isChecked} onChange={onChange} {...props} />;
    })}
  </Container>
);

export default RadioGroup;
