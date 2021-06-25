import React from 'react';

import SvgIcon, { SvgIconProps } from '../../../SvgIcon';
import { ButtonVariant } from '../../constants';
import { SecondaryButtonContainer, SecondaryButtonIcon } from './components';
import { SecondaryButtonContainerProps } from './components/SecondaryButtonContainer';

export * from './components';

export interface SecondaryButtonProps extends SecondaryButtonContainerProps {
  icon?: SvgIconProps['icon'] | null;
  variant: ButtonVariant.SECONDARY;
  iconProps?: Omit<SvgIconProps, 'icon'>;
}

const SecondaryButton = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<SecondaryButtonProps>>(
  ({ icon, children, iconProps, ...props }, ref) => (
    <SecondaryButtonContainer {...props} ref={ref}>
      {icon && (
        <SecondaryButtonIcon withoutChildren={!children}>
          <SvgIcon size={16} icon={icon} {...iconProps} />
        </SecondaryButtonIcon>
      )}

      {children}
    </SecondaryButtonContainer>
  )
);

export default SecondaryButton;
