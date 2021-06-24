import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

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
