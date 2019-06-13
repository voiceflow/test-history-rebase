import update from 'immutability-helper';

export const PUSH_VARIABLE = 'PUSH_VARIABLE';
export const SET_VARIABLES = 'SET_VARIABLES';

const initialState = {
  localVariables: [],
};

export default function variableReducer(state = initialState, action) {
  switch (action.type) {
    case PUSH_VARIABLE:
      return {
        ...state,
        localVariables: update(state.localVariables, { $push: [action.payload.variable] }),
      };
    case SET_VARIABLES:
      return {
        ...state,
        localVariables: action.payload.variables,
      };
    default:
      return state;
  }
}

export const pushVariable = (variable) => ({
  type: PUSH_VARIABLE,
  payload: { variable },
});

export const setVariables = (variables) => ({
  type: SET_VARIABLES,
  payload: { variables },
});
