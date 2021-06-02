import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Toggle } from './components';

const DropdownButton = ({ disabled, onToggle, children, buttonProps }, ref) => (
  <Container disabled={disabled} canHover={false} onClick={onToggle} ref={ref} {...buttonProps}>
    {children}
    <Toggle>
      <SvgIcon icon="caretDown" width={10} />
    </Toggle>
  </Container>
);

export default React.forwardRef(DropdownButton);
