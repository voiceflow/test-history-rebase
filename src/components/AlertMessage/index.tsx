import React from 'react';

import { FlexCenter } from '@/components/Flex';
import SvgIcon, { Icon, IconProps } from '@/components/SvgIcon';

import { Container, ContainerProps } from './components';
import { MESSAGE_VARIANTS, Variant } from './constants';

export { Variant as AlertMessageVariant } from './constants';

export type AlertMessageProps = ContainerProps & {
  icon?: Icon;
  variant?: Variant;
  iconProps?: Omit<IconProps, 'icon'>;
  className?: string;
};

const AlertMessage: React.FC<AlertMessageProps> = ({ icon, variant = Variant.PRIMARY, children, iconProps = {}, ...props }) => {
  const messageStyle = MESSAGE_VARIANTS[variant];
  const localIcon = icon || messageStyle.icon;

  return (
    <Container color={messageStyle.color} {...props}>
      {!!localIcon && (
        <FlexCenter>
          {icon ? <SvgIcon icon={icon} mb={10} {...iconProps} /> : !!messageStyle.icon && <SvgIcon icon={messageStyle.icon} mb={10} />}
        </FlexCenter>
      )}

      {children}
    </Container>
  );
};

export default AlertMessage;
