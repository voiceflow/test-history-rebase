import * as Realtime from '@voiceflow/realtime-sdk';

import * as Prototype from '@/ducks/prototype';
import { goToPrototype } from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import { getActiveVersionContext } from '@/ducks/version/utils';
import * as VersionV2 from '@/ducks/versionV2';
import { VariableValue } from '@/models';
import { Thunk } from '@/store/types';

import { updateSelectedVariableState, updateVariables } from './actions';
import { ALL_PROJECT_VARIABLES_ID } from './constants';
import {
  getVariableStateByIDSelector,
  selectedVariableStateIdSelector as getSelectedVariableStateId,
  selectedVariableStateSelector as getSelectedVariableState,
} from './selectors';

export const redirectToDiagram =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());

    if (!versionID) return;

    dispatch(Prototype.resetPrototype());
    dispatch(goToPrototype(versionID, undefined));
    dispatch(Session.setActiveDiagramID(diagramID));
  };

export const createVariableState =
  (variableState: Omit<Realtime.VariableStateData, 'projectID'>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const version = VersionV2.active.versionSelector(state);
    const projectID = Session.activeProjectIDSelector(state);

    if (!projectID || !version) return;

    const createdVariableState = await dispatch(
      waitAsync(Realtime.variableState.create, {
        ...getActiveVersionContext(state),
        variableState: { ...variableState, projectID },
      })
    );

    dispatch(updateSelectedVariableState({ id: createdVariableState.id, variables: variableState.variables }));

    await dispatch(redirectToDiagram(variableState.startFrom?.diagramID || version.rootDiagramID));
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

export const resetVariableStates = (): Thunk => async (dispatch, getState) => {
  const variables = Prototype.prototypeVariablesSelector(getState());
  dispatch(updateSelectedVariableState({ id: ALL_PROJECT_VARIABLES_ID, variables }));
};

export const updateSelectedVariableStateById =
  (variableStateID: string | null): Thunk =>
  async (dispatch, getState) => {
    const version = VersionV2.active.versionSelector(getState());

    if (!version?.rootDiagramID) return;

    if (!variableStateID) {
      await dispatch(redirectToDiagram(version.rootDiagramID));
      dispatch(updateSelectedVariableState(null));
      dispatch(Session.setPrototypeSidebarVisible(true));
      return;
    }

    const state = getState();
    const getVariableStateById = getVariableStateByIDSelector(state);
    const variableState = getVariableStateById({ id: variableStateID });
    const variables = Prototype.prototypeVariablesSelector(state);

    if (!variableState) {
      await dispatch(redirectToDiagram(version.rootDiagramID));
      dispatch(updateSelectedVariableState({ id: ALL_PROJECT_VARIABLES_ID, variables }));
      dispatch(Session.setPrototypeSidebarVisible(true));
      return;
    }

    if (variableState.startFrom?.diagramID) {
      await dispatch(redirectToDiagram(variableState.startFrom?.diagramID));
    }

    dispatch(updateSelectedVariableState({ id: variableStateID, variables: variableState.variables }));
    dispatch(Session.setPrototypeSidebarVisible(true));
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
    const selectedVariableStateId = getSelectedVariableStateId(state);

    if (variableState.startFrom?.diagramID && selectedVariableStateId === variableStateID) {
      await dispatch(redirectToDiagram(variableState.startFrom?.diagramID));
    }

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
