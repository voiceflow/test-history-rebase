import { Eventual, Normalized, Utils } from '@voiceflow/common';
import { SinonSpy, SinonStub, stub } from 'sinon';
import { ActionCreator, AnyAction as AnyFSAction } from 'typescript-fsa';
import { DeepPartial } from 'utility-types';

import { createSuite } from '@/../test/_suite';
import type { State } from '@/ducks';
import { createAction } from '@/ducks/utils';
import { createCRUDState } from '@/ducks/utils/crud';
import { AnyAction, AnyThunk, Dispatch, Dispatchable, RootReducer, Selector, SyncThunk } from '@/store/types';

import { MOCK_STATE } from './_fixtures';

interface ReduxDuck<S, A extends AnyAction> {
  default: RootReducer<S, A>;
  STATE_KEY: string;
  INITIAL_STATE?: any;
}

const INIT_ACTION: any = createAction('@@INIT');
const NOOP_ACTION: any = createAction('@@NOOP');

export default <S, A extends AnyAction>(Duck: ReduxDuck<S, A>, state: S) =>
  createSuite((utils) => {
    const createState = (duckState: S, rootState?: any): State => ({ ...MOCK_STATE, [Duck.STATE_KEY]: duckState, ...rootState });

    const createActionUtils = (rootState: DeepPartial<S>, action: A) => ({
      get rawResult() {
        return Duck.default(rootState as S, action);
      },
      get result() {
        return utils.expect(this.rawResult);
      },
      toModify(diff: Partial<S>) {
        const expectedState = { ...rootState, ...diff };
        this.result.to.eql(expectedState);

        return this;
      },
      toNotModify() {
        this.result.to.eql(rootState);

        return this;
      },
      toModifyByKey(key: string, diff: S extends Normalized<infer R> ? Partial<R> : never) {
        const currValue = Utils.normalized.getNormalizedByKey<object>(rootState as any, key);
        const nextValue = Utils.normalized.getNormalizedByKey(this.rawResult as any, key);
        utils.expect(nextValue).to.eql({ ...currValue, ...diff });

        return this;
      },
      withState: (overrideState: DeepPartial<S>) => createActionUtils(overrideState, action),
    });

    const createDispatch = (
      handler: (dispatchable: Dispatchable) => any = Utils.functional.noop,
      loguxHandler: (key: keyof Dispatch) => (action: AnyFSAction) => any = () => Utils.functional.noop
    ) =>
      Object.assign(utils.spy(handler), {
        local: utils.spy(loguxHandler('local')),
        crossTab: utils.spy(loguxHandler('crossTab')),
        sync: utils.spy(loguxHandler('sync')),
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

      stubEffect: <T extends object>(module: T, name: keyof T): [SinonStub, SinonSpy] => {
        const effect = utils.spy();
        const stub = utils.stub(module, name).returns(effect);

        return [stub, effect];
      },

      applyEffect: async (sideEffect: AnyThunk, rootState?: DeepPartial<State>, dispatch: Dispatch = createDispatch()) => {
        const getState: () => any = utils.spy(() => ({ [Duck.STATE_KEY]: state, ...rootState }));
        const expectDispatch = (action: { type: string } | AnyAction | AnyThunk) => utils.expect(dispatch).to.be.calledWithExactly(action);
        const expectStubCalled = ([stub, effect]: [SinonStub, SinonSpy], ...args: any[]) => {
          expectDispatch(effect);
          utils.expect(stub).to.be.calledWithExactly(...args);
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

        const getState: () => any = utils.spy(() => ({ [Duck.STATE_KEY]: state, ...rootState }));
        const dispatch: Dispatch = createDispatch((dispatchable) => {
          if (typeof dispatchable === 'function') {
            return dispatchable(dispatch, getState, null as any);
          }

          const [expectedAction = null, ...restExpectedActions] = remainingActions;
          if (!expectedAction) {
            utils.expect.fail(dispatchable, null, 'unexpected action was dispatched');

            return dispatchable;
          }

          utils.expect(dispatchable).to.eql(expectedAction);
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
        const getState: () => any = utils.spy(() => ({ [Duck.STATE_KEY]: state, ...rootState }));
        const expectDispatch = (action: { type: string } | AnyAction | AnyThunk) => utils.expect(dispatch).to.be.calledWithExactly(action);

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

        utils.expect(result).to.eql(state);
      });
    };

    const testInitialState = (initialState: any, deep = false) => {
      it('should have initial state', () => {
        utils.expect(Duck.default(undefined, INIT_ACTION)).to[deep ? 'eql' : 'eq'](initialState);
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

        const result = await thunk(dispatch, getState, { log: { type: stub() } } as any);

        return { dispatch, dispatched, result };
      },
    });

    const describeEffectV2 = <A extends any[], R>(
      sideEffect: (...args: A) => SyncThunk<Eventual<R>>,
      name: string,
      tests: (utils: EffectUtilsV2<A, R>) => void
    ) => describe(`${name} side effect`, () => tests(createEffectUtilsV2(sideEffect)));

    // reducer utils v2

    interface ReducerUtilsV2<P> {
      applyAction: (state: S, payload: P) => S;
    }

    const createReducerUtilsV2 = <P>(actionCreator: ActionCreator<P>): ReducerUtilsV2<P> => ({
      applyAction: (state, payload) => Duck.default(state, actionCreator(payload) as A),
    });

    const describeReducerV2 = <P>(actionCreator: ActionCreator<P>, tests: (utils: ReducerUtilsV2<P>) => void) =>
      describe(`"${actionCreator.type}" reducer`, () => tests(createReducerUtilsV2(actionCreator)));

    // assertions

    const assertIgnoresOtherActions = () =>
      it('ignores other actions', () => {
        const result = Duck.default(state, NOOP_ACTION);

        utils.expect(result).to.eq(state);
      });

    const assertInitialState = (initialState: S) =>
      it('has initial state', () => {
        const result = Duck.default(undefined, NOOP_ACTION);

        utils.expect(result).to.eq(initialState);
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
    };
  });
