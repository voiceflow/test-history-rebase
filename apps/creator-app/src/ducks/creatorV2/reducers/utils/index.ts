import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducerFactory, CreateSimpleReducer } from '@/ducks/utils';

import { CreatorState } from '../../types';

export * from './invalidators';

export const createReducer = createReducerFactory<CreatorState>();

export const createActiveDiagramReducer: CreateSimpleReducer<CreatorState, Realtime.BaseDiagramPayload> = (actionCreator, handler) => [
  actionCreator,
  (...[state, payload, action]: Parameters<typeof handler>) => {
    if (state.activeDiagramID !== payload.diagramID) return undefined;

    return handler(state, payload, action);
  },
];
