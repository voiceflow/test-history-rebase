import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Icon, Label } from './components';

function PrimaryButton({ icon, children, ...props }) {
  return (
    <Container {...props}>
      <Label>{children}</Label>
      {icon && (
        <Icon>
          <SvgIcon icon={icon} color="#FFF" />
        </Icon>
      )}
    </Container>
  );
}

export default PrimaryButton;
