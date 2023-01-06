import React from 'react';

import { Container } from './components';

interface StickyContainerProps {
  top?: number;
  width?: number;
}
const StickyContainer: React.OldFC<StickyContainerProps> = ({ top, width, children }) => (
  <Container top={top} width={width}>
    {children}
  </Container>
);

export default StickyContainer;
