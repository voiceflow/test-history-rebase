import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { ActionContainer, Container, SubtleContainer } from './components';

const ICON_BUTTON_CONTAINERS = {
  normal: Container,
  flat: Container,
  subtle: SubtleContainer,
  action: ActionContainer,
};

function IconButton({ icon, size, ...props }) {
  const IconButtonContainer = ICON_BUTTON_CONTAINERS[props.variant] || Container;

  return (
    <IconButtonContainer {...props}>
      <SvgIcon icon={icon} color="currentColor" size={size} />
    </IconButtonContainer>
  );
}

export default IconButton;
