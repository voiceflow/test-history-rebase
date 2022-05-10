import { ButtonVariant } from '@ui/components/Button/constants';
import SvgIcon, { SvgIconProps } from '@ui/components/SvgIcon';
import React from 'react';

import * as S from './styles';

export interface SecondaryButtonProps extends S.SecondaryButtonContainerProps {
  icon?: SvgIconProps['icon'] | null;
  variant: ButtonVariant.SECONDARY;
  iconProps?: Omit<SvgIconProps, 'icon'>;
}

const SecondaryButton = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<SecondaryButtonProps>>(
  ({ icon, children, iconProps, ...props }, ref) => (
    <S.SecondaryButtonContainer {...props} ref={ref}>
      {icon && (
        <S.SecondaryButtonIcon withoutChildren={!children}>
          <SvgIcon size={16} icon={icon} {...iconProps} />
        </S.SecondaryButtonIcon>
      )}

      {children}
    </S.SecondaryButtonContainer>
  )
);

export default SecondaryButton;
