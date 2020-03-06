import { createSuite } from '@/../test/_suite';
import * as CRUD from '@/ducks/utils/crud';

export default (Duck, state) =>
  createSuite((utils) => {
    const createState = (duckState, rootState) => ({ [Duck.STATE_KEY]: duckState, ...rootState });
    const reducerTests = (tests) => {
      it('should ignore other actions', () => {
        utils.expect(Duck.default(state, { type: '@@NOOP' })).to.eq(state);
      });

      tests({
        applyAction: (action, rootState = state) => Duck.default(rootState, action),
        expectAction: (action) => {
          const createUtils = (rootState) => ({
            get result() {
              return utils.expect(Duck.default(rootState, action));
            },
            toModify(diff) {
              const expectedState = { ...rootState, ...diff };

              this.result.to.eql(expectedState);
            },
            withState: (overrideState) => createUtils(overrideState),
          });

          return createUtils(state);
        },
      });
    };

    return {
      ...utils,
      describeReducer: (tests) =>
        describe('reducer', () => {
          it('should have initial state', () => {
            utils.expect(Duck.default(undefined, { type: '@@INIT' })).to.eq(Duck.INITIAL_STATE);
          });

          reducerTests(tests);
        }),

      describeCRUDReducer: (tests) =>
        describe('CRUD reducer', () => {
          it('should have initial state', () => {
            utils.expect(Duck.default(undefined, { type: '@@INIT' })).to.eq(CRUD.DEFAULT_STATE);
          });

          reducerTests(tests);
        }),

      describeSelectors: (tests) =>
        describe('selectors', () => {
          tests({
            createState,
            select: (selector, rootState) => selector(createState(state, rootState)),
          });
        }),

      describeSideEffects: (tests) =>
        describe('side effects', () =>
          tests({
            createState,
            stubEffect: (module, name) => {
              const effect = utils.spy();
              const stub = utils.stub(module, name).returns(effect);

              return [stub, effect];
            },
            applyEffect: async (sideEffect, rootState) => {
              const dispatch = utils.spy();
              const getState = utils.spy(() => ({ [Duck.STATE_KEY]: state, ...rootState }));

              await sideEffect(dispatch, getState);

              return {
                dispatch,
                getState,
                expectDispatch: (action) => utils.expect(dispatch).to.be.calledWithExactly(action),
              };
            },
          })),
    };
  });
