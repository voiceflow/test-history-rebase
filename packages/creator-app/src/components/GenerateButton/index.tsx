import composeRef from '@seznam/compose-react-refs';
import { Button, ButtonVariant, Dropdown, MenuTypes } from '@voiceflow/ui';
import React from 'react';

interface GenerateButtonProps {
  isLoading?: boolean;
  label?: string;
  fullWidth?: boolean;
  subtext?: string;
  disabled?: boolean;
  options: MenuTypes.Option[];
  dropdownText?: string;
  hoverOpen?: boolean;
}

const MIN_MENU_WIDTH = 350;

const GenerateButton: React.FC<GenerateButtonProps> = ({ hoverOpen, dropdownText, disabled, options, isLoading, fullWidth = true, label }) => {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const menuWidth = (buttonRef.current?.offsetWidth || 0) > MIN_MENU_WIDTH ? buttonRef.current?.offsetWidth : MIN_MENU_WIDTH;

  const handleMouseEnter = (isOpen: boolean, onToggle: () => void) => {
    if (hoverOpen && !isOpen) {
      onToggle();
    }
  };

  return (
    <Dropdown options={options} menuWidth={menuWidth} dropdownText={dropdownText}>
      {(ref, onToggle, isOpen) => {
        return (
          <Button
            onMouseEnter={() => handleMouseEnter(isOpen, onToggle)}
            onClick={onToggle}
            ref={composeRef(buttonRef, ref)}
            isLoading={isLoading}
            disabled={isLoading || disabled}
            variant={ButtonVariant.PRIMARY}
            fullWidth={fullWidth}
          >
            {label || 'Generate'}
          </Button>
        );
      }}
    </Dropdown>
  );
};

export default GenerateButton;
