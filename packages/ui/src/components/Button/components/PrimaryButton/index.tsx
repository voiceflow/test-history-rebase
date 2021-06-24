import React from 'react';

import SvgIcon, { SvgIconProps } from '../../../SvgIcon';
import { PrimaryButtonContainer, PrimaryButtonIcon, PrimaryButtonLabel } from './components';
import { PrimaryButtonContainerProps } from './components/PrimaryButtonContainer';

export * from './components';

export type PrimaryButtonProps = PrimaryButtonContainerProps & {
  icon?: SvgIconProps['icon'] | null;
  iconProps?: Omit<SvgIconProps, 'icon'>;
  isLoading?: boolean;
};

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
