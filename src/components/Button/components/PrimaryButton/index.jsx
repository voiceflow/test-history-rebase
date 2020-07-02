import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Icon, Label } from './components';

function PrimaryButton({ icon, children, iconProps, ...props }) {
  return (
    <Container {...props}>
      <Label>{children}</Label>
      {icon && (
        <Icon>
          <SvgIcon icon={icon} color="#FFF" size={16} {...iconProps} />
        </Icon>
      )}
    </Container>
  );
}

export default PrimaryButton;
