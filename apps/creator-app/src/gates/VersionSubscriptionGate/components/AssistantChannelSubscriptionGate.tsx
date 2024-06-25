import { status as loguxStatus } from '@logux/client';
import React, { useRef } from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import { SearchProvider } from '@/contexts/SearchContext';
import type { DiagramNodeDatabaseMap } from '@/contexts/SearchContext/types';
import { buildSearchDatabase } from '@/contexts/SearchContext/utils';
import { Assistant, Session } from '@/ducks';
import { useAssistantSubscription, useDispatch, useRealtimeClient, useSelector } from '@/hooks';
import { useStore } from '@/hooks/store.hook';

import WorkspaceOrProjectLoader from '../../WorkspaceOrProjectLoader';

interface IAssistantChannelSubscriptionGate extends React.PropsWithChildren {
  projectID: string;
  versionID: string;
  workspaceID: string;
}

const AssistantChannelSubscriptionGate: React.FC<IAssistantChannelSubscriptionGate> = ({
  children,
  projectID,
  versionID,
  workspaceID,
}) => {
  const client = useRealtimeClient();

  const store = useStore();
  const searchDatabase = useRef<DiagramNodeDatabaseMap>({});
  const activeVersionID = useSelector(Session.activeVersionIDSelector);

  const loadCreator = useDispatch(Assistant.effect.loadCreator);

  const isSubscribed = useAssistantSubscription({ versionID, projectID, workspaceID }, [
    versionID,
    projectID,
    workspaceID,
  ]);

  const [cmsFetched, setCMSFetched] = React.useState(false);

  React.useEffect(() => {
    if (!isSubscribed) {
      setCMSFetched(false);

      return undefined;
    }

    let fetching = false;
    let shouldSync = false;

    const abortController = new AbortController();

    const fetchCMS = async () => {
      if (abortController.signal.aborted) return;

      fetching = true;

      const result = await loadCreator(versionID, abortController);

      fetching = false;

      if (abortController.signal.aborted) return;

      searchDatabase.current = buildSearchDatabase(result.diagrams, store.getState());

      setCMSFetched(true);
    };

    const unsubscribe = loguxStatus(client, async (status) => {
      shouldSync = status === 'disconnected' || shouldSync;

      if (status === 'synchronized' && shouldSync && !fetching) {
        fetchCMS();
        shouldSync = false;
      }
    });

    fetchCMS();

    return () => {
      abortController.abort();
      unsubscribe();
    };
  }, [versionID, isSubscribed]);

  return (
    <LoadingGate
      isLoaded={isSubscribed && cmsFetched && versionID === activeVersionID}
      internalName={AssistantChannelSubscriptionGate.name}
      loader={<WorkspaceOrProjectLoader />}
    >
      <SearchProvider database={searchDatabase.current}>{children}</SearchProvider>
    </LoadingGate>
  );
};

export default React.memo(AssistantChannelSubscriptionGate);
