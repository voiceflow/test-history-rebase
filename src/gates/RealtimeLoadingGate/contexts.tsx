import React from 'react';

import { noop } from '@/utils/functional';

import { useSubscription } from './hooks';
import RealtimeSubscription from './subscription';

export type RealtimeSubscriptionValue = Pick<RealtimeSubscription, 'on' | 'onUpdate' | 'destroy'>;

export const RealtimeSubscriptionContext = React.createContext<RealtimeSubscriptionValue>({
  destroy: noop,
  onUpdate: () => noop,
  on: noop,
});
export const { Consumer: RealtimeSubscriptionConsumer } = RealtimeSubscriptionContext;

export const RealtimeSubscriptionProvider: React.FC = ({ children }) => (
  <RealtimeSubscriptionContext.Provider value={useSubscription()}>{children}</RealtimeSubscriptionContext.Provider>
);
