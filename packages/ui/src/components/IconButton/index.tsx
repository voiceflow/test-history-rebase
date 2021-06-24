import React from 'react';

import { Either } from '../../types';
import SvgIcon, { SvgIconProps } from '../SvgIcon';
import { ActionContainer, IconButtonContainer, OutlineContainer, SquareContainer, SubtleContainer, SuccessContainer } from './components';
import { IconButtonContainerProps } from './components/IconButtonContainer';
import { OutlineContainerProps } from './components/OutlineContainer';
import { IconButtonVariant } from './types';

export { IconButtonContainer, IconButtonVariant };

export type IconButtonProps = Pick<SvgIconProps, 'icon' | 'size'> &
  Either<IconButtonContainerProps, OutlineContainerProps> & {
    variant?: IconButtonVariant;
    onClick?: React.ReactEventHandler;
    onMouseDown?: React.ReactEventHandler;
    onBlur?: React.ReactEventHandler;
    iconProps?: Omit<SvgIconProps, 'icon' | 'size'>;
    id?: string;
    disabled?: boolean;
    hoverColor?: string;
  };

const ICON_BUTTON_CONTAINERS = {
  [IconButtonVariant.FLAT]: IconButtonContainer,
  [IconButtonVariant.NORMAL]: IconButtonContainer,
  [IconButtonVariant.SUBTLE]: SubtleContainer,
  [IconButtonVariant.ACTION]: ActionContainer,
  [IconButtonVariant.OUTLINE]: OutlineContainer,
  [IconButtonVariant.SUCCESS]: SuccessContainer,
  [IconButtonVariant.SQUARE]: SquareContainer,
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ icon, size, iconProps, ...props }, ref) => {
  const Container: typeof IconButtonContainer = (props.variant && ICON_BUTTON_CONTAINERS[props.variant]) || IconButtonContainer;

  return (
    <Container ref={ref} {...props}>
      <SvgIcon icon={icon} size={size} {...iconProps} />
    </Container>
  );
});

export default IconButton;
