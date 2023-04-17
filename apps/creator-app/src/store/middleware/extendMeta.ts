import { AnyRecord } from '@voiceflow/common';
import { ActionCreator } from 'typescript-fsa';

import { Middleware, State } from '@/store/types';
import { extendMeta } from '@/store/utils';

export const createExtendMetaMiddleware =
  (actionCreators: ActionCreator<any>[], getMeta: (state: State) => AnyRecord): Middleware =>
  (store) =>
  (next) =>
  (action) => {
    if (actionCreators.some((actionCreator) => actionCreator.match(action))) {
      next(extendMeta(action, getMeta(store.getState())));
      return;
    }

    next(action);
  };

export default [];
