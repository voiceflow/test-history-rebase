import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Icon } from './components';

function SecondaryButton({ icon, children, ...props }, ref) {
  return (
    <Container {...props} ref={ref}>
      {icon && (
        <Icon>
          <SvgIcon icon={icon} />
        </Icon>
      )}
      {children}
    </Container>
  );
}

export default React.forwardRef(SecondaryButton);
