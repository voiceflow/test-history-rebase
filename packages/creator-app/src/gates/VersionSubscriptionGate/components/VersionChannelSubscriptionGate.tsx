import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useSelector, useVersionSubscription } from '@/hooks';

import { PROJECT_LOADING_GATE_LABEL } from '../constants';

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
      label={PROJECT_LOADING_GATE_LABEL}
      internalName={VersionChannelSubscriptionGate.name}
      isLoaded={isSubscribed && versionID === activeVersionID}
      backgroundColor="#f9f9f9"
    >
      {children}
    </LoadingGate>
  );
};

export default React.memo(VersionChannelSubscriptionGate);
