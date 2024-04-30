import React from 'react';

import type { TextProps } from '@/components/Text';
import { BlockText } from '@/components/Text';

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
