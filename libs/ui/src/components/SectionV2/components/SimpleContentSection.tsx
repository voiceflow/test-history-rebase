import React from 'react';

import type { ContainerProps } from './Container';
import Container from './Container';
import type { ContentProps } from './Content';
import Content from './Content';
import type { HeaderProps } from './Header';
import Header from './Header';

export interface SimpleContentSectionProps extends ContainerProps {
  header: React.ReactNode;
  onClick?: VoidFunction;
  headerProps?: HeaderProps;
  contentProps?: ContentProps;
}

const SimpleContentSection: React.FC<SimpleContentSectionProps> = ({
  onClick,
  header,
  children,
  headerProps,
  contentProps,
  ...containerProps
}) => (
  <Container onClick={onClick} {...containerProps}>
    <Header {...headerProps}>{header}</Header>
    <Content {...contentProps}>{children}</Content>
  </Container>
);

export default SimpleContentSection;
