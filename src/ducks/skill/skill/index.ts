import { Reducer, RootReducer } from '@/store/types';
import { withoutValue } from '@/utils/array';

import { SkillState } from '../types';
import {
  AddGlobalVariablesAction,
  AnySkillAction,
  RemoveGlobalVariablesAction,
  ReplaceGlobalVariablesAction,
  SetActiveSkillAction,
  SetExportingCanvasAction,
  SkillAction,
  UpdateActiveSkillAction,
  UpdateDiagramIDAction,
} from './actions';

export * from './actions';
export * from './constants';
export * from './selectors';

// reducers

export const setActiveSkillReducer: Reducer<SkillState<string>, SetActiveSkillAction> = (_, { payload: { skill, diagramID } }) =>
  ({
    ...skill,
    diagramID: diagramID || skill.diagramID,
  } as SkillState<string>);

export const updateActiveSkillReducer: Reducer<SkillState<string>, UpdateActiveSkillAction> = (state, { payload }) => ({
  ...state,
  ...payload,
});

export const updateDiagramIDReducer: Reducer<SkillState<string>, UpdateDiagramIDAction> = (state, { payload: diagramID }) => ({
  ...state,
  diagramID,
});

export const addGlobalVariableReducer: Reducer<SkillState<string>, AddGlobalVariablesAction> = (state, { payload: variable }) => ({
  ...state,
  globalVariables: [...state.globalVariables!, variable],
});

export const removeGlobalVariableReducer: Reducer<SkillState<string>, RemoveGlobalVariablesAction> = (state, { payload: variable }) => ({
  ...state,
  globalVariables: withoutValue(state.globalVariables!, variable),
});

export const replaceGlobalVariablesReducer: Reducer<SkillState<string>, ReplaceGlobalVariablesAction> = (state, { payload: variables }) => ({
  ...state,
  globalVariables: variables,
});

export const setExportingCanvasReducer: Reducer<SkillState<string>, SetExportingCanvasAction> = (state, { payload: exporting }) => ({
  ...state,
  canvasExporting: exporting,
});

const skillReducer: RootReducer<SkillState<string>, AnySkillAction> = (state = {} as any, action) => {
  switch (action.type) {
    case SkillAction.SET_ACTIVE_SKILL:
      return setActiveSkillReducer(state, action);
    case SkillAction.UPDATE_ACTIVE_SKILL:
      return updateActiveSkillReducer(state, action);
    case SkillAction.UPDATE_DIAGRAM_ID:
      return updateDiagramIDReducer(state, action);
    case SkillAction.ADD_GLOBAL_VARIABLE:
      return addGlobalVariableReducer(state, action);
    case SkillAction.REMOVE_GLOBAL_VARIABLE:
      return removeGlobalVariableReducer(state, action);
    case SkillAction.REPLACE_GLOBAL_VARIABLES:
      return replaceGlobalVariablesReducer(state, action);
    case SkillAction.SET_EXPORTING_CANVAS:
      return setExportingCanvasReducer(state, action);
    default:
      return state;
  }
};

export default skillReducer;
