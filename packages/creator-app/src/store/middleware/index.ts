import { LOGROCKET_ENABLED, Vendors } from '@voiceflow/ui';
import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import LogRocket from 'logrocket';

import * as Session from '@/ducks/session';

import { Middleware, Store } from '../types';
import creatorMiddleware from './creator';
import { mapMiddleware } from './utils';

const createMiddleware = (history: History, rpcMiddleware: Middleware, getStore: () => Store) => {
  const middleware = [routerMiddleware(history), ...mapMiddleware([rpcMiddleware, ...creatorMiddleware], getStore)];

  if (LOGROCKET_ENABLED) {
    middleware.push(
      LogRocket.reduxMiddleware({
        stateSanitizer: (state) => ({
          ...state,
          session: {
            ...state.session,
            token: { value: Vendors.LogRocket.REDACTED },
          },
        }),
        actionSanitizer: (action) =>
          action.type === Session.SessionAction.SET_AUTH_TOKEN
            ? {
                ...action,
                payload: Vendors.LogRocket.REDACTED,
              }
            : action,
      })
    );
  }

  return middleware as Middleware[];
};

export default createMiddleware;
