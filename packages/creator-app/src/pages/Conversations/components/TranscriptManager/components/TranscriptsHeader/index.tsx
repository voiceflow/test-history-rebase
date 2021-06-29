import React from 'react';

import { Container, TranscriptFilters } from './components';

interface TranscriptsHeaderProps {
  resultCount: number;
}

const TranscriptsHeader = ({ resultCount }: TranscriptsHeaderProps) => {
  return (
    <Container>
      <b>Conversations ({resultCount})</b>
      <TranscriptFilters></TranscriptFilters>
    </Container>
  );
};

export default TranscriptsHeader;
