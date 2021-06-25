import React from 'react';

import SvgIcon, { SvgIconProps } from '../../../SvgIcon';
import { ButtonVariant } from '../../constants';
import { PrimaryButtonContainer, PrimaryButtonIcon, PrimaryButtonLabel } from './components';
import { PrimaryButtonContainerProps } from './components/PrimaryButtonContainer';

export * from './components';

export interface PrimaryButtonProps extends PrimaryButtonContainerProps {
  icon?: SvgIconProps['icon'] | null;
  variant?: ButtonVariant.PRIMARY;
  iconProps?: Omit<SvgIconProps, 'icon'>;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(({ icon, children, iconProps, isLoading, ...props }, ref) => (
  <PrimaryButtonContainer ref={ref} {...props}>
    <PrimaryButtonLabel isLoading={isLoading}>{children}</PrimaryButtonLabel>

    {icon && (
      <PrimaryButtonIcon>
        <SvgIcon icon={icon} color="#FFF" size={16} {...iconProps} />
      </PrimaryButtonIcon>
    )}
  </PrimaryButtonContainer>
));

export default PrimaryButton;
