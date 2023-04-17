import React from 'react';

import { Container } from './components';

interface StickyContainerProps extends React.PropsWithChildren {
  top?: number;
  width?: number;
}
const StickyContainer: React.FC<StickyContainerProps> = ({ top, width, children }) => (
  <Container top={top} width={width}>
    {children}
  </Container>
);

export default StickyContainer;
