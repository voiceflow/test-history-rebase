import { status as loguxStatus } from '@logux/client';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Designer from '@/ducks/designer';
import * as Session from '@/ducks/session';
import { useAssistantSubscription, useDispatch, useFeature, useRealtimeClient, useSelector } from '@/hooks';

import WorkspaceOrProjectLoader from '../../WorkspaceOrProjectLoader';

export interface AssistantChannelSubscriptionGateProps extends React.PropsWithChildren {
  projectID: string;
  versionID: string;
  workspaceID: string;
}

const AssistantChannelSubscriptionGate: React.FC<AssistantChannelSubscriptionGateProps> = ({ workspaceID, projectID, versionID, children }) => {
  const client = useRealtimeClient();

  const httpAssistantCMS = useFeature(FeatureFlag.HTTP_ASSISTANT_CMS);
  const activeVersionID = useSelector(Session.activeVersionIDSelector)!;
  const loadEnvironment = useDispatch(Designer.Environment.effect.load);

  const isSubscribed = useAssistantSubscription({ versionID, projectID, workspaceID }, [versionID]);

  const isLoaded = isSubscribed && versionID === activeVersionID;

  const [cmsFetched, setCMSFetched] = React.useState(!httpAssistantCMS.isEnabled || isLoaded);

  React.useEffect(() => {
    if (!httpAssistantCMS.isEnabled) {
      setCMSFetched(isLoaded);

      return undefined;
    }

    if (!isLoaded) {
      setCMSFetched(false);

      return undefined;
    }

    let fetching = false;
    let shouldSync = false;

    const abortController = new AbortController();

    const fetchCMS = async () => {
      if (abortController.signal.aborted) return;

      fetching = true;

      await loadEnvironment(activeVersionID);

      fetching = false;

      if (abortController.signal.aborted) return;

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
  }, [isLoaded, httpAssistantCMS.isEnabled]);

  return (
    <LoadingGate isLoaded={isLoaded && cmsFetched} loader={<WorkspaceOrProjectLoader />} internalName={AssistantChannelSubscriptionGate.name}>
      {children}
    </LoadingGate>
  );
};

export default React.memo(AssistantChannelSubscriptionGate);
