import React from 'react';

import { Container, TranscriptFilters, TranscriptFiltersProps } from './components';

export interface TranscriptsHeaderProps extends TranscriptFiltersProps {
  hasShadow: boolean;
  resultCount: number;
}

const TranscriptsHeader: React.OldFC<TranscriptsHeaderProps> = ({ hasShadow, resultCount, ...props }) => (
  <Container hasShadow={hasShadow}>
    <b>Transcripts ({resultCount})</b>
    <TranscriptFilters {...props} />
  </Container>
);

export default TranscriptsHeader;
