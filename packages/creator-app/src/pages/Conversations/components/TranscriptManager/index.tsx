import React from 'react';
import { useSelector } from 'react-redux';

import * as Transcripts from '@/ducks/transcript';

import { Container, TranscriptHeader, TranscriptResultsList } from './components';

interface TranscriptManagerProps {
  loading?: boolean;
}

const TranscriptManager: React.FC<TranscriptManagerProps> = () => {
  const [hasShadow, setHasShadow] = React.useState<boolean>(false);
  const allTranscripts = useSelector(Transcripts.allTranscriptsSelector);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLElement>) => {
    setHasShadow(e.currentTarget.scrollTop !== 0);
  }, []);

  return (
    <Container>
      <TranscriptHeader resultCount={allTranscripts.length} hasShadow={hasShadow} />
      <TranscriptResultsList transcriptList={allTranscripts} onScroll={handleScroll} />
    </Container>
  );
};

export default TranscriptManager;
