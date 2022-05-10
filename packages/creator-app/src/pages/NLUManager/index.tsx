import React from 'react';

import { Container, Content, Sidebar } from './components';

const NLUManager: React.FC = () => {
  return (
    <Container>
      <Sidebar />
      <Content />
    </Container>
  );
};

export default NLUManager;
