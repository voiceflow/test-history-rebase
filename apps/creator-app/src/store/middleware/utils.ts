import type * as Redux from 'redux';

import type { State } from '@/ducks';

import type { AnyAction, Dispatch, Middleware, MiddlewareAPI, Store } from '../types';
import { wrapDispatch } from '../utils';

export const createIgnoreMiddleware =
  (shouldIgnore: (api: MiddlewareAPI, action: AnyAction) => boolean): Middleware =>
  (api) =>
  (next) =>
  (action) => {
    if (shouldIgnore(api, action)) {
      return;
    }

    next(action);
  };

export const mapMiddleware = (middleware: Middleware[], getStore: () => Store) =>
  middleware.map(
    (callback): Redux.Middleware<{}, State, Dispatch> =>
      (api) =>
        callback({
          getState: api.getState,
          dispatch: wrapDispatch(getStore),
        })
  );
