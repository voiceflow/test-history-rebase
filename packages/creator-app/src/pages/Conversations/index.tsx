import { Box } from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';

import EmptyScreen from '@/components/EmptyScreen';
import LoadingGate from '@/components/LoadingGate';
import { fetchReportTags } from '@/ducks/reportTag';
import * as Router from '@/ducks/router';
import * as Transcripts from '@/ducks/transcript';
import { fetchTranscripts } from '@/ducks/transcript';
import { connect } from '@/hocs';
import { useAsyncEffect, useTeardown } from '@/hooks';
import { FILTER_TAG } from '@/pages/Conversations/constants';
import { ConnectedProps } from '@/types';

import { ConversationsContainer, TranscriptDetails, TranscriptDialog, TranscriptManager } from './components';

type ConversationProps = RouteComponentProps;

const Conversations: React.FC<ConnectedConversationProps & ConversationProps> = ({ allTranscripts }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [noTestRuns, setNoTestRuns] = React.useState(false);
  const [filteredReportsExist, setFilteredReportsExist] = React.useState(true);

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

    setNoTestRuns(false);
    setIsLoaded(true);
  };

  React.useEffect(() => {
    const queryParams = queryString.parse(search);
    const tags = queryParams[FILTER_TAG.TAG];
    const range = queryParams[FILTER_TAG.RANGE];
    const startDate = queryParams[FILTER_TAG.START_DATE];
    const endDate = queryParams[FILTER_TAG.END_DATE];
    const noFilters = !tags && !range && !startDate && !endDate;

    if (allTranscripts.length) {
      setFilteredReportsExist(true);
      setNoTestRuns(false);
    } else {
      noFilters ? setNoTestRuns(true) : setFilteredReportsExist(false);
    }
  }, [allTranscripts]);

  useAsyncEffect(async () => {
    const queryParams = queryString.stringify(queryString.parse(search));

    dispatch(fetchTranscripts(queryParams || ''));

    setNoTestRuns(false);
  }, [search]);

  return (
    <ConversationsContainer isFilteredResultsEmpty={filteredReportsExist}>
      <LoadingGate isLoaded={isLoaded} label="Conversations" load={loadReports}>
        {!noTestRuns ? (
          <>
            <TranscriptManager />
            {filteredReportsExist ? (
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
                  onClick={() => history.replace({ search: '' })}
                />
              </Box>
            )}
          </>
        ) : (
          <EmptyScreen
            title="No conversations exist"
            body="Save a test, or share your assistant with sharable links to access the conversations."
            buttonText="Go to Test"
            onClick={() => dispatch(Router.goToCurrentPrototype())}
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
