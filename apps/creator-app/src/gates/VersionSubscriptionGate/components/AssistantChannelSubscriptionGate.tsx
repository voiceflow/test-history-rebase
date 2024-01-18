import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useAssistantSubscription, useSelector } from '@/hooks';

import WorkspaceOrProjectLoader from '../../WorkspaceOrProjectLoader';

export interface AssistantChannelSubscriptionGateProps extends React.PropsWithChildren {
  projectID: string;
  versionID: string;
  workspaceID: string;
}

const AssistantChannelSubscriptionGate: React.FC<AssistantChannelSubscriptionGateProps> = ({ workspaceID, projectID, versionID, children }) => {
  const activeVersionID = useSelector(Session.activeVersionIDSelector);

  const isSubscribed = useAssistantSubscription({ versionID, projectID, workspaceID }, [versionID]);

  return (
    <LoadingGate
      label="Assistant"
      isLoaded={isSubscribed && versionID === activeVersionID}
      component={WorkspaceOrProjectLoader}
      internalName={AssistantChannelSubscriptionGate.name}
    >
      {children}
    </LoadingGate>
  );
};

export default React.memo(AssistantChannelSubscriptionGate);
