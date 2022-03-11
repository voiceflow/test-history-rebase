import * as Realtime from '@voiceflow/realtime-sdk';

import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { VariableValue } from '@/models';
import { Thunk } from '@/store/types';

import { updateSelectedVariableState, updateVariables } from './actions';
import { ALL_PROJECT_VARIABLES_ID } from './constants';
import {
  getVariableStateByIDSelector,
  selectedVariableStateIdSelector as getSelectedVariableStateId,
  selectedVariableStateSelector as getSelectedVariableState,
} from './selectors';

export const createVariableState =
  (variableState: Omit<Realtime.VariableStateData, 'projectID'>): Thunk<Realtime.VariableState | undefined> =>
  async (dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);

    if (!projectID) return undefined;

    return dispatch(
      waitAsync(Realtime.variableState.create, {
        ...getActiveVersionContext(state),
        variableState: { ...variableState, projectID },
      })
    );
  };

export const updateSelectedVariableStateVariables =
  (variable: Record<string, VariableValue>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const selectedVariableStateId = getSelectedVariableStateId(state);

    if (selectedVariableStateId === ALL_PROJECT_VARIABLES_ID) {
      dispatch(Prototype.updateVariables({ ...variable }));
    }

    dispatch(updateVariables({ ...variable }));
  };

export const updateSelectedVariableStateById =
  (variableStateID: string | null): Thunk =>
  async (dispatch, getState) => {
    if (!variableStateID) {
      dispatch(updateSelectedVariableState(null));
      return;
    }

    const state = getState();
    const getVariableStateById = getVariableStateByIDSelector(state);
    const variableState = getVariableStateById({ id: variableStateID });
    const variables = Prototype.prototypeVariablesSelector(state);

    if (!variableState) {
      dispatch(updateSelectedVariableState({ id: ALL_PROJECT_VARIABLES_ID, variables }));
    } else {
      dispatch(updateSelectedVariableState({ id: variableStateID, variables: variableState.variables }));
    }
  };

export const updateStateValues = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const selectedState = getSelectedVariableState(state);
  const getVariableStateById = getVariableStateByIDSelector(state);

  if (!selectedState?.id) return;

  const variableState = getVariableStateById({ id: selectedState.id });
  const newVariableState = { ...variableState, variables: selectedState?.variables };

  await dispatch.sync(
    Realtime.variableState.crud.patch({
      ...getActiveVersionContext(state),
      key: selectedState.id,
      value: newVariableState,
    })
  );
};

export const updateState =
  (variableStateID: string, variableState: Partial<Realtime.VariableState>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(
      Realtime.variableState.crud.patch({
        ...getActiveVersionContext(state),
        key: variableStateID,
        value: variableState,
      })
    );
  };

export const deleteState =
  (variableStateID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const selectedVariableStateId = getSelectedVariableStateId(state);

    await dispatch.sync(Realtime.variableState.crud.remove({ ...getActiveVersionContext(state), key: variableStateID }));

    if (selectedVariableStateId === variableStateID) {
      dispatch(updateSelectedVariableState(null));
    }
  };
