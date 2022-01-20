import { createAction } from '@/ducks/utils';
import { createCRUDActionCreators } from '@/ducks/utils/crud';
import { Action } from '@/store/types';

import { STATE_KEY } from './constants';

const {
  add: addVariableState,
  addMany: addVariableStates,
  remove: removeVariableState,
  replace: replaceVariableStates,
  update: updateVariableState,
  patch: patchVariableState,
} = createCRUDActionCreators(STATE_KEY);

export { addVariableState, addVariableStates, patchVariableState, removeVariableState, replaceVariableStates, updateVariableState };

export type UpdateSelectedVariableState = Action<VariableStateAction.UPDATE_SELECTED_ID, string | null>;

export enum VariableStateAction {
  UPDATE_SELECTED_ID = 'UPDATE_SELECTED_ID',
}

export const updateSelectedVariableStateId = (variableStateId: string): UpdateSelectedVariableState =>
  createAction(VariableStateAction.UPDATE_SELECTED_ID, variableStateId);
