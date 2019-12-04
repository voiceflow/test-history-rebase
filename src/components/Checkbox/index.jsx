import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import Button from './components/CheckBoxButton';
import ButtonContainer from './components/CheckBoxButtonContainer';
import CheckBoxContainer from './components/CheckBoxContainer';

function Checkbox({ type = 'checkbox', checked, name, onChange, children, className, color = '#5d9df5', ...props }) {
  return (
    <CheckBoxContainer className={className}>
      <ButtonContainer>
        <Button color={color} type={type} name={name} checked={checked} onChange={onChange} {...props} />
        <SvgIcon checked={checked} color={color} size={16} icon={checked ? 'checked' : 'emptyCheckbox'} />
      </ButtonContainer>
      {children}
    </CheckBoxContainer>
  );
}

export default Checkbox;
