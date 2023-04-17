import React from 'react';

import Container, { ContainerProps } from './Container';
import Content, { ContentProps } from './Content';
import Header, { HeaderProps } from './Header';

export interface SimpleContentSectionProps extends ContainerProps {
  header: React.ReactNode;
  onClick?: VoidFunction;
  headerProps?: HeaderProps;
  contentProps?: ContentProps;
}

const SimpleContentSection: React.FC<SimpleContentSectionProps> = ({ onClick, header, children, headerProps, contentProps, ...containerProps }) => (
  <Container onClick={onClick} {...containerProps}>
    <Header {...headerProps}>{header}</Header>
    <Content {...contentProps}>{children}</Content>
  </Container>
);

export default SimpleContentSection;
