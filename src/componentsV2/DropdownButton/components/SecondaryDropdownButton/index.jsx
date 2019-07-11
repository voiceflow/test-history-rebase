import SvgIcon from 'components/SvgIcon';
import React from 'react';
import CaretDownIcon from 'svgs/solid/caret-down.svg';

import { Container, Toggle } from './components';

function DropdownButton({ options, children, ...props }) {
  return (
    <Container {...props} canHover={false}>
      {children}
      <Toggle>
        <SvgIcon icon={CaretDownIcon} width={12} />
      </Toggle>
    </Container>
  );
}

export default DropdownButton;
