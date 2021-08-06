import React from 'react';

import * as Transcripts from '@/ducks/transcript';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { Container, TranscriptHeader, TranscriptResultsList } from './components';

interface TranscriptManagerProps {
  loading?: boolean;
}

const TranscriptManager: React.FC<ConnectedTranscriptManagerProps & TranscriptManagerProps> = ({ allTranscripts }) => {
  const [hasShadow, setHasShadow] = React.useState<boolean>(false);

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

const mapStateToProps = {
  allTranscripts: Transcripts.allTranscriptsSelector,
};

type ConnectedTranscriptManagerProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(TranscriptManager) as React.FC<TranscriptManagerProps>;
