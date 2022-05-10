import React from 'react';

import Container, { ContainerProps } from './Container';
import Header from './Header';

export interface SimpleSectionProps extends ContainerProps {
  onClick?: VoidFunction;
}

const SimpleSection: React.FC<SimpleSectionProps> = ({ isAccent, onClick, children, ...containerProps }) => (
  <Container onClick={onClick} {...containerProps}>
    <Header>{children}</Header>
  </Container>
);

export default SimpleSection;
