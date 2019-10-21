import React from 'react';

import { StepMenuProvider } from '@/containers/Designer/contexts';

import { Container, Header, Overlay } from './components';

const Block = ({ title, children }) => (
  <StepMenuProvider>
    <Container column tabIndex={-1}>
      <Header>{title}</Header>
      {children}
      <Overlay />
    </Container>
  </StepMenuProvider>
);

export default Block;
