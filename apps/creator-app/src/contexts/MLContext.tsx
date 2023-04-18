import * as Realtime from '@voiceflow/realtime-sdk';
import { useCreateConst } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import LoguxClient from '@/client/logux';
import { withFeatureGate } from '@/hocs/withFeature';
import { useLoguxSetup } from '@/hooks/logux';

export const MLContext = React.createContext<LoguxClient | null>(null);
export const { Consumer: MLConsumer } = MLContext;

const MLProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const mlClient = useCreateConst(() => client.mlGateway());

  useLoguxSetup(mlClient);

  return <MLContext.Provider value={mlClient}>{children}</MLContext.Provider>;
};

const FeatureGatedMLProvider = withFeatureGate(Realtime.FeatureFlag.NLU_MANAGER)(MLProvider);

export { FeatureGatedMLProvider as MLProvider };
