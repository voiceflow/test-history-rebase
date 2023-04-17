import React from 'react';

import { Container, TranscriptFilters, TranscriptFiltersProps } from './components';

export interface TranscriptsHeaderProps extends TranscriptFiltersProps {
  resultCount: number;
}

const TranscriptsHeader: React.FC<TranscriptsHeaderProps> = ({ resultCount, ...props }) => (
  <Container>
    <b>Transcripts ({resultCount})</b>
    <TranscriptFilters {...props} />
  </Container>
);

export default TranscriptsHeader;
