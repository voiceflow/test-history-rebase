import SvgIcon from 'components/SvgIcon';
import React from 'react';
import CaretDownIcon from 'svgs/solid/caret-down.svg';

import PrimaryButton from 'componentsV2/Button/components/PrimaryButton';
import PrimaryButtonContainer from 'componentsV2/Button/components/PrimaryButton/components/PrimaryButtonContainer';

import { Container, Toggle } from './components';

function DropdownButton({ options, children, ...props }) {
  return (
    <Container>
      <PrimaryButton {...props} canHover={false}>
        {children}
      </PrimaryButton>
      <PrimaryButtonContainer disabled={props.disabled} canHover={false}>
        <Toggle>
          <SvgIcon icon={CaretDownIcon} width={12} />
        </Toggle>
      </PrimaryButtonContainer>
    </Container>
  );
}

export default DropdownButton;
