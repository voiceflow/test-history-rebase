import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Icon } from './components';

function SecondaryButton({ icon, children, iconProps, ...props }, ref) {
  return (
    <Container {...props} ref={ref}>
      {icon && (
        <Icon>
          <SvgIcon size={16} icon={icon} {...iconProps} />
        </Icon>
      )}
      {children}
    </Container>
  );
}

export default React.forwardRef(SecondaryButton);
