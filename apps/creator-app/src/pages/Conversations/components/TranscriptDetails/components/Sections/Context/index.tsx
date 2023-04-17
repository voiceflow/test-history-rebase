import React from 'react';

import { Container } from '../components';
import TranscriptContext from './TranscriptContext';

const Context: React.FC = () => {
  return (
    <Container withBorder withBackground topExtend>
      <TranscriptContext />
    </Container>
  );
};

export default Context;
