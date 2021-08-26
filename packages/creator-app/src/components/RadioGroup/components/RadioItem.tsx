import React, { ReactNode } from 'react';

import Checkbox, { CheckboxType } from '@/components/Checkbox';

import RadioButtonContainer from './RadioButtonContainer';

export interface RadioItemProps<T> {
  id: T;
  type?: CheckboxType;
  label: ReactNode;
  column?: boolean;
  onChange: (value: T) => void;
  isChecked: boolean;
}

const RadioItem = <T extends any>({
  id,
  type = CheckboxType.RADIO,
  label,
  column,
  isChecked,
  onChange,
  ...props
}: RadioItemProps<T>): React.ReactElement => (
  <RadioButtonContainer column={column}>
    <Checkbox {...props} type={type} value={String(id)} checked={isChecked} onChange={() => onChange(id)} isFlat>
      <div>{label}</div>
    </Checkbox>
  </RadioButtonContainer>
);

export default RadioItem;
