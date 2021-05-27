import React, { ReactNode } from 'react';

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
  column?: boolean;
};

interface RadioItemProps {
  index: number;
  column?: boolean;
  id: any;
  label: ReactNode;
  isChecked: boolean;
  onChange: (val: any) => void;
}

export const RadioItem: React.FC<RadioItemProps> = ({ index, column, id, label, isChecked, onChange, ...props }) => (
  <RadioButtonContainer key={index} column={column}>
    <Checkbox {...props} type={CheckboxType.RADIO} value={id} checked={isChecked} onChange={() => onChange(id)} isFlat>
      <div>{label}</div>
    </Checkbox>
  </RadioButtonContainer>
);

const RadioGroup = <T extends any>({
  options = YES_NO_RADIO_BUTTONS as RadioOption<any>[],
  checked,
  onChange,
  className,
  column,
  ...props
}: RadioGroupProps<T>) => (
  <Container className={className} column={column}>
    {options.map((option, index) => {
      const { id, label, customCheckedCondition } = option;

      const isChecked = customCheckedCondition ? customCheckedCondition(checked) : checked === id;

      return <RadioItem key={index} index={index} column={column} id={id} label={label} isChecked={isChecked} onChange={onChange} {...props} />;
    })}
  </Container>
);

export default RadioGroup;
