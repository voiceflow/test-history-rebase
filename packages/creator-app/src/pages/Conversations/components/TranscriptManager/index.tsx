import React from 'react';

import * as Transcripts from '@/ducks/transcript';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { Container, TranscriptHeader, TranscriptResultsList } from './components';

interface TranscriptManagerProps {
  loading?: boolean;
}

const TranscriptManager: React.FC<ConnectedTranscriptManagerProps & TranscriptManagerProps> = ({ allTranscripts }) => (
  <Container>
    <TranscriptHeader resultCount={allTranscripts.length} />
    <TranscriptResultsList transcriptList={allTranscripts} />
  </Container>
);

const mapStateToProps = {
  allTranscripts: Transcripts.allTranscriptsSelector,
};

type ConnectedTranscriptManagerProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(TranscriptManager) as React.FC<TranscriptManagerProps>;
