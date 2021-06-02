import client from '@/client';
import * as Errors from '@/config/errors';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import mutableStore from '@/store/mutable';
import { SyncThunk, Thunk } from '@/store/types';
import { append, unique, withoutValue } from '@/utils/array';
import { getCurrentTimestamp } from '@/utils/time';

import { addDiagram, replaceDiagrams, replaceLocalVariables, updateDiagram } from './actions';
import { generateDefaultDiagram } from './constants';
import { allDiagramsSelector, fullActiveDiagramSelector, localVariablesByDiagramIDSelector } from './selectors';
import { PrimitiveDiagram } from './types';

// side effects

export const loadDiagrams =
  (versionID: string): Thunk =>
  async (dispatch) => {
    const diagrams = await client.api.version.getDiagrams<{ _id: string; name: string; variables: string[]; children: string[] }>(versionID, [
      '_id',
      'name',
      'variables',
      'children',
    ]);

    dispatch(replaceDiagrams(diagrams.map(({ _id, name, variables, children = [] }) => ({ id: _id, name, subDiagrams: children, variables }))));
  };

// TODO: no longer need to load diagram variables individually in the future
export const loadLocalVariables =
  (diagramID: string): Thunk<string[]> =>
  async (dispatch) => {
    const { variables } = await client.api.diagram.get<{ variables: string[] }>(diagramID, ['variables']);

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
  (name: string, diagram: PrimitiveDiagram = generateDefaultDiagram()): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const creatorID = Account.userIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertCreatorID(creatorID);

    const { _id: diagramID } = await client.api.diagram.create({
      ...diagram,
      versionID,
      creatorID,
      name,
      modified: getCurrentTimestamp(),
    });

    dispatch(addDiagram(diagramID, { name, id: diagramID, subDiagrams: [], variables: [] }));

    return diagramID;
  };

export const copyDiagram =
  (diagramID: string, { openDiagram = false }: { openDiagram?: boolean } = {}): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const allDiagrams = allDiagramsSelector(state);

    Errors.assertVersionID(versionID);

    const { _id, ...diagram } = await client.api.diagram.get(diagramID);

    const existingNames = unique(allDiagrams.map(({ name }) => name));

    let newFlowName = existingNames.includes(diagram.name) ? `${diagram.name} (COPY)` : diagram.name;
    let index = 1;

    while (existingNames.includes(newFlowName)) {
      newFlowName = `${diagram.name} (COPY ${index})`;
      index++;
    }

    const newDiagramID = await dispatch(createDiagram(newFlowName, diagram));

    await dispatch(loadDiagrams(versionID));

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

    Errors.assertVersionID(versionID);

    await client.api.diagram.options({ headers: { rtctimestamp: mutableStore.getRTCTimestamp() } }).delete(diagramID);
    await dispatch(loadDiagrams(versionID));

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

  if (!fullDiagram) throw Errors.noActiveDiagramID();

  const { _id, ...activeDiagram } = fullDiagram;

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
