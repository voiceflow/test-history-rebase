import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import * as Session from '@/ducks/session';

import { createHandlers, createSubscription } from './subscription';

// eslint-disable-next-line import/prefer-default-export
export const useSubscription = () => {
  const tabID = useSelector(Session.tabIDSelector);
  const browserID = useSelector(Session.browserIDSelector);
  const dispatch = useDispatch();
  const store = useStore();

  const subscription = React.useMemo(() => createSubscription(tabID, browserID, dispatch), []);
  const handlers = React.useMemo(() => createHandlers(dispatch, () => store.getState()), []);

  React.useEffect(() => {
    subscription.onUpdate(async (data, otherTabID) => {
      if (data && data.type in handlers) {
        await handlers[data.type](data.payload, otherTabID);
      }
    });

    return () => subscription.destroy();
  }, []);

  return subscription;
};
