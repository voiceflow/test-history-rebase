import React from 'react';

import SvgIcon, { IconProps } from '@/components/SvgIcon';

import { ActionContainer, Container, OutlineContainer, SubtleContainer } from './components';
import { ContainerProps } from './components/Container';
import { OutlineContainerProps } from './components/OutlineContainer';
import { IconButtonVariant } from './types';

export { Container, IconButtonVariant };

export type IconButtonProps = Pick<IconProps, 'icon' | 'size'> &
  (ContainerProps | OutlineContainerProps) & {
    variant?: IconButtonVariant;
    onClick?: React.ReactEventHandler;
    iconProps?: Omit<IconProps, 'icon' | 'size'>;
  };

export type IconButtonRef = HTMLButtonElement;

const ICON_BUTTON_CONTAINERS = {
  [IconButtonVariant.FLAT]: Container,
  [IconButtonVariant.NORMAL]: Container,
  [IconButtonVariant.SUBTLE]: SubtleContainer,
  [IconButtonVariant.ACTION]: ActionContainer,
  [IconButtonVariant.OUTLINE]: OutlineContainer,
};

// eslint-disable-next-line react/display-name
const IconButton = React.forwardRef<IconButtonRef, IconButtonProps>(({ icon, size, iconProps, ...props }, ref) => {
  const IconButtonContainer = (props.variant && ICON_BUTTON_CONTAINERS[props.variant]) || Container;

  return (
    <IconButtonContainer ref={ref} {...props}>
      <SvgIcon icon={icon} size={size} {...iconProps} />
    </IconButtonContainer>
  );
});

export default IconButton;
