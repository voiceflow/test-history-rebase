import React from 'react';

import type { TranscriptFiltersProps } from './components';
import { Container, TranscriptFilters } from './components';

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
