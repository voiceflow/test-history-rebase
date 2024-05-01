import type { Normalize } from 'normal-store';
import { normalize } from 'normal-store';
import type { ActionCreator } from 'typescript-fsa';
import { expect } from 'vitest';

import type { AnyAction } from '@/store/types';

import type { ReduxDuck } from './redux-duck.interface';

export interface ReducerUtils<State, Payload> {
  applyAction: (state: State, payload: Payload) => State;
  normalizeContaining: Normalize;
}

export const createReducerUtilsFactory =
  <DuckState, DuckAction extends AnyAction>(Duck: ReduxDuck<DuckState, DuckAction>) =>
  <Payload>(actionCreator: ActionCreator<Payload>): ReducerUtils<DuckState, Payload> => ({
    normalizeContaining: (items: any, ...args: [] | [any]) => {
      const normal = normalize(items, ...(args as [any]));

      return {
        ...normal,
        byKey: expect.objectContaining(
          Object.fromEntries(Object.entries(normal.byKey).map(([key, value]) => [key, expect.objectContaining(value)]))
        ),
        allKeys: expect.arrayContaining(normal.allKeys),
      };
    },

    applyAction: (state, payload) => Duck.default(state, actionCreator(payload) as DuckAction),
  });
