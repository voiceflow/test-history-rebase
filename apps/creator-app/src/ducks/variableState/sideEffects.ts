import { SystemVariable } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { parseVariableDefaultValue } from '@voiceflow/utils-designer';

import * as Errors from '@/config/errors';
import * as Designer from '@/ducks/designer';
import * as Diagram from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype/sideEffects';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import * as VersionV2 from '@/ducks/versionV2';
import { getActiveVersionContext } from '@/ducks/versionV2/utils';
import { Store, VariableValue } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';

import { updateSelectedVariableState, updateVariables } from './actions';
import { ALL_PROJECT_VARIABLES_ID } from './constants';
import { getVariableStateByIDSelector, selectedVariableStateSelector } from './selectors';

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

    dispatch(updateSelectedVariableState(createdVariableState));
    dispatch(Prototype.resetPrototype());
  };

export const updateSelectedVariableStateVariables =
  (variables: Record<string, VariableValue>): Thunk =>
  async (dispatch) => {
    dispatch(updateVariables({ ...variables }));
  };

export const updateSelectedVariableStateById =
  (variableStateID: string | null): Thunk =>
  async (dispatch, getState) => {
    dispatch(Session.setPrototypeSidebarVisible(true));

    if (!variableStateID || variableStateID === ALL_PROJECT_VARIABLES_ID) {
      dispatch(defaultVariableState());
    } else {
      const state = getState();
      const variableState = getVariableStateByIDSelector(state)({ id: variableStateID });

      dispatch(updateSelectedVariableState(variableState));
    }

    dispatch(Prototype.resetPrototype());
  };

export const updateStateValues = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const selectedState = selectedVariableStateSelector(state);
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

    const selectedVariableStateID = selectedVariableStateSelector(state)?.id;

    await dispatch.sync(
      Realtime.variableState.crud.remove({ ...getActiveVersionContext(state), key: variableStateID })
    );

    if (selectedVariableStateID === variableStateID) {
      dispatch(updateSelectedVariableState(null));
    }
  };

// set variable state to current diagram and specific node
export const currentDiagramVariableState =
  (nodeID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const diagramID = Session.activeDiagramIDSelector(state);
    Errors.assertDiagramID(diagramID);

    dispatch(applyVariableState(nodeID, diagramID));
  };

// go to the closest diagram with a start step
export const defaultVariableState = (): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const referenceSystemEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.REFERENCE_SYSTEM);

  const blockNodeResourceByNodeIDMapByDiagramIDMap =
    Designer.Reference.selectors.blockNodeResourceByNodeIDMapByDiagramIDMap(state);

  const getStartNodeID = (diagramID: string) =>
    Object.values(blockNodeResourceByNodeIDMapByDiagramIDMap[diagramID] ?? {}).find(
      (resource) => resource?.metadata.nodeType === Realtime.BlockType.START
    )?.resourceID;

  const sharedNodesStartIDSelector = referenceSystemEnabled
    ? getStartNodeID
    : Diagram.sharedNodesStartIDSelector(state);

  const activeDiagramID = Session.activeDiagramIDSelector(state);

  Errors.assertDiagramID(activeDiagramID);

  const activeDiagramStartNodeID = sharedNodesStartIDSelector(activeDiagramID);

  if (activeDiagramStartNodeID) {
    dispatch(applyVariableState(activeDiagramStartNodeID, activeDiagramID));
    return;
  }

  const rootDiagramID = VersionV2.active.rootDiagramIDSelector(state);

  Errors.assertDiagramID(rootDiagramID);

  const rootDiagramStartNodeID = sharedNodesStartIDSelector(rootDiagramID) || Realtime.START_NODE_ID;
  dispatch(applyVariableState(rootDiagramStartNodeID, rootDiagramID));
};

export const applyVariableState =
  (stepID: string, diagramID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const platform = ProjectV2.active.platformSelector(state);
    const projectID = Session.activeProjectIDSelector(state);
    const entitiesAndVariables = Diagram.active.allEntitiesAndVariablesSelector(state);

    const cmsVariablesMapByName = Designer.Variable.selectors.mapByName(state);

    let variables: Store = {};

    entitiesAndVariables.forEach((entityOrVar) => {
      const variable = cmsVariablesMapByName[entityOrVar.name];

      variables[entityOrVar.name] = variable ? parseVariableDefaultValue(variable.name, variable) ?? 0 : 0;
    });

    variables = {
      ...variables,
      [SystemVariable.USER_ID]: 'TEST_USER',
      [SystemVariable.PLATFORM]: platform,
      [SystemVariable.SESSIONS]: 1,
      [SystemVariable.TIMESTAMP]: 0,
      [SystemVariable.INTENT_CONFIDENCE]: 0,
      [SystemVariable.LAST_UTTERANCE]: '',
      [SystemVariable.LAST_RESPONSE]: '',
    };

    Errors.assertProjectID(projectID);
    Errors.assertDiagramID(diagramID);

    dispatch(
      updateSelectedVariableState({
        id: ALL_PROJECT_VARIABLES_ID,
        name: 'Default',
        projectID,
        startFrom: { stepID, diagramID },
        variables,
      })
    );
  };

// if no variable state exists, apply new state
export const initializeVariableState = (): Thunk => async (dispatch, getState) => {
  const selectedVariableState = selectedVariableStateSelector(getState());
  if (!selectedVariableState) {
    dispatch(defaultVariableState());
  }
};
