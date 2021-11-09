import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { RESERVED_JS_WORDS, VALID_VARIABLE_NAME } from '@/constants';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { globalVariablesSelector as activeGlobalVariablesSelector } from '@/ducks/versionV2/selectors/active';
import { Thunk } from '@/store/types';

import { crud } from '../../actions';
import { getActiveVersionContext } from '../../utils';

/**
 * @deprecated global variable changes are synchronized by the new realtime system
 */
export const saveGlobalVariables = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const variables = activeGlobalVariablesSelector(state);
  const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

  if (isAtomicActions) return;

  Errors.assertVersionID(versionID);

  await client.api.version.update(versionID, { variables });
};

export const addGlobalVariable =
  (variable?: string | null): Thunk =>
  async (dispatch, getState) => {
    if (!variable) {
      return;
    }

    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const variables = activeGlobalVariablesSelector(state);

    if (!variable.match(VALID_VARIABLE_NAME)) {
      throw new Error('Variable contains invalid characters or is greater than 16 characters');
    } else if (variables.includes(variable)) {
      throw new Error(`No duplicate variables: ${variable}`);
    } else if (RESERVED_JS_WORDS.includes(variable)) {
      throw new Error("Reserved word. You can prefix with '_' to fix this issue");
    }

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          Errors.assertVersionID(versionID);

          dispatch(crud.patch(versionID, { variables: [...variables, variable] }));
        },
        async (context) => {
          await dispatch.sync(Realtime.version.addGlobalVariable({ ...context, variable }));
        }
      )
    );
  };

export const removeGlobalVariable =
  (variable: string): Thunk =>
  (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const state = getState();
          const versionID = Session.activeVersionIDSelector(state);
          const variables = activeGlobalVariablesSelector(state);

          Errors.assertVersionID(versionID);

          dispatch(crud.patch(versionID, { variables: Utils.array.withoutValue(variables, variable) }));
        },
        async (context) => {
          await dispatch.sync(Realtime.version.removeGlobalVariable({ ...context, variable }));
        }
      )
    );

/**
 * @deprecated global variable changes are synchronized by the new realtime system
 */
export const replaceGlobalVariables =
  (variables: string[], meta?: object): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) return;

    Errors.assertVersionID(versionID);

    dispatch(crud.patch(versionID, { variables }, meta));
  };
