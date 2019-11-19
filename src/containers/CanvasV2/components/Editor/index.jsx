import React from 'react';

import { Container, Content, Footer, Header } from './components';

export * from './components';

const Editor = ({ path, controls, children }) => (
  <Container>
    <Header path={path} />
    <Content>{children}</Content>
    <Footer>{controls}</Footer>
  </Container>
);

export default Editor;
