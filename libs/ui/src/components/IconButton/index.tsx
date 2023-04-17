import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import React from 'react';

import {
  ActionContainer,
  ActionContainerProps,
  BaseContainerProps,
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

/**
 * @deprecated use IconButton.Container, IconButton.Variant instead
 */
export { IconButtonContainer, IconButtonVariant };
export type {
  ActionContainerProps as IconButtonActionContainerProps,
  BaseContainerProps as IconButtonBaseContainerProps,
  IconButtonContainerProps,
  FlatContainerProps as IconButtonFlatContainerProps,
  OutlineContainerProps as IconButtonOutlineContainerProps,
  SquareContainerProps as IconButtonSquareContainerProps,
  SubtleContainerProps as IconButtonSubtleContainerProps,
  SuccessContainerProps as IconButtonSuccessContainerProps,
};

export interface BaseIconButtonProps extends Pick<SvgIconTypes.Props, 'icon' | 'size'> {
  style?: React.CSSProperties;
  iconProps?: Omit<SvgIconTypes.Props, 'icon' | 'size'>;
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
  );

const ICON_BUTTON_CONTAINERS = {
  [IconButtonVariant.FLAT]: FlatContainer,
  [IconButtonVariant.NORMAL]: IconButtonContainer,
  [IconButtonVariant.SUBTLE]: SubtleContainer,
  [IconButtonVariant.ACTION]: ActionContainer,
  [IconButtonVariant.OUTLINE]: OutlineContainer,
  [IconButtonVariant.SUCCESS]: SuccessContainer,
  [IconButtonVariant.SQUARE]: SquareContainer,
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

export default Object.assign(IconButton, {
  Variant: IconButtonVariant,

  Container: IconButtonContainer,
  FlatContainer,
  SubtleContainer,
  SquareContainer,
  ActionContainer,
  OutlineContainer,
  SuccessContainer,
});
