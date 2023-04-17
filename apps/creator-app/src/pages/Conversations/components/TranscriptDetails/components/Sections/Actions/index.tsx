import React from 'react';

import { SectionTitle } from '../components';
import { Container } from './components';
import TranscriptActions from './TranscriptActions';

const Actions: React.FC = () => (
  <Container>
    <SectionTitle>ACTIONS</SectionTitle>
    <TranscriptActions />
  </Container>
);

export default Actions;
