import React from 'react';

import SvgIcon, { IconProps } from '@/components/SvgIcon';
import { Either } from '@/types';

import { ActionContainer, Container, OutlineContainer, SubtleContainer } from './components';
import { ContainerProps } from './components/Container';
import { OutlineContainerProps } from './components/OutlineContainer';
import { SubtleContainerProps } from './components/SubtleContainer';
import { IconButtonVariant } from './types';

export { Container, IconButtonVariant };

export type IconButtonProps = Pick<IconProps, 'icon' | 'size'> &
  Either<ContainerProps, OutlineContainerProps> & {
    variant?: IconButtonVariant;
    onClick?: React.ReactEventHandler;
    iconProps?: Omit<IconProps, 'icon' | 'size'>;
    id?: string;
    disabled?: boolean;
    hoverColor?: string;
  };

const ICON_BUTTON_CONTAINERS: Record<IconButtonVariant, React.FC<ContainerProps | SubtleContainerProps>> = {
  [IconButtonVariant.FLAT]: Container,
  [IconButtonVariant.NORMAL]: Container,
  [IconButtonVariant.SUBTLE]: SubtleContainer,
  [IconButtonVariant.ACTION]: ActionContainer,
  [IconButtonVariant.OUTLINE]: OutlineContainer,
};

// eslint-disable-next-line react/display-name
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ icon, size, iconProps, ...props }, ref) => {
  const IconButtonContainer = (props.variant && ICON_BUTTON_CONTAINERS[props.variant]) || Container;

  return (
    <IconButtonContainer ref={ref} {...props}>
      <SvgIcon icon={icon} size={size} {...iconProps} />
    </IconButtonContainer>
  );
});

export default IconButton;
