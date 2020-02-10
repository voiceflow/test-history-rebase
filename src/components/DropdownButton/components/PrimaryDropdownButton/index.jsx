import React from 'react';

import PrimaryButton from '@/components/Button/components/PrimaryButton';
import PrimaryButtonContainer from '@/components/Button/components/PrimaryButton/components/PrimaryButtonContainer';
import SvgIcon from '@/components/SvgIcon';

import { Container, Toggle } from './components';

function DropdownButton({ disabled, onToggle, children }, ref) {
  return (
    <Container ref={ref} inline>
      <PrimaryButton disabled={disabled} canHover={false}>
        {children}
      </PrimaryButton>
      <PrimaryButtonContainer disabled={disabled} canHover={false} onClick={onToggle}>
        <Toggle>
          <SvgIcon icon="caretDown" width={10} />
        </Toggle>
      </PrimaryButtonContainer>
    </Container>
  );
}

export default React.forwardRef(DropdownButton);
