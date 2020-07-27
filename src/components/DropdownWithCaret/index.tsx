import React from 'react';

import Dropdown, { DropdownPlacement } from '@/components/Dropdown';
import { ButtonContainer, CaretIcon, TextContainer } from '@/components/DropdownWithCaret/components';

import { TextVariant } from './types';

type DropdownWithCaretProps = {
  placement?: DropdownPlacement;
  menu: React.ReactNode;
  text: string;
  padding?: string;
  disabled?: boolean;
  color?: string;
  capitalized?: boolean;
  textVariant?: TextVariant;
};

const DropdownWithCaret: React.FC<DropdownWithCaretProps> = ({
  placement = 'bottom-start',
  textVariant = TextVariant.primary,
  menu,
  capitalized,
  color,
  disabled,
  text,
  padding = '10px 25px',
}) => {
  return (
    <Dropdown placement={placement} menu={menu}>
      {(ref, onToggle, isOpen) => (
        <ButtonContainer variant={textVariant} disabled={disabled} padding={padding} isOpen={isOpen} onClick={onToggle} ref={ref}>
          <TextContainer color={isOpen ? '#5190e6' : color} capitalized={capitalized}>
            {text}
          </TextContainer>
          <CaretIcon icon="caretDown" color={isOpen ? '5d9df5' : '#6e849a'} size={9} />
        </ButtonContainer>
      )}
    </Dropdown>
  );
};

export default DropdownWithCaret;
