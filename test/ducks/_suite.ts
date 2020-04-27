import { SinonSpy, SinonStub } from 'sinon';
import { DeepPartial } from 'utility-types';

import { createSuite } from '@/../test/_suite';
import type { State } from '@/ducks/_root';
import { createAction } from '@/ducks/utils';
import * as CRUD from '@/ducks/utils/crud';
import { AnyAction, AnyThunk, RootReducer, Selector } from '@/store/types';

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

    const reducerUtils = {
      applyAction: (action: A, rootState = state) => Duck.default(rootState, action),

      expectAction: (action: A) => {
        const createUtils = (rootState: DeepPartial<S>) => ({
          get result() {
            return utils.expect(Duck.default(rootState as S, action));
          },
          toModify(diff: Partial<S>) {
            const expectedState = { ...rootState, ...diff };
            this.result.to.eql(expectedState);
          },
          withState: (overrideState: DeepPartial<S>) => createUtils(overrideState),
        });

        return createUtils(state as DeepPartial<S>);
      },
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

        try {
          const result = await sideEffect(dispatch, getState);

          return {
            result,
            getState,
            dispatch,
            expectDispatch,
          };
        } catch (error) {
          return {
            error,
            getState,
            dispatch,
            expectDispatch,
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
