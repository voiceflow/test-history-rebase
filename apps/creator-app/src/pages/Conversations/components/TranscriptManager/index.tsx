import React from 'react';
import { useSelector } from 'react-redux';

import * as Transcripts from '@/ducks/transcript';

import type { TranscriptsHeaderProps } from './components';
import { Container, TranscriptHeader, TranscriptResultsList } from './components';

const TranscriptManager: React.FC<Omit<TranscriptsHeaderProps, 'hasShadow' | 'resultCount'>> = (props) => {
  const allTranscripts = useSelector(Transcripts.allTranscriptsSelector);

  return (
    <Container>
      <TranscriptHeader {...props} resultCount={allTranscripts.length} />

      <TranscriptResultsList transcriptList={allTranscripts} />
    </Container>
  );
};

export default TranscriptManager;
