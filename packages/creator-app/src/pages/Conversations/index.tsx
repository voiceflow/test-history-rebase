import { Box } from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';

import EmptyScreen from '@/components/EmptyScreen';
import LoadingGate from '@/components/LoadingGate';
import { Path } from '@/config/routes';
import { fetchReportTags } from '@/ducks/reportTag';
import { fetchTranscripts } from '@/ducks/transcript';
import * as Transcripts from '@/ducks/transcript';
import { connect } from '@/hocs';
import { useAsyncEffect, useTeardown } from '@/hooks';
import { FILTER_TAG } from '@/pages/Conversations/constants';
import { ConnectedProps } from '@/types';

import { ConversationsContainer, TranscriptDetails, TranscriptDialog, TranscriptManager } from './components';

type ConversationProps = RouteComponentProps;

const Conversations: React.FC<ConnectedConversationProps & ConversationProps> = ({ allTranscripts }) => {
  const [loadingData, setLoadingData] = React.useState(true);
  const [noTestRuns, setNoTestRuns] = React.useState(false);
  const location = useLocation();

  // TODO: placeholder for filtered reports result
  const filteredReports = true;
  const dispatch = useDispatch();

  const { search } = useLocation();
  const history = useHistory();

  useTeardown(() => {
    const queryParams = new URLSearchParams(search);
    queryParams.delete(FILTER_TAG.TAG);
    queryParams.delete(FILTER_TAG.RANGE);
    queryParams.delete(FILTER_TAG.START_DATE);
    queryParams.delete(FILTER_TAG.END_DATE);
    history.replace({
      search: queryParams.toString(),
    });
  }, [search, history]);

  const loadReports = async () => {
    dispatch(fetchTranscripts());
    dispatch(fetchReportTags());
    setLoadingData(false);
  };

  React.useEffect(() => {
    const queryParams = queryString.parse(location.search);
    const tags = queryParams[FILTER_TAG.TAG];
    const range = queryParams[FILTER_TAG.RANGE];
    const startDate = queryParams[FILTER_TAG.START_DATE];
    const endDate = queryParams[FILTER_TAG.END_DATE];
    const noFilters = !tags && !range && !startDate && !endDate;

    if (noFilters && !allTranscripts) {
      setNoTestRuns(true);
    }
  }, [loadingData]);

  useAsyncEffect(async () => {
    const queryParams = queryString.stringify(queryString.parse(location.search));

    dispatch(fetchTranscripts(queryParams));
    setLoadingData(false);
  }, [search]);

  return (
    <ConversationsContainer isFilteredResultsEmpty={filteredReports}>
      <LoadingGate isLoaded={!loadingData} label="Conversations" load={loadReports}>
        {!noTestRuns ? (
          <>
            <TranscriptManager loading={loadingData} />
            {filteredReports ? (
              <>
                <TranscriptDialog />
                <TranscriptDetails />
              </>
            ) : (
              <Box flex={4}>
                <EmptyScreen
                  title="No reports exist"
                  body="No reports exist with the current filters applied"
                  buttonText="Clear Filters"
                  link={Path.CONVERSATIONS}
                />
              </Box>
            )}
          </>
        ) : (
          <EmptyScreen
            title="No conversations exist"
            body="Save a test, or share your assistant with sharable links to access the conversations."
            buttonText="Go to Test"
            link={Path.PROJECT_PROTOTYPE}
          />
        )}
      </LoadingGate>
    </ConversationsContainer>
  );
};

const mapStateToProps = {
  allTranscripts: Transcripts.allTranscriptsSelector,
};

type ConnectedConversationProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Conversations) as React.FC<ConversationProps>;
