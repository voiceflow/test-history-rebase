import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import mutableStore from '@/store/mutable';
import { Dispatch } from '@/store/types';

import RealtimeSubscription from './subscription';

export const useSubscription = () => {
  const tabID: string = useSelector(Session.tabIDSelector);
  const dispatch = useDispatch<Dispatch>();

  const subscription = React.useMemo(() => new RealtimeSubscription(tabID, mutableStore.setLastRealtimeTimestamp), [tabID]);

  React.useEffect(() => {
    subscription?.onUsersUpdate((users) => dispatch(Realtime.updateDiagramViewers(users)));

    return () => subscription?.destroy();
  }, [tabID]);

  return subscription;
};
