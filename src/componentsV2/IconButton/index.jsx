import SvgIcon from 'components/SvgIcon';
import React from 'react';

import { ActionContainer, Container } from './components';

const ICON_BUTTON_CONTAINERS = {
  normal: Container,
  flat: Container,
  action: ActionContainer,
};

function IconButton({ icon, ...props }) {
  const IconButtonContainer = ICON_BUTTON_CONTAINERS[props.variant] || Container;

  return (
    <IconButtonContainer {...props}>
      <SvgIcon icon={icon} />
    </IconButtonContainer>
  );
}

export default IconButton;
