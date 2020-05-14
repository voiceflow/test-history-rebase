import React from 'react';
import { Assign } from 'utility-types';

import SvgIcon from '@/components/SvgIcon';

import { Button, ButtonContainer, Container } from './components';
import { CheckboxColor, CheckboxType } from './constants';

export { CheckboxType } from './constants';

export type CheckboxProps = Assign<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    type?: CheckboxType;
    error?: boolean;
  }
>;

const Checkbox: React.FC<CheckboxProps> = ({
  type = CheckboxType.CHECKBOX,
  checked,
  children,
  error,
  disabled,
  className,
  color = CheckboxColor.DEFAULT,
  ...props
}) => {
  // eslint-disable-next-line no-nested-ternary
  const checkBoxColor = error && !checked ? CheckboxColor.ERROR : disabled || !checked ? CheckboxColor.DISABLED : color;
  // eslint-disable-next-line no-nested-ternary
  const icon = type === CheckboxType.CHECKBOX ? (checked ? 'checked' : 'emptyCheckbox') : checked ? 'onRadioButton' : 'offRadioButton';

  return (
    <Container disabled={disabled} className={className}>
      <ButtonContainer>
        <Button type={type} checked={checked} disabled={disabled} color={checkBoxColor} {...props} />
        <SvgIcon color={checkBoxColor} size={16} icon={icon} ignoreEvents />
      </ButtonContainer>
      {children}
    </Container>
  );
};

export default Checkbox;
