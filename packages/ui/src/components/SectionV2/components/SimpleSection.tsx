import React from 'react';

import Container, { ContainerProps } from './Container';
import Header, { HeaderProps } from './Header';

export interface SimpleSectionProps extends ContainerProps {
  onClick?: VoidFunction;
  headerProps?: HeaderProps;
}

const SimpleSection: React.FC<SimpleSectionProps> = ({ onClick, children, headerProps, ...containerProps }) => (
  <Container onClick={onClick} {...containerProps}>
    <Header {...headerProps}>{children}</Header>
  </Container>
);

export default SimpleSection;
