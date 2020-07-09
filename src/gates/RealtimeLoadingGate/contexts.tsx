import React from 'react';

import { noop } from '@/utils/functional';

import { useSubscription } from './hooks';
import RealtimeSubscription from './subscription';

export const RealtimeSubscriptionContext = React.createContext<Pick<RealtimeSubscription, 'on' | 'onUpdate' | 'destroy'>>({
  destroy: noop,
  onUpdate: () => noop,
  on: noop,
});
export const { Consumer: RealtimeSubscriptionConsumer } = RealtimeSubscriptionContext;

export const RealtimeSubscriptionProvider: React.FC = ({ children }) => (
  <RealtimeSubscriptionContext.Provider value={useSubscription()}>{children}</RealtimeSubscriptionContext.Provider>
);
