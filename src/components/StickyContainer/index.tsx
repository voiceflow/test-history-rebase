import React from 'react';

import { Container } from './components';

type StickyContainerProps = {
  top?: number;
  width?: number;
};
const StickyContainer: React.FC<StickyContainerProps> = ({ top, width, children }) => {
  return (
    <Container top={top} width={width}>
      {children}
    </Container>
  );
};

export default StickyContainer;
