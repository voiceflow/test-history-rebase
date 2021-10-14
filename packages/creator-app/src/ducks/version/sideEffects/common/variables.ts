import client from '@/client';
import * as Errors from '@/config/errors';
import { RESERVED_JS_WORDS, VALID_VARIABLE_NAME } from '@/constants';
import * as Session from '@/ducks/session';
import { SyncThunk, Thunk } from '@/store/types';
import { withoutValue } from '@/utils/array';

import { replaceLocalVariables } from '../../actions';
import { activeGlobalVariablesSelector } from '../../selectors';

export const saveGlobalVariables = (): Thunk => async (_, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const variables = activeGlobalVariablesSelector(state);

  Errors.assertVersionID(versionID);

  await client.api.version.update(versionID, { variables });
};

export const addGlobalVariable =
  (variable?: string | null): SyncThunk =>
  (dispatch, getState) => {
    if (!variable) {
      return;
    }

    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const variables = activeGlobalVariablesSelector(state);

    Errors.assertVersionID(versionID);

    if (!variable.match(VALID_VARIABLE_NAME)) {
      throw new Error('Variable contains invalid characters or is greater than 16 characters');
    } else if (variables.includes(variable)) {
      throw new Error(`No duplicate variables: ${variable}`);
    } else if (RESERVED_JS_WORDS.includes(variable)) {
      throw new Error(`Reserved word. You can prefix with '_' to fix this issue`);
    }

    dispatch(replaceLocalVariables(versionID, [...variables, variable]));
  };

export const removeGlobalVariable =
  (variable: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const variables = activeGlobalVariablesSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(replaceLocalVariables(versionID, withoutValue(variables, variable)));
  };

export const replaceGlobalVariables =
  (variables: string[], meta?: object): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(replaceLocalVariables(versionID, variables, meta));
  };
