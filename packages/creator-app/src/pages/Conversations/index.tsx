import { Box } from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, RouteComponentProps, useHistory, useLocation } from 'react-router-dom';

import EmptyScreen from '@/components/EmptyScreen';
import LoadingGate from '@/components/LoadingGate';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import { fetchReportTags } from '@/ducks/reportTag';
import * as Router from '@/ducks/router';
import * as Transcripts from '@/ducks/transcript';
import { fetchTranscripts } from '@/ducks/transcript';
import { useAsyncEffect, usePermission, useTeardown } from '@/hooks';
import { FILTER_TAG } from '@/pages/Conversations/constants';

import { ConversationsContainer, TranscriptDetails, TranscriptDialog, TranscriptManager } from './components';

type ConversationProps = RouteComponentProps;

const Conversations: React.FC<ConversationProps> = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [noTestRuns, setNoTestRuns] = React.useState(false);
  const [filteredReportsExist, setFilteredReportsExist] = React.useState(true);
  const allTranscripts = useSelector(Transcripts.allTranscriptsSelector);
  const [canViewConversations] = usePermission(Permission.VIEW_CONVERSATIONS);
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
    setNoTestRuns(false);

    await dispatch(fetchTranscripts());
    await dispatch(fetchReportTags());

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

  if (!canViewConversations) {
    return <Redirect to={Path.DASHBOARD} />;
  }

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

export default Conversations;
