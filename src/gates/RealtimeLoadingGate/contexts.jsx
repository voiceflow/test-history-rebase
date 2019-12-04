import React from 'react';

import { useSubscription } from './hooks';

export const RealtimeSubscriptionContext = React.createContext(null);
export const { Consumer: RealtimeSubscriptionConsumer } = RealtimeSubscriptionContext;

export const RealtimeSubscriptionProvider = ({ children }) => (
  <RealtimeSubscriptionContext.Provider value={useSubscription()}>{children}</RealtimeSubscriptionContext.Provider>
);
