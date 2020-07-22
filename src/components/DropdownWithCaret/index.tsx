import React from 'react';

import Dropdown from '@/components/Dropdown';
import { ButtonContainer, CaretIcon, TextContainer } from '@/components/DropdownWithCaret/components';

const DropdownComponent: any = Dropdown;

type DropdownWithCaretProps = {
  placement?: string;
  menu: any;
  text: string;
  padding?: string;
  disabled?: boolean;
  color?: string;
};

const DropdownWithCaret: React.FC<DropdownWithCaretProps> = ({ placement = 'bottom-start', menu, disabled, text, padding = '10px 25px', color }) => {
  return (
    <DropdownComponent placement={placement} menu={menu}>
      {(ref: any, onToggle: () => void, isOpen: boolean) => (
        <ButtonContainer disabled={disabled} padding={padding} isOpen={isOpen} onClick={onToggle} ref={ref}>
          <TextContainer color={isOpen ? '#5190e6' : color}>{text}</TextContainer>
          <CaretIcon icon="caretDown" color={isOpen ? '#5d9df5' : '#6e849a'} size={9} />
        </ButtonContainer>
      )}
    </DropdownComponent>
  );
};

export default DropdownWithCaret;
