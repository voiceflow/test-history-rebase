import { withoutValue } from '@/utils/array';

import {
  ADD_GLOBAL_VARIABLE,
  REMOVE_GLOBAL_VARIABLE,
  REPLACE_GLOBAL_VARIABLES,
  SET_ACTIVE_SKILL,
  UPDATE_ACTIVE_SKILL,
  UPDATE_DIAGRAM_ID,
} from './actions';

export * from './actions';
export * from './constants';
export * from './selectors';

// reducers

export const setActiveSkillReducer = ({ payload: { skill, diagramID } }) => ({
  ...skill,
  diagramID: diagramID || skill.diagramID,
});

export const updateActiveSkillReducer = (state, { payload }) => ({
  ...state,
  ...payload,
});

export const updateDiagramIDReducer = (state, { payload: diagramID }) => ({
  ...state,
  diagramID,
});

export const addGlobalVariableReducer = (state, { payload: variable }) => ({
  ...state,
  globalVariables: [...state.globalVariables, variable],
});

export const removeGlobalVariableReducer = (state, { payload: variable }) => ({
  ...state,
  globalVariables: withoutValue(state.globalVariables, variable),
});

export const replaceGlobalVariablesReducer = (state, { payload: variables }) => ({
  ...state,
  globalVariables: variables,
});

function skillReducer(state = {}, action) {
  switch (action.type) {
    case SET_ACTIVE_SKILL:
      return setActiveSkillReducer(action);
    case UPDATE_ACTIVE_SKILL:
      return updateActiveSkillReducer(state, action);
    case UPDATE_DIAGRAM_ID:
      return updateDiagramIDReducer(state, action);
    case ADD_GLOBAL_VARIABLE:
      return addGlobalVariableReducer(state, action);
    case REMOVE_GLOBAL_VARIABLE:
      return removeGlobalVariableReducer(state, action);
    case REPLACE_GLOBAL_VARIABLES:
      return replaceGlobalVariablesReducer(state, action);
    default:
      return state;
  }
}

export default skillReducer;
