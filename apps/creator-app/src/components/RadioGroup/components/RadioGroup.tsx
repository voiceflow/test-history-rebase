import type { CheckboxTypes } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { ClassName } from '@/styles/constants';

import Container from './RadioGroupContainer';
import RadioItem from './RadioItem';

export interface RadioOption<T> {
  id: T;
  label: React.ReactNode;
  customCheckedCondition?: (checked?: T) => boolean;
}

export interface RadioGroupProps<T> extends Omit<CheckboxTypes.Props, 'id' | 'value' | 'checked' | 'onChange'> {
  column?: boolean;
  options?: RadioOption<T>[];
  checked?: T;
  onChange: (value: T) => void;
  activeBar?: boolean;
  noPaddingLastItem?: boolean;
}

const YES_NO_RADIO_BUTTONS: RadioOption<boolean>[] = [
  { id: true, label: 'Yes' },
  { id: false, label: 'No' },
];

const RadioGroup = <T = boolean,>({
  options = YES_NO_RADIO_BUTTONS as RadioOption<any>[],
  checked,
  onChange,
  className,
  column,
  activeBar,
  noPaddingLastItem,
  ...props
}: RadioGroupProps<T>): React.ReactElement => (
  <Container
    className={cn(className, ClassName.RADIO_GROUP)}
    column={column}
    noPaddingLastItem={noPaddingLastItem}
    fullWidth={activeBar}
  >
    {options.map((option, index) => {
      const { id, label, customCheckedCondition } = option;

      const isChecked = customCheckedCondition ? customCheckedCondition(checked) : checked === id;

      return (
        <RadioItem<T>
          key={index}
          column={column}
          id={id}
          label={label}
          isChecked={isChecked}
          onChange={onChange}
          activeBar={activeBar}
          {...props}
        />
      );
    })}
  </Container>
);

export default RadioGroup;
