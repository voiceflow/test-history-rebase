import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, DropdownButton, Icon, InnerContainer, Label, Toggle } from './components';

const DropdownComponent = ({ disabled, icon, color, placeholder, label, onToggle, isOpen, value }, ref) => {
  return (
    <Container ref={ref} onClick={onToggle} active={isOpen} color={color} inline>
      <InnerContainer>
        {icon && (
          <Icon>
            <SvgIcon icon={icon} color={color} />
          </Icon>
        )}
        {label && <Label>label</Label>}
        <DropdownButton disabled={disabled} canHover={false}>
          {value || placeholder}
        </DropdownButton>
        <Toggle>
          <SvgIcon icon="caretDown" width={10} color="currentColor" />
        </Toggle>
      </InnerContainer>
    </Container>
  );
};

export default React.forwardRef(DropdownComponent);
