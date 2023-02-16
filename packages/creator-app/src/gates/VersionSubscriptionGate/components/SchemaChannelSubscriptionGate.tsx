import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { useSchemaSubscription } from '@/hooks';

import WorkspaceOrProjectLoader from '../../WorkspaceOrProjectLoader';
import { PROJECT_LOADING_GATE_LABEL } from '../constants';

export interface SchemaChannelSubscriptionGateProps
  extends React.PropsWithChildren<{
    versionID: string;
  }> {}

const SchemaChannelSubscriptionGate: React.FC<SchemaChannelSubscriptionGateProps> = ({ versionID, children }) => {
  const isSubscribed = useSchemaSubscription({ versionID });

  return (
    <LoadingGate
      label={PROJECT_LOADING_GATE_LABEL}
      isLoaded={isSubscribed}
      component={WorkspaceOrProjectLoader}
      internalName={SchemaChannelSubscriptionGate.name}
    >
      {children}
    </LoadingGate>
  );
};

export default React.memo(SchemaChannelSubscriptionGate);
