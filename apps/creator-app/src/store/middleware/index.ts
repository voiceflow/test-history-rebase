import { routerMiddleware } from 'connected-react-router';
import type { History } from 'history';

import type { Middleware, Store } from '../types';
import extendMeta from './extendMeta';
import { mapMiddleware } from './utils';

const createMiddleware = (history: History, rpcMiddleware: Middleware, getStore: () => Store) => {
  const middleware = [routerMiddleware(history), ...mapMiddleware([rpcMiddleware, ...extendMeta], getStore)];

  return middleware as Middleware[];
};

export default createMiddleware;
