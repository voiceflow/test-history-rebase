import * as Realtime from '@voiceflow/realtime-sdk';

import { RESERVED_JS_WORDS, VALID_VARIABLE_NAME } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { CanvasCreationType, VariableType } from '@/ducks/tracking/constants';
import { globalVariablesSelector as activeGlobalVariablesSelector } from '@/ducks/versionV2/selectors/active';
import { Thunk } from '@/store/types';

import { getActiveVersionContext } from '../../utils';

export const addGlobalVariable =
  (variable: string, creationType: CanvasCreationType): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const variables = activeGlobalVariablesSelector(state);

    if (!variable.match(VALID_VARIABLE_NAME)) {
      throw new Error('Variable contains invalid characters or is greater than 64 characters');
    } else if (variables.includes(variable)) {
      throw new Error(`No duplicate variables: ${variable}`);
    } else if (RESERVED_JS_WORDS.includes(variable)) {
      throw new Error("Reserved word. You can prefix with '_' to fix this issue");
    }

    await dispatch.sync(Realtime.version.addGlobalVariable({ ...getActiveVersionContext(getState()), variable }));
    dispatch(Tracking.trackVariableCreated({ creationType, variableType: VariableType.GLOBAL }));
  };

export const removeGlobalVariable =
  (variable: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.removeGlobalVariable({ ...getActiveVersionContext(getState()), variable }));
  };
