import type { TextProps } from '@ui/components/Text';
import { BlockText } from '@ui/components/Text';
import React from 'react';

import * as S from './styles';

export interface AlertProps extends S.ContainerProps, React.PropsWithChildren {
  title?: React.ReactNode;
  textProps?: TextProps;
}

const Alert: React.FC<AlertProps> = ({ title, color, children, textProps, ...rest }) => (
  <S.Container color={color as any} {...rest}>
    {title}

    {children && (
      <BlockText mt={title ? 4 : 0} {...textProps}>
        {children}
      </BlockText>
    )}
  </S.Container>
);

export default Object.assign(Alert, {
  Title: S.Title,
  Variant: S.Variant,
});
