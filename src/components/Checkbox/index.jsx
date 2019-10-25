import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import Button from './components/CheckBoxButton';
import ButtonContainer from './components/CheckBoxButtonContainer';
import CheckBoxContainer from './components/CheckBoxContainer';

function Checkbox({ type = 'checkbox', checked, name, onChange, children, ...props }) {
  return (
    <CheckBoxContainer>
      <ButtonContainer>
        <Button type={type} name={name} checked={checked} onChange={onChange} {...props} />
        <SvgIcon size={16} icon={checked ? 'checked' : 'emptyCheckbox'} />
      </ButtonContainer>
      {children}
    </CheckBoxContainer>
  );
}

export default Checkbox;
