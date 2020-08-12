import React from 'react';

import Dropdown, { DropdownPlacement } from '@/components/Dropdown';
import { ButtonContainer, CaretIcon, DisabledWrapper, TextContainer } from '@/components/DropdownWithCaret/components';

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
  alwaysBlue?: boolean;
};

const DropdownWithCaret: React.FC<DropdownWithCaretProps> = ({
  placement = 'bottom-start',
  textVariant = TextVariant.primary,
  menu,
  capitalized,
  color = '#6e849a',
  disabled = false,
  text,
  padding = '10px 25px',
  alwaysBlue = false,
}) => {
  const inactiveColor = alwaysBlue ? '#5190e6' : color;

  return (
    <Dropdown placement={placement} menu={menu}>
      {(ref, onToggle, isOpen) => (
        <DisabledWrapper disabled={disabled}>
          <ButtonContainer variant={textVariant} disabled={disabled} padding={padding} isOpen={isOpen} onClick={onToggle} ref={ref}>
            <TextContainer color={isOpen ? '#5190e6' : inactiveColor} capitalized={capitalized}>
              {text}
            </TextContainer>
            <CaretIcon icon="caretDown" color={isOpen ? '#5d9df5' : inactiveColor} size={9} />
          </ButtonContainer>
        </DisabledWrapper>
      )}
    </Dropdown>
  );
};

export default DropdownWithCaret;
