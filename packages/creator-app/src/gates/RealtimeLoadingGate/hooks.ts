import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import mutableStore from '@/store/mutable';
import { Dispatch } from '@/store/types';

import { createHandlers } from './handlers';
import RealtimeSubscription from './subscription';

// eslint-disable-next-line import/prefer-default-export
export const useSubscription = () => {
  const tabID: string = useSelector(Session.tabIDSelector);
  const dispatch = useDispatch<Dispatch>();
  const store = useStore();

  const subscription = React.useMemo(() => new RealtimeSubscription(tabID, mutableStore.setLastRealtimeTimestamp), [tabID]);

  React.useEffect(() => {
    const handlers = createHandlers(dispatch, () => store.getState());

    subscription.onUpdate(async (data, otherTabID) => {
      if (data) {
        await handlers[data.type]?.(data.payload, otherTabID);
      }
    });

    subscription?.onUsersUpdate((users) => dispatch(Realtime.updateDiagramViewers(users)));

    return () => subscription?.destroy();
  }, [tabID]);

  return subscription;
};
