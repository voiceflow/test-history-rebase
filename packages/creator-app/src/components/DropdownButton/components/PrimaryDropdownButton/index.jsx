import { PrimaryButton, PrimaryButtonContainer, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { Container, Toggle } from './components';

const DropdownButton = ({ disabled, onToggle, children, buttonProps }, ref) => (
  <Container ref={ref} inline>
    <PrimaryButton disabled={disabled} canHover={false} {...buttonProps}>
      {children}
    </PrimaryButton>
    <PrimaryButtonContainer disabled={disabled} canHover={false} onClick={onToggle}>
      <Toggle>
        <SvgIcon icon="caretDown" width={10} />
      </Toggle>
    </PrimaryButtonContainer>
  </Container>
);

export default React.forwardRef(DropdownButton);
