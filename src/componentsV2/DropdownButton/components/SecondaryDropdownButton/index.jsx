import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import CaretDownIcon from '@/svgs/solid/caret-down.svg';

import { Container, Toggle } from './components';

function DropdownButton({ disabled, onToggle, children }, ref) {
  return (
    <Container disabled={disabled} canHover={false} onClick={onToggle} ref={ref}>
      {children}
      <Toggle>
        <SvgIcon icon={CaretDownIcon} width={12} />
      </Toggle>
    </Container>
  );
}

export default React.forwardRef(DropdownButton);
