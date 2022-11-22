import { Eventual, Utils } from '@voiceflow/common';
import { Normalize, normalize, Normalized } from 'normal-store';
import { Action, ActionCreator, AnyAction as AnyFSAction } from 'typescript-fsa';
import { DeepPartial } from 'utility-types';
import { SpyInstance } from 'vitest';

import { createSuite } from '@/../test/_suite';
import client from '@/client';
import type { State } from '@/ducks';
import { ActionReverter, createAction } from '@/ducks/utils';
import { createCRUDState } from '@/ducks/utils/crud';
import { AnyAction, AnyThunk, Dispatch, Dispatchable, RootReducer, Selector, SyncThunk } from '@/store/types';

import { MOCK_STATE } from './_fixtures';

interface ReduxDuck<S, A extends AnyAction> {
  default: RootReducer<S, A>;
  STATE_KEY: string;
  INITIAL_STATE?: any;
  reverters?: ActionReverter<any>[];
}

const INIT_ACTION: any = createAction('@@INIT');
const NOOP_ACTION: any = createAction('@@NOOP');

export default <S, A extends AnyAction>(Duck: ReduxDuck<S, A>, state: S) =>
  createSuite(() => {
    const createState = (duckState: S, rootState?: any): State => ({ ...MOCK_STATE, [Duck.STATE_KEY]: duckState, ...rootState });

    const createActionUtils = (rootState: DeepPartial<S>, action: A) => ({
      get rawResult() {
        return Duck.default(rootState as S, action);
      },

      get result() {
        return expect(this.rawResult);
      },

      toModify(diff: Partial<S>) {
        const expectedState = { ...rootState, ...diff };
        this.result.toEqual(expectedState);

        return this;
      },

      toNotModify() {
        this.result.toEqual(rootState);

        return this;
      },

      toModifyByKey(key: string, diff: S extends Normalized<infer R> ? Partial<R> : never) {
        const currValue = Utils.normalized.getNormalizedByKey<object>(rootState as any, key);
        const nextValue = Utils.normalized.getNormalizedByKey(this.rawResult as any, key);

        expect(nextValue).toEqual({ ...currValue, ...diff });

        return this;
      },

      withState: (overrideState: DeepPartial<S>) => createActionUtils(overrideState, action),
    });

    const createDispatch = (
      handler: (dispatchable: Dispatchable) => any = Utils.functional.noop,
      loguxHandler: (key: keyof Dispatch) => (action: AnyFSAction) => any = () => Utils.functional.noop
    ): Dispatch =>
      Object.assign(vi.fn(handler), {
        local: vi.fn(loguxHandler('local')),
        crossTab: vi.fn(loguxHandler('crossTab')),
        sync: vi.fn(loguxHandler('sync')),
        partialSync: vi.fn(loguxHandler('partialSync')),
        getNodeID: () => 'mockNodeID',
      });

    const reducerUtils = {
      applyAction: (action: A, rootState = state) => Duck.default(rootState, action),

      expectAction: (action: A) => createActionUtils(state as DeepPartial<S>, action),
    };

    const selectorUtils = {
      createState,

      select: <T extends Selector<any>>(selector: T, rootState?: any): ReturnType<T> => selector(createState(state, rootState)),
    };

    const thunkUtils = {
      createState,

      applyEffect: async (sideEffect: AnyThunk, rootState?: DeepPartial<State>, dispatch: Dispatch = createDispatch()) => {
        const getState: () => any = vi.fn(() => ({ [Duck.STATE_KEY]: state, ...rootState }));
        const expectDispatch = (action: { type: string } | AnyAction | AnyThunk | SpyInstance) => expect(dispatch).toBeCalledWith(action);
        const expectStubCalled = ([stub, effect]: [SpyInstance, SpyInstance], ...args: any[]) => {
          expectDispatch(effect);
          expect(stub).toBeCalledWith(...args);
        };

        const result = await sideEffect(dispatch as any, getState, {} as any);

        return {
          result,
          getState,
          dispatch: dispatch as ReturnType<typeof createDispatch>,
          expectDispatch,
          expectStubCalled,
        };
      },

      expectEffect: async (sideEffect: AnyThunk, expectedActions: AnyAction[], rootState?: DeepPartial<State>) => {
        let remainingActions = [...expectedActions];

        const getState: () => any = vi.fn(() => ({ [Duck.STATE_KEY]: state, ...rootState }));
        const dispatch: Dispatch = createDispatch((dispatchable) => {
          if (typeof dispatchable === 'function') {
            return dispatchable(dispatch, getState, null as any);
          }

          const [expectedAction = null, ...restExpectedActions] = remainingActions;
          if (!expectedAction) {
            throw new Error('unexpected action was dispatched');

            return dispatchable;
          }

          expect(dispatchable).toEqual(expectedAction);
          remainingActions = restExpectedActions;

          return dispatchable;
        });

        const result = await sideEffect(dispatch as any, getState, {} as any);

        return {
          result,
          getState,
          dispatch: dispatch as ReturnType<typeof createDispatch>,
        };
      },

      catchEffect: async (sideEffect: AnyThunk, rootState?: Partial<State>) => {
        const dispatch = createDispatch();
        const getState: () => any = vi.fn(() => ({ [Duck.STATE_KEY]: state, ...rootState }));
        const expectDispatch = (action: { type: string } | AnyAction | AnyThunk) => expect(dispatch).toBeCalledWith(action);

        try {
          await sideEffect(dispatch, getState, {} as any);

          throw Error('should have thrown an error');
        } catch (error) {
          return { error, expectDispatch };
        }
      },
    };

    const testIgnoreOtherActions = () => {
      it('should ignore other actions', () => {
        const result = Duck.default(state, NOOP_ACTION);

        expect(result).toEqual(state);
      });
    };

    const testInitialState = (initialState: any, deep = false) => {
      it('should have initial state', () => {
        expect(Duck.default(undefined, INIT_ACTION))[deep ? 'toEqual' : 'toBe'](initialState);
      });
    };

    const describeReducer: {
      (tests: (utils: typeof reducerUtils) => void): void;
      (initialState: any, tests: (utils: typeof reducerUtils) => void): void;
    } = (testsOrInitialState: any, maybeTests?: (utils: typeof reducerUtils) => void) => {
      const tests = maybeTests || testsOrInitialState;
      const initialState = maybeTests ? testsOrInitialState : Duck.INITIAL_STATE;

      return describe('reducer', () => {
        testInitialState(initialState, !!maybeTests);
        testIgnoreOtherActions();
        tests(reducerUtils);
      });
    };

    // thunk utils v2

    interface EffectUtilsV2<A extends any[], R> {
      applyEffect: (
        state: State,
        ...args: A
      ) => Promise<{
        dispatch: ReturnType<typeof createDispatch>;
        dispatched: (AnyAction | Partial<Record<keyof Dispatch, AnyFSAction>>)[];
        result: R;
      }>;
    }

    const createEffectUtilsV2 = <A extends any[], R>(sideEffect: (...args: A) => SyncThunk<Eventual<R>>): EffectUtilsV2<A, R> => ({
      applyEffect: async (state: State, ...args: A) => {
        const dispatched: (AnyAction | Partial<Record<keyof Dispatch, AnyFSAction>>)[] = [];
        const getState = () => state;
        const dispatch = createDispatch(
          (dispatchable) => {
            if (typeof dispatchable === 'function') {
              return dispatchable(dispatch, getState, {} as any);
            }

            dispatched.push(dispatchable as AnyAction);

            return dispatchable;
          },
          (key) => (action) => {
            dispatched.push({ [key]: action });
          }
        );
        const thunk = sideEffect(...args);

        const result = await thunk(dispatch, getState, { log: { type: vi.fn() }, client: { type: vi.fn() } } as any);

        return { dispatch, dispatched, result };
      },
    });

    const describeEffectV2 = <A extends any[], R>(
      sideEffect: (...args: A) => SyncThunk<Eventual<R>>,
      name: string,
      tests: (utils: EffectUtilsV2<A, R>) => void
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

        tests(createEffectUtilsV2(sideEffect));
      });

    // reducer utils v2

    interface ReducerUtilsV2<P> {
      applyAction: (state: S, payload: P) => S;
      normalizeContaining: Normalize;
    }

    const createReducerUtilsV2 = <P>(actionCreator: ActionCreator<P>): ReducerUtilsV2<P> => ({
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

      applyAction: (state, payload) => Duck.default(state, actionCreator(payload) as A),
    });

    const describeReducerV2 = <P>(actionCreator: ActionCreator<P>, tests: (utils: ReducerUtilsV2<P>) => void) =>
      describe(`"${actionCreator.type}" reducer`, () => tests(createReducerUtilsV2(actionCreator)));

    // reverter utils

    interface ReverterUtils<P> {
      revertAction: (rootState: State, payload: P) => Action<any> | Action<any>[] | undefined;
      expectToInvalidate: (origin: Action<P>, subject: AnyFSAction) => void;
      expectToIgnore: (origin: Action<P>, subject: AnyFSAction) => void;
    }

    const createReverterUtils = <P>(actionCreator: ActionCreator<P>): ReverterUtils<P> => {
      const checkInvalidate = (origin: Action<P>, subject: AnyFSAction) => {
        const reverter = Duck.reverters?.find((reverter) => reverter.actionCreator.match(subject));

        expect(reverter).toBeTruthy();

        const invalidator = reverter?.invalidators.find((invalidator) => invalidator.actionCreator.match(subject));

        expect(invalidator).toBeTruthy();

        return !!invalidator?.invalidate(origin, subject);
      };

      return {
        revertAction: (rootState, payload) => {
          const reverter = Duck.reverters?.find((reverter) => reverter.actionCreator === actionCreator);

          if (!reverter) {
            throw new Error(`should register a reverter for the ${actionCreator.type} action`);
          }

          return reverter?.revert(payload, () => rootState);
        },

        expectToInvalidate: (origin, subject) => {
          return expect(checkInvalidate(origin, subject)).toBeTruthy();
        },

        expectToIgnore: (origin, subject) => {
          return expect(checkInvalidate(origin, subject)).toBeFalsy();
        },
      };
    };

    const describeReverter = <P>(actionCreator: ActionCreator<P>, tests: (utils: ReverterUtils<P>) => void) =>
      describe(`"${actionCreator.type}" reverter`, () => tests(createReverterUtils(actionCreator)));

    // assertions

    const assertIgnoresOtherActions = () =>
      it('ignores other actions', () => {
        const result = Duck.default(state, NOOP_ACTION);

        expect(result).toBe(state);
      });

    const assertInitialState = (initialState: S) =>
      it('has initial state', () => {
        const result = Duck.default(undefined, NOOP_ACTION);

        expect(result).toBe(initialState);
      });

    return {
      createState,

      assertIgnoresOtherActions,
      assertInitialState,

      describeReducer,
      describeReducerV2,

      describeCRUDReducer: (tests?: (utils: typeof reducerUtils) => void) =>
        describe('CRUD reducer', () => {
          testInitialState(createCRUDState(), true);
          testIgnoreOtherActions();
          tests?.(reducerUtils);
        }),

      describeSelectors: (tests: (utils: typeof selectorUtils) => void) => describe('selectors', () => tests(selectorUtils)),

      describeSideEffects: (tests: (utils: typeof thunkUtils) => void) => describe('side effects', () => tests(thunkUtils)),
      describeEffectV2,

      describeReverter,
    };
  });
