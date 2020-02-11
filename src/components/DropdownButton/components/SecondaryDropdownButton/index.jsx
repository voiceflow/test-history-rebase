import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Toggle } from './components';

function DropdownButton({ disabled, onToggle, children, buttonProps }, ref) {
  return (
    <Container disabled={disabled} canHover={false} onClick={onToggle} ref={ref} {...buttonProps}>
      {children}
      <Toggle>
        <SvgIcon icon="caretDown" width={10} />
      </Toggle>
    </Container>
  );
}

export default React.forwardRef(DropdownButton);
