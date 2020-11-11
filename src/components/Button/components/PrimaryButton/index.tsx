import React from 'react';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import { Container, Icon, Label } from './components';
import { PrimaryButtonContainerProps } from './components/PrimaryButtonContainer';

export type PrimaryButtonProps = PrimaryButtonContainerProps & {
  icon?: SvgIconProps['icon'] | null;
  iconProps?: Omit<SvgIconProps, 'icon'>;
  isLoading?: boolean;
};

const PrimaryButton: React.ForwardRefRenderFunction<HTMLButtonElement, PrimaryButtonProps> = (
  { icon, children, iconProps, isLoading, ...props },
  ref
) => {
  return (
    <Container ref={ref} {...props}>
      <Label isLoading={isLoading}>{children}</Label>
      {icon && (
        <Icon>
          <SvgIcon icon={icon} color="#FFF" size={16} {...iconProps} />
        </Icon>
      )}
    </Container>
  );
};

export default React.forwardRef(PrimaryButton);
