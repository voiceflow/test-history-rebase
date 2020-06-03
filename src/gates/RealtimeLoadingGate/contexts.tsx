import React from 'react';

import { RealtimeSubscription } from '@/client/socket/types';
import { noop } from '@/utils/functional';

import { useSubscription } from './hooks';

export const RealtimeSubscriptionContext = React.createContext<RealtimeSubscription>({
  destroy: noop,
  onUpdate: () => noop,
  on: noop,
});
export const { Consumer: RealtimeSubscriptionConsumer } = RealtimeSubscriptionContext;

export const RealtimeSubscriptionProvider: React.FC = ({ children }) => (
  <RealtimeSubscriptionContext.Provider value={useSubscription()}>{children}</RealtimeSubscriptionContext.Provider>
);
