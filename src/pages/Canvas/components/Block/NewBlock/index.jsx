import React from 'react';

import OverflowText from '@/componentsV2/Text/OverflowText';

import { Container, Content, Header } from './components';

const NewBlock = ({ variant = 'standard', state = 'regular', name, children }) => (
  <Container variant={variant} state={state}>
    <Header variant={variant} state={state}>
      <OverflowText>{name}</OverflowText>
    </Header>
    <Content>{children}</Content>
  </Container>
);

export default NewBlock;
