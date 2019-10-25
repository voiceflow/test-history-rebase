import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { ActionContainer, Container, OutlineContainer, SubtleContainer } from './components';

const ICON_BUTTON_CONTAINERS = {
  normal: Container,
  flat: Container,
  subtle: SubtleContainer,
  action: ActionContainer,
  outline: OutlineContainer,
};

function IconButton({ icon, size, ref, ...props }) {
  const IconButtonContainer = ICON_BUTTON_CONTAINERS[props.variant] || Container;

  return (
    <IconButtonContainer ref={ref} {...props}>
      <SvgIcon icon={icon} color="currentColor" size={size} />
    </IconButtonContainer>
  );
}

export default IconButton;
