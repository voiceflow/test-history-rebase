import { Checkbox, CheckboxTypes } from '@voiceflow/ui';
import React, { ReactNode } from 'react';

import { ClassName } from '@/styles/constants';

import RadioButtonContainer from './RadioButtonContainer';

export interface RadioItemProps<T> {
  id: T;
  type?: CheckboxTypes.Type;
  label: ReactNode;
  column?: boolean;
  onChange: (value: T) => void;
  isChecked: boolean;
  activeBar?: boolean;
}

const RadioItem = <T extends any>({
  id,
  type = Checkbox.Type.RADIO,
  label,
  column,
  isChecked,
  activeBar,
  onChange,
  ...props
}: RadioItemProps<T>): React.ReactElement => (
  <RadioButtonContainer className={ClassName.RADIO_GROUP_ITEM} column={column} activeBar={activeBar}>
    <Checkbox {...props} type={type} value={String(id)} checked={isChecked} onChange={() => onChange(id)} activeBar={activeBar} isFlat>
      <div>{label}</div>
    </Checkbox>
  </RadioButtonContainer>
);

export default RadioItem;
