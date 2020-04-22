import React from 'react';

import { RealtimeSubscription } from '@/client/socket/types';

import { useSubscription } from './hooks';

export const RealtimeSubscriptionContext = React.createContext<RealtimeSubscription | null>(null);
export const { Consumer: RealtimeSubscriptionConsumer } = RealtimeSubscriptionContext;

export const RealtimeSubscriptionProvider: React.FC = ({ children }) => (
  <RealtimeSubscriptionContext.Provider value={useSubscription()}>{children}</RealtimeSubscriptionContext.Provider>
);
