import React from 'react';
import { useSelector } from 'react-redux';

import * as Transcripts from '@/ducks/transcript';
import { useRAF } from '@/hooks';

import { Container, TranscriptHeader, TranscriptResultsList, TranscriptsHeaderProps } from './components';

const TranscriptManager: React.OldFC<Omit<TranscriptsHeaderProps, 'hasShadow' | 'resultCount'>> = (props) => {
  const [hasShadow, setHasShadow] = React.useState<boolean>(false);

  const [scheduler] = useRAF();

  const allTranscripts = useSelector(Transcripts.allTranscriptsSelector);

  return (
    <Container>
      <TranscriptHeader {...props} resultCount={allTranscripts.length} hasShadow={hasShadow} />

      <TranscriptResultsList
        onScroll={({ currentTarget }) => scheduler(() => setHasShadow(currentTarget.scrollTop !== 0))}
        transcriptList={allTranscripts}
      />
    </Container>
  );
};

export default TranscriptManager;
