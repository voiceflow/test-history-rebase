import { Client as LoguxClient } from '@logux/client';
import { createStoreCreator } from '@logux/redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Redux from 'redux';

import { DEBUG_REALTIME } from '@/config';

import type { Middleware, State, Store } from '../types';
import { rewriteDispatch } from './dispatch';

export const composeEnhancers = composeWithDevTools({
  name: 'Voiceflow Creator',
  actionsDenylist: DEBUG_REALTIME
    ? []
    : [
        'logux/state',
        Realtime.project.awareness.updateViewers.type,
        Realtime.diagram.awareness.heartbeat.type,
        Realtime.diagram.awareness.updateLockedEntities.type,
      ],
});

export const createEnhancedStore = (rootReducer: Redux.Reducer<State>, middleware: Middleware[], realtime: LoguxClient): Store => {
  const createStore = createStoreCreator(realtime);
  const store = createStore(rootReducer, undefined, composeEnhancers(Redux.applyMiddleware(...middleware)));

  return Object.assign(store, { dispatch: rewriteDispatch(store) });
};
