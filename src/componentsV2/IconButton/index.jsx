import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { ActionContainer, Container, OutlineContainer, SubtleContainer } from './components';

export { Container };

const ICON_BUTTON_CONTAINERS = {
  normal: Container,
  flat: Container,
  subtle: SubtleContainer,
  action: ActionContainer,
  outline: OutlineContainer,
};

// eslint-disable-next-line react/display-name
const IconButton = React.forwardRef(({ icon, size, iconProps, ...props }, ref) => {
  const IconButtonContainer = ICON_BUTTON_CONTAINERS[props.variant] || Container;

  return (
    <IconButtonContainer ref={ref} {...props}>
      <SvgIcon icon={icon} color="currentColor" size={size} {...iconProps} />
    </IconButtonContainer>
  );
});

export default IconButton;
