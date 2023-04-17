import { BoxProps } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface SectionProps extends BoxProps, React.PropsWithChildren {
  header?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ header, children, ...props }) => (
  <S.Container {...props}>
    {header}

    {children && <S.Content>{children}</S.Content>}
  </S.Container>
);

export default Object.assign(Section, {
  Title: S.Title,
  Header: S.Header,
  Description: S.Description,
});
