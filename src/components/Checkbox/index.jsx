import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import Button from './components/CheckBoxButton';
import ButtonContainer from './components/CheckBoxButtonContainer';
import CheckBoxContainer from './components/CheckBoxContainer';

function Checkbox({ type = 'checkbox', checked, name, onChange, children, error, disabled, className, color = '#5d9df5', ...props }) {
  // eslint-disable-next-line no-nested-ternary
  const checkBoxColor = error && !checked ? '#e91e63' : disabled || !checked ? '#8da2b5' : color;
  // eslint-disable-next-line no-nested-ternary
  const icon = type === 'checkbox' ? (checked ? 'checked' : 'emptyCheckbox') : checked ? 'onRadioButton' : 'offRadioButton';

  return (
    <CheckBoxContainer disabled={disabled} className={className}>
      <ButtonContainer>
        <Button disabled={disabled} color={checkBoxColor} type={type} name={name} checked={checked} onChange={onChange} {...props} />
        <SvgIcon color={checkBoxColor} size={16} icon={icon} ignoreEvents />
      </ButtonContainer>
      {children}
    </CheckBoxContainer>
  );
}

export default Checkbox;
