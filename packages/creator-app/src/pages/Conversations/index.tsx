import { Box, useSessionStorageState, useSetup } from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';
import { useSelector } from 'react-redux';
import { matchPath, Redirect, RouteComponentProps, useHistory, useLocation } from 'react-router-dom';

import EmptyScreen from '@/components/EmptyScreen';
import LoadingGate from '@/components/LoadingGate';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import { fetchReportTags } from '@/ducks/reportTag';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Transcripts from '@/ducks/transcript';
import { fetchTranscripts } from '@/ducks/transcript';
import { useDispatch, usePermission, useTeardown, useTrackingEvents } from '@/hooks';
import { FILTER_TAG } from '@/pages/Conversations/constants';
import { Identifier } from '@/styles/constants';

import { ConversationsContainer, TranscriptDetails, TranscriptDialog, TranscriptManager } from './components';

const PREVIOUS_TRANSCRIPT_ID_KEY = 'previous-transcript-id-key';
const PREVIOUS_TRANSCRIPT_FILTER_KEY = 'previous-transcript-filter-key';

type ConversationProps = RouteComponentProps;

const Conversations: React.FC<ConversationProps> = () => {
  const [trackingEvents] = useTrackingEvents();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [noTestRuns, setNoTestRuns] = React.useState(false);
  const [filteredReportsExist, setFilteredReportsExist] = React.useState(true);
  const allTranscripts = useSelector(Transcripts.allTranscriptsSelector);
  const [canViewConversations] = usePermission(Permission.VIEW_CONVERSATIONS);
  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const activeTranscriptID = useSelector(Transcripts.currentTranscriptIDSelector);
  const location = useLocation();
  const updateTranscriptsList = useDispatch(fetchTranscripts);
  const goToPrototype = useDispatch(Router.goToCurrentPrototype);
  const goToTranscript = useDispatch(Router.goToTargetTranscript);
  const fetchTags = useDispatch(fetchReportTags);

  const [lastTranscriptID, setLastTranscriptID] = useSessionStorageState(`${PREVIOUS_TRANSCRIPT_ID_KEY}-${activeProjectID}`, '');
  const [lastFilter, setLastFilter] = useSessionStorageState(`${PREVIOUS_TRANSCRIPT_FILTER_KEY}-${activeProjectID}`, '');

  const match = matchPath(location.pathname, { path: '/project/:versionID/transcripts' });
  const noUrlTranscriptTarget = match?.isExact;

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
    const queryParams = queryString.stringify(queryString.parse(lastFilter));

    await fetchTags();
    const transcripts = await updateTranscriptsList(queryParams || '');
    if (noUrlTranscriptTarget) {
      if (lastTranscriptID) {
        goToTranscript(lastTranscriptID);
      } else if (transcripts.length) {
        goToTranscript(transcripts[0].id);
      }
    }

    setIsLoaded(true);
    trackingEvents.trackConversationSessionStarted();
  };

  useSetup(() => {
    if (lastFilter) {
      const queryParams = queryString.stringify(queryString.parse(lastFilter));
      history.replace({
        search: queryParams.toString(),
      });
    }
  }, []);

  useTeardown(() => {
    setLastFilter(search || '');

    if (activeTranscriptID) {
      setLastTranscriptID(activeTranscriptID);
    }
  }, [activeTranscriptID, search]);

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

  if (!canViewConversations) {
    return <Redirect to={Path.DASHBOARD} />;
  }

  return (
    <ConversationsContainer id={Identifier.CONVERSATIONS_PAGE} isFilteredResultsEmpty={filteredReportsExist}>
      <LoadingGate label="Conversations" internalName={Conversations.name} isLoaded={isLoaded} load={loadReports}>
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
                  id={Identifier.EMPTY_REPORTS_CONTAINER}
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
            id={Identifier.EMPTY_TRANSCRIPTS_CONTAINER}
            title="No conversations exist"
            body="Save a test, or share your assistant with sharable links to access the conversations."
            buttonText="Go to Test"
            onClick={goToPrototype}
          />
        )}
      </LoadingGate>
    </ConversationsContainer>
  );
};

export default Conversations;
