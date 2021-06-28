import { createStoreCreator } from '@logux/redux';
import React from 'react';
import { Provider, ReactReduxContextValue } from 'react-redux';

import client from '@/client';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import realtimeReducer from '@/ducks/realtimeV2';
import { useFeature, useSelector } from '@/hooks';

export const RealtimeStoreContext = React.createContext<ReactReduxContextValue>(null!);

export type RealtimeLoadingGateProps = {};

const RealtimeLoadingGate: React.FC<RealtimeLoadingGateProps> = ({ children }) => {
  const userID = useSelector(Account.userIDSelector);
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const store = React.useMemo(() => {
    if (userID == null) return null;

    const realtime = client.realtime(userID);

    if (atomicActions.isEnabled) {
      realtime.start();
    }

    return createStoreCreator(realtime)(realtimeReducer);
  }, [userID]);

  return store ? (
    <Provider store={store} context={RealtimeStoreContext}>
      {children}
    </Provider>
  ) : (
    <>{children}</>
  );
};

export default RealtimeLoadingGate;
