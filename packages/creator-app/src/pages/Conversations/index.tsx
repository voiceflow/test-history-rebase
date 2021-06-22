import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';

import { fetchReportTags } from '@/ducks/reportTag';
import { fetchTranscripts } from '@/ducks/transcript';
import { useAsyncEffect, useTeardown } from '@/hooks';
import { FILTER_TAG } from '@/pages/Conversations/constants';

import { ConversationsContainer, TranscriptDetails, TranscriptDialog, TranscriptManager } from './components';

type ConversationProps = RouteComponentProps;

const Conversations: React.FC<ConversationProps> = () => {
  const [loadingData, setLoadingData] = React.useState(true);
  const dispatch = useDispatch();

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
    dispatch(fetchTranscripts());
    dispatch(fetchReportTags());
    setLoadingData(false);
  }, [search]);

  return (
    <ConversationsContainer>
      <TranscriptManager loading={loadingData} />
      <TranscriptDialog />
      <TranscriptDetails />
    </ConversationsContainer>
  );
};

export default Conversations;
