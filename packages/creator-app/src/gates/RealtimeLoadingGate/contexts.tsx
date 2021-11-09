import { Utils } from '@voiceflow/common';
import React from 'react';

import { useSubscription } from './hooks';
import RealtimeSubscription from './subscription';

export type RealtimeSubscriptionValue = Pick<RealtimeSubscription, 'on' | 'onUpdate' | 'destroy'>;

export const RealtimeSubscriptionContext = React.createContext<RealtimeSubscriptionValue>({
  destroy: Utils.functional.noop,
  onUpdate: () => Utils.functional.noop,
  on: Utils.functional.noop,
});
export const { Consumer: RealtimeSubscriptionConsumer } = RealtimeSubscriptionContext;

export const RealtimeSubscriptionProvider: React.FC = ({ children }) => (
  <RealtimeSubscriptionContext.Provider value={useSubscription()}>{children}</RealtimeSubscriptionContext.Provider>
);
