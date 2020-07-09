import { SinonSpy, SinonStub } from 'sinon';
import { DeepPartial } from 'utility-types';

import { createSuite } from '@/../test/_suite';
import type { State } from '@/ducks/_root';
import { createAction } from '@/ducks/utils';
import * as CRUD from '@/ducks/utils/crud';
import { AnyAction, AnyThunk, RootReducer, Selector } from '@/store/types';
import { Normalized, getNormalizedByKey } from '@/utils/normalized';

type ReduxDuck<S, A extends AnyAction> = {
  default: RootReducer<S, A>;
  STATE_KEY: string;
  INITIAL_STATE?: any;
};

const INIT_ACTION: any = createAction('@@INIT');
const NOOP_ACTION: any = createAction('@@NOOP');

export default <S, A extends AnyAction>(Duck: ReduxDuck<S, A>, state: S) =>
  createSuite((utils) => {
    const createState = (duckState: S, rootState?: any) => ({ [Duck.STATE_KEY]: duckState, ...rootState });

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
      toModifyByKey(key: string, diff: S extends Normalized<infer R> ? Partial<R> : never) {
        const currValue = getNormalizedByKey<object>(rootState as any, key);
        const nextValue = getNormalizedByKey(this.rawResult as any, key);
        utils.expect(nextValue).to.eql({ ...currValue, ...diff });

        return this;
      },
      withState: (overrideState: DeepPartial<S>) => createActionUtils(overrideState, action),
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

      applyEffect: async (sideEffect: AnyThunk, rootState?: Partial<State>) => {
        const dispatch = utils.spy();
        const getState: () => any = utils.spy(() => ({ [Duck.STATE_KEY]: state, ...rootState }));
        const expectDispatch = (action: { type: string } | AnyAction | AnyThunk) => utils.expect(dispatch).to.be.calledWithExactly(action);
        const expectStubCalled = ([stub, effect]: [SinonStub, SinonSpy], ...args: any[]) => {
          expectDispatch(effect);
          utils.expect(stub).to.be.calledWithExactly(...args);
        };

        try {
          const result = await sideEffect(dispatch, getState);

          return {
            result,
            getState,
            dispatch,
            expectDispatch,
            expectStubCalled,
          };
        } catch (error) {
          return {
            error,
            getState,
            dispatch,
            expectDispatch,
            expectStubCalled,
          };
        }
      },
    };

    const testIgnoreOtherActions = () => {
      it('should ignore other actions', () => {
        utils.expect(Duck.default(state, NOOP_ACTION)).to.eq(state);
      });
    };

    return {
      ...utils,
      describeReducer: (tests: (utils: typeof reducerUtils) => void) =>
        describe('reducer', () => {
          it('should have initial state', () => {
            utils.expect(Duck.default(undefined, INIT_ACTION)).to.eq(Duck.INITIAL_STATE);
          });

          testIgnoreOtherActions();
          tests(reducerUtils);
        }),

      describeCRUDReducer: (tests?: (utils: typeof reducerUtils) => void) =>
        describe('CRUD reducer', () => {
          it('should have initial state', () => {
            utils.expect(Duck.default(undefined, INIT_ACTION)).to.eq(CRUD.INITIAL_STATE);
          });

          testIgnoreOtherActions();
          tests?.(reducerUtils);
        }),

      describeSelectors: (tests: (utils: typeof selectorUtils) => void) => describe('selectors', () => tests(selectorUtils)),

      describeSideEffects: (tests: (utils: typeof thunkUtils) => void) => describe('side effects', () => tests(thunkUtils)),
    };
  });
