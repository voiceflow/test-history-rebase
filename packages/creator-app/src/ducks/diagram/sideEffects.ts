import { DiagramType } from '@voiceflow/api-sdk';
import { Adapters } from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as Feature from '@/ducks/feature';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { activeRootDiagramIDSelector } from '@/ducks/version/selectors';
import { DBDiagram, Diagram } from '@/models';
import mutableStore from '@/store/mutable';
import { SyncThunk, Thunk } from '@/store/types';
import { append, unique, withoutValue } from '@/utils/array';
import { getCurrentTimestamp } from '@/utils/time';

import { addDiagram, replaceDiagrams, replaceLocalVariables, updateDiagram } from './actions';
import { generateDefaultComponentDiagram, generateDefaultTopicDiagram } from './constants';
import { allDiagramsSelector, fullActiveDiagramSelector, localVariablesByDiagramIDSelector } from './selectors';
import { PrimitiveComponentDiagram, PrimitiveTopicDiagram } from './types';

// side effects

export const loadDiagrams =
  (versionID: string, rootDiagramID: string): Thunk<Diagram[]> =>
  async (dispatch) => {
    const dbDiagrams = await client.api.version.getDiagrams<DBDiagram>(versionID, ['_id', 'type', 'name', 'variables', 'children', 'intentStepIDs']);

    const diagrams = Adapters.diagramAdapter.mapFromDB(dbDiagrams, { rootDiagramID });

    dispatch(replaceDiagrams(diagrams));

    return diagrams;
  };

// TODO: no longer need to load diagram variables individually in the future
export const loadLocalVariables =
  (diagramID: string): Thunk<string[]> =>
  async (dispatch) => {
    const fields = ['variables'] as const;

    const { variables } = await client.api.diagram.get<Pick<Diagram, typeof fields[number]>>(diagramID, fields);

    dispatch(replaceLocalVariables(diagramID, variables));

    return variables;
  };

export const saveDiagramVariables =
  (diagramID: string): Thunk =>
  async (_, getState) => {
    const state = getState();
    const variables = localVariablesByDiagramIDSelector(state)(diagramID);

    const rtctimestamp = mutableStore.getRTCTimestamp();
    await client.api.diagram.options({ headers: { rtctimestamp } }).update(diagramID, { variables });
  };

export const removeLocalVariable =
  (diagramID: string, variable: string): SyncThunk =>
  (dispatch, getState) => {
    const variables = localVariablesByDiagramIDSelector(getState())(diagramID);

    dispatch(replaceLocalVariables(diagramID, withoutValue(variables, variable)));
  };

export const addLocalVariable =
  (diagramID: string, variable: string): SyncThunk =>
  (dispatch, getState) => {
    const variables = localVariablesByDiagramIDSelector(getState())(diagramID);

    dispatch(replaceLocalVariables(diagramID, unique(append(variables, variable))));
  };

export const createDiagram =
  (name: string, diagram: PrimitiveTopicDiagram | PrimitiveComponentDiagram): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const creatorID = Account.userIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertCreatorID(creatorID);

    const { _id: diagramID } = await client.api.diagram.create({
      ...diagram,
      name,
      modified: getCurrentTimestamp(),
      versionID,
      creatorID,
    });

    dispatch(
      addDiagram(diagramID, { name, type: diagram.type, id: diagramID, subDiagrams: [], variables: [], intentStepIDs: diagram.intentStepIDs })
    );

    return diagramID;
  };

export const createTopicDiagram =
  (name: string, diagram: PrimitiveTopicDiagram = generateDefaultTopicDiagram(name)): Thunk<string> =>
  async (dispatch) =>
    dispatch(createDiagram(name, diagram));

export const createComponentDiagram =
  (name: string, diagram: PrimitiveComponentDiagram = generateDefaultComponentDiagram()): Thunk<string> =>
  async (dispatch) =>
    dispatch(createDiagram(name, diagram));

export const copyDiagram =
  (diagramID: string, { openDiagram = false }: { openDiagram?: boolean } = {}): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const rootDiagramID = activeRootDiagramIDSelector(state);
    const allDiagrams = allDiagramsSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(rootDiagramID);

    const { _id, type = DiagramType.COMPONENT, ...diagram } = await client.api.diagram.get(diagramID);

    const existingNames = unique(allDiagrams.map(({ name }) => name));

    let newFlowName = existingNames.includes(diagram.name) ? `${diagram.name} (COPY)` : diagram.name;
    let index = 1;

    while (existingNames.includes(newFlowName)) {
      newFlowName = `${diagram.name} (COPY ${index})`;
      index++;
    }

    const newDiagramID = await dispatch(createDiagram(newFlowName, { type, ...diagram } as PrimitiveTopicDiagram | PrimitiveComponentDiagram));

    await dispatch(loadDiagrams(versionID, rootDiagramID));

    if (openDiagram) {
      await dispatch(Router.goToDiagram(newDiagramID));
    }

    return newDiagramID;
  };

export const deleteDiagram =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const rootDiagramID = activeRootDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(rootDiagramID);

    await client.api.diagram.options({ headers: { rtctimestamp: mutableStore.getRTCTimestamp() } }).delete(diagramID);
    await dispatch(loadDiagrams(versionID, rootDiagramID));

    // if the user is on the deleted diagram, redirect to root
    const activeDiagramID = Session.activeDiagramIDSelector(state);

    if (diagramID === activeDiagramID) {
      await dispatch(Router.goToRootDiagram());
    }
  };

export const renameDiagram =
  (diagramID: string, name: string): Thunk =>
  async (dispatch) => {
    dispatch(updateDiagram(diagramID, { name }, true));

    await client.api.diagram.options({ headers: { rtctimestamp: mutableStore.getRTCTimestamp() } }).update(diagramID, { name });
  };

// active diagram

export const saveActiveDiagram = (): Thunk => async (_, getState) => {
  const state = getState();
  const fullDiagram = fullActiveDiagramSelector(state);
  const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

  if (!fullDiagram) throw Errors.noActiveDiagramID();

  const { _id, ...activeDiagram } = fullDiagram;

  if (!isTopicsAndComponents) {
    delete activeDiagram.type;
  }

  if (activeDiagram.type !== DiagramType.TOPIC) {
    delete activeDiagram.intentStepIDs;
  }

  await client.api.diagram.options({ headers: { rtctimestamp: mutableStore.getRTCTimestamp() } }).update(_id, activeDiagram);
};

export const saveActiveDiagramVariables = (): Thunk => async (dispatch, getState) => {
  const diagramID = Creator.creatorDiagramIDSelector(getState());

  Errors.assertDiagramID(diagramID);

  await dispatch(saveDiagramVariables(diagramID));
};

export const addActiveDiagramVariable =
  (variable: string): SyncThunk =>
  (dispatch, getState) => {
    const activeDiagramID = Creator.creatorDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    dispatch(addLocalVariable(activeDiagramID, variable));
  };

export const removeActiveDiagramVariable =
  (variable: string): SyncThunk =>
  (dispatch, getState) => {
    const activeDiagramID = Creator.creatorDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    dispatch(removeLocalVariable(activeDiagramID, variable));
  };

export const replaceActiveDiagramVariables =
  (variables: string[]): SyncThunk =>
  (dispatch, getState) => {
    const activeDiagramID = Creator.creatorDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    dispatch(replaceLocalVariables(activeDiagramID, variables));
  };
