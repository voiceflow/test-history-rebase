import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import * as Session from '@/ducks/session';
import { Dispatch } from '@/store/types';

import { createHandlers, createSubscription } from './subscription';

// eslint-disable-next-line import/prefer-default-export
export const useSubscription = () => {
  const tabID: string = useSelector(Session.tabIDSelector);
  const browserID: string = useSelector(Session.browserIDSelector);
  const dispatch = useDispatch<Dispatch>();
  const store = useStore();

  const subscription = React.useMemo(() => createSubscription(tabID, browserID, dispatch), []);
  const handlers = React.useMemo(() => createHandlers(dispatch, () => store.getState()), []);

  React.useEffect(() => {
    subscription.onUpdate(async (data, otherTabID) => {
      if (data) {
        await handlers[data.type]?.(data.payload, otherTabID);
      }
    });

    return () => subscription.destroy();
  }, []);

  return subscription;
};
