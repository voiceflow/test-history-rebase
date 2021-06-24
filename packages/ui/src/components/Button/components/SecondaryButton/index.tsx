import React from 'react';

import SvgIcon, { SvgIconProps } from '../../../SvgIcon';
import { SecondaryButtonContainer, SecondaryButtonIcon } from './components';
import { SecondaryButtonContainerProps } from './components/SecondaryButtonContainer';

export * from './components';

export type SecondaryButtonProps = SecondaryButtonContainerProps & {
  icon?: SvgIconProps['icon'] | null;
  iconProps?: Omit<SvgIconProps, 'icon'>;
  isLoading?: boolean;
};

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
