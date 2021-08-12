import React from 'react';

import { Container, SectionTitle } from '../components';
import TranscriptActions from './TranscriptActions';

const Actions: React.FC = () => {
  return (
    <Container withBorder rightExtend>
      <SectionTitle>ACTIONS</SectionTitle>
      <TranscriptActions />
    </Container>
  );
};

export default Actions;
