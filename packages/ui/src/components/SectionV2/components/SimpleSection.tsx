import React from 'react';

import Container from './Container';
import Header from './Header';

export interface SimpleSectionProps {
  onClick?: VoidFunction;
}

const SimpleSection: React.FC<SimpleSectionProps> = ({ onClick, children }) => (
  <Container>
    <Header onClick={onClick}>{children}</Header>
  </Container>
);

export default SimpleSection;
