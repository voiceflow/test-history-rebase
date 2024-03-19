import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import { useSchemaSubscription } from '@/hooks';

import WorkspaceOrProjectLoader from '../../WorkspaceOrProjectLoader';

export interface SchemaChannelSubscriptionGateProps
  extends React.PropsWithChildren<{
    versionID: string;
  }> {}

const SchemaChannelSubscriptionGate: React.FC<SchemaChannelSubscriptionGateProps> = ({ versionID, children }) => {
  const isSubscribed = useSchemaSubscription({ versionID });

  return (
    <LoadingGate isLoaded={isSubscribed} loader={<WorkspaceOrProjectLoader />} internalName={SchemaChannelSubscriptionGate.name}>
      {children}
    </LoadingGate>
  );
};

export default React.memo(SchemaChannelSubscriptionGate);
