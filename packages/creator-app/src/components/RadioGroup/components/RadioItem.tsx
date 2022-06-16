import { Checkbox, CheckboxTypes } from '@voiceflow/ui';
import React, { ReactNode } from 'react';

import RadioButtonContainer from './RadioButtonContainer';

export interface RadioItemProps<T> {
  id: T;
  type?: CheckboxTypes.Type;
  label: ReactNode;
  column?: boolean;
  onChange: (value: T) => void;
  isChecked: boolean;
}

const RadioItem = <T extends any>({
  id,
  type = Checkbox.Type.RADIO,
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
