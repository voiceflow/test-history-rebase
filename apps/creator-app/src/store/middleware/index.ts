import { LOGROCKET_ENABLED } from '@voiceflow/ui';
import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import LogRocket from 'logrocket';

import * as Session from '@/ducks/session';
import * as Logrocket from '@/vendors/logrocket';

import { Middleware, Store } from '../types';
import extendMeta from './extendMeta';
import { mapMiddleware } from './utils';

const createMiddleware = (history: History, rpcMiddleware: Middleware, getStore: () => Store) => {
  const middleware = [routerMiddleware(history), ...mapMiddleware([rpcMiddleware, ...extendMeta], getStore)];

  if (LOGROCKET_ENABLED) {
    middleware.push(
      LogRocket.reduxMiddleware({
        stateSanitizer: (state) => ({
          ...state,
          session: {
            ...state.session,
            token: { value: Logrocket.REDACTED },
          },
        }),
        actionSanitizer: (action) =>
          action.type === Session.SessionAction.SET_AUTH_TOKEN
            ? {
                ...action,
                payload: Logrocket.REDACTED,
              }
            : action,
      })
    );
  }

  return middleware as Middleware[];
};

export default createMiddleware;
