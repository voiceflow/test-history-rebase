import moize from 'moize';

export const createAction = (type, payload, meta) => ({
  type,
  ...(payload !== undefined && { payload }),
  ...(meta && { meta }),
});

export const createRootSelector = (stateKey) => moize(({ [stateKey]: state }) => state);

export const createPureReducer = (reducer) => (state, action, key) => {
  if (!key) {
    return state;
  }

  const currState = state[key];
  const nextState = reducer(currState, action);

  if (nextState === currState) {
    return state;
  }

  return {
    ...state,
    [key]: nextState,
  };
};

export const compositeReducer = (core, reducers) => (state, action) =>
  Object.keys(reducers).reduce((acc, key) => {
    if (acc && acc[key]) {
      const subState = reducers[key](acc[key], action);
      if (subState !== acc[key]) {
        return {
          ...acc,
          [key]: subState,
        };
      }
    }

    return acc;
  }, core(state, action));
