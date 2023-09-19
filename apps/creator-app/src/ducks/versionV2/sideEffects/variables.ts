import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui-next';

import { RESERVED_JS_WORDS, VALID_VARIABLE_NAME } from '@/constants';
import { projectConfigSelector as activeProjectConfigSelector } from '@/ducks/projectV2/selectors/active';
import * as Tracking from '@/ducks/tracking';
import { CanvasCreationType, VariableType } from '@/ducks/tracking/constants';
import { Thunk } from '@/store/types';

import { globalVariablesSelector as activeGlobalVariablesSelector } from '../selectors/active';
import { getActiveVersionContext } from '../utils';

const validateVariableName = (name: string, variables: string[]) => {
  let error = null;
  if (!name.match(VALID_VARIABLE_NAME)) {
    error = 'Variable contains invalid characters or is greater than 64 characters';
  } else if (variables.includes(name)) {
    error = `Variable '${name}' already exists`;
  } else if (RESERVED_JS_WORDS.includes(name)) {
    error = "Reserved word. You can prefix with '_' to fix this issue";
  }
  return error;
};

export const addGlobalVariable =
  (variable: string, creationType: CanvasCreationType): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const config = activeProjectConfigSelector(state);
    const variables = activeGlobalVariablesSelector(state);

    const error = validateVariableName(variable, [...config.project.globalVariables, ...variables]);

    if (error) {
      throw new Error(error);
    }

    await dispatch.sync(Realtime.version.variable.addManyGlobal({ ...getActiveVersionContext(getState()), variables: [variable] }));

    dispatch(Tracking.trackVariableCreated({ creationType, variableType: VariableType.GLOBAL }));
  };

export const addManyGlobalVariables =
  (newVariables: string[], creationType: CanvasCreationType): Thunk<string[]> =>
  async (dispatch, getState) => {
    const state = getState();
    const config = activeProjectConfigSelector(state);
    const variables = activeGlobalVariablesSelector(state);

    const validNewVariables: string[] = [];

    Utils.array.unique(newVariables).forEach((variable) => {
      const error = validateVariableName(variable, [...config.project.globalVariables, ...variables]);

      if (error) {
        toast.error(`${variable}: ${error}`);
      } else {
        validNewVariables.push(variable);
      }
    });

    if (!validNewVariables.length) {
      throw new Error('No valid variables to create');
    }

    await dispatch.sync(Realtime.version.variable.addManyGlobal({ ...getActiveVersionContext(getState()), variables: validNewVariables }));

    dispatch(Tracking.trackVariableCreated({ creationType, variableType: VariableType.GLOBAL }));

    return validNewVariables;
  };

export const removeGlobalVariable =
  (variable: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.variable.removeGlobal({ ...getActiveVersionContext(getState()), variable }));
  };

export const removeGlobalVariables =
  (variables: string[]): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.variable.removeManyGlobal({ ...getActiveVersionContext(getState()), variables }));
  };
