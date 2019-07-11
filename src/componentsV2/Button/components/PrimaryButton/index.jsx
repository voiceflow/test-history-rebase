import SvgIcon from 'components/SvgIcon';
import React from 'react';

import { Container, Icon, Label } from './components';

function PrimaryButton({ icon, children, ...props }) {
  return (
    <Container {...props}>
      <Label>{children}</Label>
      {icon && (
        <Icon>
          <SvgIcon icon={icon} />
        </Icon>
      )}
    </Container>
  );
}

export default PrimaryButton;
