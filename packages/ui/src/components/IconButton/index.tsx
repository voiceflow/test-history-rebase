import SvgIcon, { SvgIconProps } from '@ui/components/SvgIcon';
import React from 'react';

import {
  ActionContainer,
  ActionContainerProps,
  BaseContainerProps,
  BasicContainer,
  BasicContainerProps,
  FlatContainer,
  FlatContainerProps,
  IconButtonContainer,
  IconButtonContainerProps,
  OutlineContainer,
  OutlineContainerProps,
  SquareContainer,
  SquareContainerProps,
  SubtleContainer,
  SubtleContainerProps,
  SuccessContainer,
  SuccessContainerProps,
} from './components';
import { IconButtonVariant } from './types';

export { IconButtonContainer, IconButtonVariant };
export type {
  ActionContainerProps as IconButtonActionContainerProps,
  BaseContainerProps as IconButtonBaseContainerProps,
  BasicContainerProps as IconButtonBasicContainerProps,
  IconButtonContainerProps,
  FlatContainerProps as IconButtonFlatContainerProps,
  OutlineContainerProps as IconButtonOutlineContainerProps,
  SquareContainerProps as IconButtonSquareContainerProps,
  SubtleContainerProps as IconButtonSubtleContainerProps,
  SuccessContainerProps as IconButtonSuccessContainerProps,
};

export interface BaseIconButtonProps extends Pick<SvgIconProps, 'icon' | 'size'> {
  iconProps?: Omit<SvgIconProps, 'icon' | 'size'>;
  style?: React.CSSProperties;
}

export type IconButtonProps = BaseIconButtonProps &
  (
    | IconButtonContainerProps
    | ActionContainerProps
    | FlatContainerProps
    | SubtleContainerProps
    | SuccessContainerProps
    | OutlineContainerProps
    | SquareContainerProps
    | BasicContainerProps
  );

const ICON_BUTTON_CONTAINERS = {
  [IconButtonVariant.FLAT]: FlatContainer,
  [IconButtonVariant.NORMAL]: IconButtonContainer,
  [IconButtonVariant.SUBTLE]: SubtleContainer,
  [IconButtonVariant.ACTION]: ActionContainer,
  [IconButtonVariant.OUTLINE]: OutlineContainer,
  [IconButtonVariant.SUCCESS]: SuccessContainer,
  [IconButtonVariant.SQUARE]: SquareContainer,
  [IconButtonVariant.BASIC]: BasicContainer,
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size, iconProps, variant = IconButtonVariant.NORMAL, ...props }, ref) => {
    const Container = (ICON_BUTTON_CONTAINERS[variant] || IconButtonContainer) as React.ForwardRefExoticComponent<any>;

    return (
      <Container ref={ref} variant={variant} {...props}>
        <SvgIcon icon={icon} size={size} {...iconProps} />
      </Container>
    );
  }
);

export default IconButton;
