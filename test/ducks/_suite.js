import { createSuite } from '@/../test/_suite';

export default createSuite((utils) => ({
  ...utils,

  describeReducer: (Duck, state, tests) =>
    describe('reducer', () => {
      it('should have initial state', () => {
        utils.expect(Duck.default(undefined, { type: '@@INIT' })).to.eq(Duck.INITIAL_STATE);
      });

      it('should ignore other actions', () => {
        utils.expect(Duck.default(state, { type: '@@NOOP' })).to.eq(state);
      });

      tests({
        expectDiff: (action, diff) => {
          const expectedState = { ...state, ...diff };
          utils.expect(Duck.default(state, action)).to.eql(expectedState);
        },
      });
    }),

  describeSelectors: (Duck, state, tests) =>
    describe('selectors', () =>
      tests({
        selectCurried: (selector, ...args) => () => selector({ [Duck.STATE_KEY]: state })(...args),
        select: (selector) => selector({ [Duck.STATE_KEY]: state }),
      })),

  describeSideEffects: (state, tests) =>
    describe('side effects', () =>
      tests({
        applyEffect: async (sideEffect, stateOverride) => {
          const dispatch = utils.spy();
          const getState = utils.stub().returns({ ...state, ...stateOverride });

          await sideEffect(dispatch, getState);

          return {
            dispatch,
            getState,
          };
        },
      })),
}));
