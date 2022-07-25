import { AnyRecord } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ActionCreator } from 'typescript-fsa';

import { isFeatureEnabledSelector } from '@/ducks/feature';
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

const extendMetaWithAssistantIAEnabledMiddleware = createExtendMetaMiddleware([Realtime.diagram.crud.add, Realtime.diagram.crud.remove], (state) => ({
  assistantIAEnabled: isFeatureEnabledSelector(state)(Realtime.FeatureFlag.ASSISTANT_IA),
}));

export default [extendMetaWithAssistantIAEnabledMiddleware];
