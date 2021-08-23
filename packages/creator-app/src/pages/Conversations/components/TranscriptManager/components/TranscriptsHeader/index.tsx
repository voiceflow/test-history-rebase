import React from 'react';

import { Container, TranscriptFilters } from './components';

interface TranscriptsHeaderProps {
  resultCount: number;
  hasShadow: boolean;
}

const TranscriptsHeader: React.FC<TranscriptsHeaderProps> = ({ resultCount, hasShadow }) => {
  return (
    <Container hasShadow={hasShadow}>
      <b>Transcripts ({resultCount})</b>
      <TranscriptFilters />
    </Container>
  );
};

export default TranscriptsHeader;
