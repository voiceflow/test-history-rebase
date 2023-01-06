import React from 'react';

import { Container, SectionTitle } from '../components';
import TranscriptNotes from './TranscriptNotes';

const Notes: React.OldFC = () => {
  return (
    <Container curved style={{ flex: 1 }}>
      <SectionTitle>NOTES</SectionTitle>

      <TranscriptNotes />
    </Container>
  );
};

export default Notes;
