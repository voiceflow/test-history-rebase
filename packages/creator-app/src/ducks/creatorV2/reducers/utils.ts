import * as Realtime from '@voiceflow/realtime-sdk';

import { CreateReducer, createReducerFactory } from '@/ducks/utils';

import { CreatorState } from '../types';

export const createReducer = createReducerFactory<CreatorState>();

export const createActiveDiagramReducer: CreateReducer<CreatorState, Realtime.BaseDiagramPayload> = (actionCreator, handler) =>
  [
    actionCreator,
    (...[state, payload]: Parameters<typeof handler>) => {
      if (state.activeDiagramID !== payload.diagramID) return;

      return handler(state, payload);
    },
  ] as any;
