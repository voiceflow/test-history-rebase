import type { Eventual } from '@voiceflow/common';
import type { ActionCreator } from 'typescript-fsa';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import client from '@/client';
import type { State } from '@/ducks';
import { MOCK_STATE } from '@/ducks/state.fixture';
import { createAction } from '@/ducks/utils';
import type { AnyAction, Selector, SyncThunk } from '@/store/types';

import { createEffectUtils, type EffectUtils } from './effect.utils';
import { createReducerUtilsFactory, type ReducerUtils } from './reducer.utils';
import type { ReduxDuck } from './redux-duck.interface';
import type { ReverterUtils } from './reverter.utils';
import { createReverterUtilsFactory } from './reverter.utils';

const NOOP_ACTION: any = createAction('@@NOOP');

export const createDuckTools = <DuckState, DuckAction extends AnyAction>(
  Duck: ReduxDuck<DuckState, DuckAction>,
  state: DuckState
) => {
  const createState = (duckState: DuckState, rootState?: any): State => ({
    ...MOCK_STATE,
    [Duck.STATE_KEY]: duckState,
    ...rootState,
  });

  const selectorUtils = {
    createState,

    select: <T extends Selector<any>>(selector: T, rootState?: any): ReturnType<T> =>
      selector(createState(state, rootState)),
  };

  // reducer

  const createReducerUtils = createReducerUtilsFactory(Duck);

  const describeReducer = <Payload>(
    actionCreator: ActionCreator<Payload>,
    tests: (utils: ReducerUtils<DuckState, Payload>) => void
  ) => describe(`"${actionCreator.type}" reducer`, () => tests(createReducerUtils(actionCreator)));

  // effect

  const describeEffect = <A extends any[], R>(
    sideEffect: (...args: A) => SyncThunk<Eventual<R>>,
    name: string,
    tests: (utils: EffectUtils<A, R>) => void
  ) =>
    describe(`${name} side effect`, () => {
      beforeEach(() => {
        vi.spyOn(client.api, 'analytics', 'get').mockReturnValue({
          flush: vi.fn(),
          track: vi.fn(),
          identify: vi.fn(),
          trackPublic: vi.fn(),
          setBatching: vi.fn(),
          identifyWorkspace: vi.fn(),
        } as any);
      });

      tests(createEffectUtils(sideEffect));
    });

  // selectors

  const describeSelectors = (tests: (utils: typeof selectorUtils) => void) =>
    describe('selectors', () => tests(selectorUtils));

  // reverter

  const createReverterUtils = createReverterUtilsFactory(Duck);

  const describeReverter = <Payload>(
    actionCreator: ActionCreator<Payload>,
    tests: (utils: ReverterUtils<Payload>) => void
  ) => describe(`"${actionCreator.type}" reverter`, () => tests(createReverterUtils(actionCreator)));

  // assertions

  const assertIgnoresOtherActions = () =>
    it('ignores other actions', () => {
      const result = Duck.default(state, NOOP_ACTION);

      expect(result).toBe(state);
    });

  const assertInitialState = (initialState: DuckState) =>
    it('has initial state', () => {
      const result = Duck.default(undefined, NOOP_ACTION);

      expect(result).toBe(initialState);
    });

  return {
    createState,

    describeReducer,
    describeEffect,
    describeSelectors,
    describeReverter,

    assertIgnoresOtherActions,
    assertInitialState,
  };
};
