import SvgIcon from 'components/SvgIcon';
import React from 'react';

import { Container, Icon } from './components';

function SecondaryButton({ icon, children, ...props }) {
  return (
    <Container {...props}>
      {icon && (
        <Icon>
          <SvgIcon icon={icon} />
        </Icon>
      )}
      {children}
    </Container>
  );
}

export default SecondaryButton;
