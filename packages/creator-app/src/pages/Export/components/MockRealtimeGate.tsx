import _noop from 'lodash/noop';
import React from 'react';

import { RealtimeSubscriptionContext } from '@/gates/RealtimeLoadingGate/contexts';

const MockRealtimeGate: React.FC = ({ children }) => (
  <RealtimeSubscriptionContext.Provider value={{ onUpdate: _noop as any, destroy: _noop as any, on: _noop as any }}>
    {children}
  </RealtimeSubscriptionContext.Provider>
);

export default MockRealtimeGate;
