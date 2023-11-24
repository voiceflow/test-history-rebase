import { LOGROCKET_ENABLED } from '@voiceflow/ui';
import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';

import client from '@/client';

import { Middleware, Store } from '../types';
import extendMeta from './extendMeta';
import { mapMiddleware } from './utils';

const createMiddleware = (history: History, rpcMiddleware: Middleware, getStore: () => Store) => {
  const middleware = [routerMiddleware(history), ...mapMiddleware([rpcMiddleware, ...extendMeta], getStore)];

  if (LOGROCKET_ENABLED) {
    middleware.push(client.log.middleware());
  }

  return middleware as Middleware[];
};

export default createMiddleware;
