import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import PrimaryButton from '@/componentsV2/Button/components/PrimaryButton';
import PrimaryButtonContainer from '@/componentsV2/Button/components/PrimaryButton/components/PrimaryButtonContainer';

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
