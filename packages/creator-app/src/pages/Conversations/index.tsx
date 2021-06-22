import React from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';

import * as Transcript from '@/ducks/transcript';
import { connect } from '@/hocs';
import { useAsyncEffect, useTeardown } from '@/hooks';
import { FILTER_TAG } from '@/pages/Conversations/constants';
import { ConnectedProps } from '@/types';

import { ConversationsContainer, TranscriptDetails, TranscriptDialog, TranscriptManager } from './components';

type ConversationProps = RouteComponentProps;

const Conversations: React.FC<ConversationProps & ConnectedConversationsProps> = ({ fetchTranscripts }) => {
  const [loadingTranscripts, setLoadingTranscripts] = React.useState(true);

  const { search } = useLocation();
  const history = useHistory();

  useTeardown(() => {
    const queryParams = new URLSearchParams(search);
    queryParams.delete(FILTER_TAG.TAG);
    queryParams.delete(FILTER_TAG.START_DATE);
    queryParams.delete(FILTER_TAG.END_DATE);
    history.replace({
      search: queryParams.toString(),
    });
  }, [search, history]);

  useAsyncEffect(async () => {
    await fetchTranscripts();
    setLoadingTranscripts(false);
  }, [search]);

  return (
    <ConversationsContainer>
      <TranscriptManager loading={loadingTranscripts} />
      <TranscriptDialog />
      <TranscriptDetails />
    </ConversationsContainer>
  );
};

const mapStateToProps = {};
const mapDispatchToProps = {
  fetchTranscripts: Transcript.fetchTranscripts,
};

type ConnectedConversationsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
