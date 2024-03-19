import { Utils } from '@voiceflow/common';
import { Box, useSessionStorageState } from '@voiceflow/ui';
import { TabLoader } from '@voiceflow/ui-next';
import queryString from 'query-string';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';

import EmptyScreen from '@/components/EmptyScreen';
import { LoadingGate } from '@/components/LoadingGate';
import { PROTOTYPING } from '@/config/documentation';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as ReportTag from '@/ducks/reportTag';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Transcripts from '@/ducks/transcript';
import { useAsyncDidUpdate, useDispatch, usePermission, useTeardown, useTrackingEvents } from '@/hooks';
import { FilterTag } from '@/pages/Conversations/constants';
import ProjectPage from '@/pages/Project/components/ProjectPage';
import { Identifier } from '@/styles/constants';

import { ConversationsContainer, TranscriptDetails, TranscriptDialog, TranscriptManager } from './components';
import { useFilters } from './hooks';

const PREVIOUS_TRANSCRIPT_ID_KEY = 'previous-transcript-id-key';
const PREVIOUS_TRANSCRIPT_FILTER_KEY = 'previous-transcript-filter-key';

const Conversations: React.FC = () => {
  const history = useHistory();

  const [trackingEvents] = useTrackingEvents();
  const [canViewConversations] = usePermission(Permission.VIEW_CONVERSATIONS);

  const allTranscripts = useSelector(Transcripts.allTranscriptsSelector);
  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const currentTranscriptID = useSelector(Transcripts.currentTranscriptIDSelector);

  const goToPrototype = useDispatch(Router.goToCurrentPrototype);
  const goToTranscript = useDispatch(Router.goToTargetTranscript);
  const fetchReportTags = useDispatch(ReportTag.fetchReportTags);
  const fetchTranscripts = useDispatch(Transcripts.fetchTranscripts);
  const resetTranscripts = useDispatch(Transcripts.resetTranscripts);

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [lastFilter, setLastFilter] = useSessionStorageState(`${PREVIOUS_TRANSCRIPT_FILTER_KEY}-${activeProjectID}`, '');
  const [lastTranscriptID, setLastTranscriptID] = useSessionStorageState(`${PREVIOUS_TRANSCRIPT_ID_KEY}-${activeProjectID}`, '');

  const { tags, personas, range, query, endDate, startDate, queryParams } = useFilters();

  const loadTranscripts = async () => {
    // do not applying last filters if we opening the transcript by url
    const [, transcripts] = await Promise.all([fetchReportTags(), fetchTranscripts(query ?? (!currentTranscriptID ? lastFilter : ''))]);

    const currentTranscript = transcripts.find(({ id }) => id === currentTranscriptID);
    const firstTranscriptID = transcripts[0]?.id;

    // if there's search query in the url but transcript is not found - redirect to the first transcript if it exists
    if (query && !currentTranscript && firstTranscriptID) {
      goToTranscript(firstTranscriptID);
      // if there's no search query and no transcriptID in the url - redirect to the last/first transcript if it exists
      // this allows opening transcripts by the url
    } else if (!query && !currentTranscriptID) {
      history.replace({ search: lastFilter });

      const lastTranscript = transcripts.find(({ id }) => id === lastTranscriptID);
      const nextID = lastTranscript?.id ?? firstTranscriptID;

      if (nextID) {
        goToTranscript(nextID);
      }
    }

    setIsLoaded(true);

    trackingEvents.trackConversationSessionStarted();
  };

  useAsyncDidUpdate(async () => {
    const transcripts = await fetchTranscripts(query);

    if (transcripts[0]?.id) {
      goToTranscript(transcripts[0].id);
    }
  }, [tags, personas, range, endDate, startDate]);

  useTeardown(() => {
    setLastFilter(query);
    resetTranscripts();

    if (currentTranscriptID) {
      setLastTranscriptID(currentTranscriptID);
    }

    history.replace({ search: queryString.stringify(Utils.object.omit(queryParams, Object.values(FilterTag))) });
  }, [query, queryParams, currentTranscriptID]);

  const hasFilter = !!tags?.length || !!range || !!startDate || !!endDate || !!personas.length;

  const noTestRuns = !hasFilter && !allTranscripts.length;
  const filteredReportsExist = hasFilter && !!allTranscripts.length;

  if (!canViewConversations) return <Redirect to={Path.DASHBOARD} />;

  return (
    <ProjectPage>
      <ConversationsContainer id={Identifier.CONVERSATIONS_PAGE} isFilteredResultsEmpty={!filteredReportsExist}>
        <LoadingGate internalName={Conversations.name} isLoaded={isLoaded} load={loadTranscripts} loader={<TabLoader variant="dark" />}>
          {!noTestRuns ? (
            <>
              <TranscriptManager tags={tags} range={range} endDate={endDate} startDate={startDate} personas={personas} />

              {allTranscripts.length ? (
                <>
                  <TranscriptDialog />
                  <TranscriptDetails />
                </>
              ) : (
                <Box flex={4}>
                  <EmptyScreen
                    id={Identifier.EMPTY_REPORTS_CONTAINER}
                    body="No transcripts exist with the current filters applied."
                    title="No Transcripts Found"
                    onClick={() => history.replace({ search: '' })}
                    buttonText="Clear Filters"
                    documentation={PROTOTYPING}
                  />
                </Box>
              )}
            </>
          ) : (
            <EmptyScreen
              id={Identifier.EMPTY_TRANSCRIPTS_CONTAINER}
              body="Review conversations from your assistant. Save tests or share a prototype to generate reviewable conversations."
              title="No transcripts exist"
              buttonText="Test Assistant"
              onClick={goToPrototype}
            />
          )}
        </LoadingGate>
      </ConversationsContainer>
    </ProjectPage>
  );
};

export default Conversations;
