import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Icon } from './components';

const SecondaryButton = ({ icon, children, iconProps, ...props }, ref) => (
  <Container {...props} ref={ref}>
    {icon && (
      <Icon withoutChildren={!children}>
        <SvgIcon size={16} icon={icon} {...iconProps} />
      </Icon>
    )}
    {children}
  </Container>
);

export default React.forwardRef(SecondaryButton);
