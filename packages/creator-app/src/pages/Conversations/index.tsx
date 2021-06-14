import React from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';

import * as Transcript from '@/ducks/transcript';
import { connect } from '@/hocs';
import { useTeardown } from '@/hooks';
import { FILTER_TAG } from '@/pages/Conversations/constants';
import { ConnectedProps } from '@/types';

import { ConversationsContainer, TranscriptDetails, TranscriptDialog, TranscriptManager } from './components';

type ConversationProps = RouteComponentProps;

const Conversations: React.FC<ConversationProps & ConnectedConversationsProps> = ({ fetchTranscripts }) => {
  const { search } = useLocation();
  const history = useHistory();

  const getTranscripts = async () => {
    await fetchTranscripts();
  };

  React.useEffect(() => {
    getTranscripts();
  }, [search]);

  useTeardown(() => {
    const queryParams = new URLSearchParams(search);
    queryParams.delete(FILTER_TAG.TAG);
    queryParams.delete(FILTER_TAG.START_DATE);
    queryParams.delete(FILTER_TAG.END_DATE);

    history.replace({
      search: queryParams.toString(),
    });
  }, [search, history]);

  return (
    <ConversationsContainer>
      <TranscriptManager />
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
