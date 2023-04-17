import { Dropdown, DropdownPlacement } from '@voiceflow/ui';
import React from 'react';

import { ButtonContainer, CaretIcon, DisabledWrapper, TextContainer } from '@/components/DropdownWithCaret/components';
import { Identifier } from '@/styles/constants';

import { TextVariant } from './types';

interface DropdownWithCaretProps {
  placement?: DropdownPlacement;
  menu: React.ReactNode | ((onToggle: () => void) => void);
  text: string | React.ReactNode;
  padding?: string;
  disabled?: boolean;
  color?: string;
  capitalized?: boolean;
  textVariant?: TextVariant;
  alwaysBlue?: boolean;
  fullWidth?: boolean;
  disabledOverlay?: boolean;
  border?: string;
}

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
  disabledOverlay = false,
  border,
  fullWidth,
}) => {
  const inactiveColor = alwaysBlue ? '#5190e6' : color;

  return (
    <Dropdown disabledOverlay={disabledOverlay} placement={placement} menu={menu}>
      {({ ref, onToggle, isOpen }) => (
        <DisabledWrapper disabled={disabled}>
          <ButtonContainer
            id={Identifier.TEST_TYPE_SELECTOR}
            variant={textVariant}
            disabled={disabled}
            padding={padding}
            isOpen={isOpen}
            onClick={onToggle}
            fullWidth={fullWidth}
            border={border}
            ref={ref}
          >
            <TextContainer color={isOpen ? '#5190e6' : inactiveColor} capitalized={capitalized} fullWidth={fullWidth}>
              {text}
            </TextContainer>
            <CaretIcon icon="caretDown" color={isOpen && !border ? '#5d9df5' : inactiveColor} size={9} />
          </ButtonContainer>
        </DisabledWrapper>
      )}
    </Dropdown>
  );
};

export default DropdownWithCaret;
