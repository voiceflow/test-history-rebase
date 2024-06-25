import type * as Realtime from '@voiceflow/realtime-sdk';

import type { CreateSimpleReducer } from '@/ducks/utils';
import { createReducerFactory } from '@/ducks/utils';

import type { CreatorState } from '../../types';

export * from './invalidators';

export const createReducer = createReducerFactory<CreatorState>();

export const createActiveDiagramReducer: CreateSimpleReducer<CreatorState, Realtime.BaseDiagramPayload> = (
  actionCreator,
  handler
) => [
  actionCreator,
  (...[state, payload, action]: Parameters<typeof handler>) => {
    if (state.activeDiagramID !== payload.diagramID) return undefined;

    return handler(state, payload, action);
  },
];
