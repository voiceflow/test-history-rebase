import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { useSchemaSubscription } from '@/hooks';

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
      internalName={SchemaChannelSubscriptionGate.name}
      isLoaded={isSubscribed}
      backgroundColor="#f9f9f9"
    >
      {children}
    </LoadingGate>
  );
};

export default React.memo(SchemaChannelSubscriptionGate);
