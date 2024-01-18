import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useSelector, useVersionSubscription } from '@/hooks';

import WorkspaceOrProjectLoader from '../../WorkspaceOrProjectLoader';

export interface VersionChannelSubscriptionGateProps
  extends React.PropsWithChildren<{
    workspaceID: string;
    projectID: string;
    versionID: string;
  }> {}

const VersionChannelSubscriptionGate: React.FC<VersionChannelSubscriptionGateProps> = ({ workspaceID, projectID, versionID, children }) => {
  const activeVersionID = useSelector(Session.activeVersionIDSelector);

  const isSubscribed = useVersionSubscription({ versionID, projectID, workspaceID }, [versionID]);

  return (
    <LoadingGate
      label="Environment"
      isLoaded={isSubscribed && versionID === activeVersionID}
      component={WorkspaceOrProjectLoader}
      internalName={VersionChannelSubscriptionGate.name}
    >
      {children}
    </LoadingGate>
  );
};

export default React.memo(VersionChannelSubscriptionGate);
