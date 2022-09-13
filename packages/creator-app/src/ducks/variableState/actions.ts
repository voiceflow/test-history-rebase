import * as Realtime from '@voiceflow/realtime-sdk';

import { createAction } from '@/ducks/utils';
import { createCRUDActionCreators } from '@/ducks/utils/crud';
import { VariableValue } from '@/models';
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

export enum VariableStateAction {
  UPDATE_SELECTED_STATE = 'VARIABLE_STATE:UPDATE_SELECTED_STATE',
  UPDATE_VARIABLES = 'VARIABLE_STATE:UPDATE_VARIABLES',
}

export type UpdateSelectedVariableState = Action<VariableStateAction.UPDATE_SELECTED_STATE, Realtime.VariableState | null>;

export type UpdateVariables = Action<VariableStateAction.UPDATE_VARIABLES, Record<string, VariableValue>>;

export type SelectedStateActions = UpdateSelectedVariableState | UpdateVariables;

export const updateSelectedVariableState = (selectedVariableState: Realtime.VariableState | null): UpdateSelectedVariableState =>
  createAction(VariableStateAction.UPDATE_SELECTED_STATE, selectedVariableState);

export const updateVariables = (variables: Record<string, VariableValue>): UpdateVariables =>
  createAction(VariableStateAction.UPDATE_VARIABLES, variables);
