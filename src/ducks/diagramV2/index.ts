import clientV2 from '@/clientV2';
import creatorAdapterV2 from '@/clientV2/adapters/creator';
import { CreatorDiagram, Diagram } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { getCurrentTimestamp } from '@/utils/time';

import { userIDSelector } from '../account';
import * as Creator from '../creator';
import { goToDiagram, goToRootDiagram } from '../router';
import { activeDiagramIDSelector, activeSkillIDSelector } from '../skill';
import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from '../utils/crud';
import { variablesByDiagramIDSelector } from '../variableSet';
import { viewportByIDSelector } from '../viewport';
import { DEFAULT_DIAGRAM } from './constants';
import { PrimativeDiagram } from './types';

export const STATE_KEY = 'diagram';

const diagramReducer = createCRUDReducer<Diagram>(STATE_KEY);

export default diagramReducer;

// selectors

export const {
  root: rootDiagramsSelector,
  all: allDiagramsSelector,
  byID: diagramByIDSelector,
  findByIDs: diagramsByIDsSelector,
  has: hasDiagramsSelector,
  key: allDiagramIDsSelector,
} = createCRUDSelectors<Diagram>(STATE_KEY);

// action creators

export const {
  add: addDiagram,
  addMany: addDiagrams,
  update: updateDiagram,
  remove: removeDiagram,
  replace: replaceDiagrams,
} = createCRUDActionCreators<Diagram>(STATE_KEY);

export const replaceSubDiagrams = (diagramID: string, subDiagrams: string[]) => updateDiagram(diagramID, { subDiagrams }, true);

// side effects

export const loadVersionDiagrams = (versionID: string): Thunk => async (dispatch) => {
  const diagrams = await clientV2.api.version.getDiagrams<{ _id: string; name: string }>(versionID, ['_id', 'name']);

  dispatch(replaceDiagrams(diagrams.map(({ _id, name }) => ({ id: _id, name, subDiagrams: [] }))));
};

export const adaptActiveDiagram = (): SyncThunk<PrimativeDiagram & { _id: string }> => (_, getState) => {
  const state = getState();
  const diagramID = Creator.creatorDiagramIDSelector(state);

  if (!diagramID) {
    throw new Error('No Active Diagram');
  }

  const viewport = viewportByIDSelector(state)(diagramID);
  const { rootNodeIDs, nodes, ports, data, markupNodeIDs } = Creator.creatorDiagramSelector(state);
  const links = Creator.allLinksSelector(state);
  const variables = variablesByDiagramIDSelector(state)(diagramID);

  const diagram = creatorAdapterV2.toDB(
    {
      diagramID,
      viewport,
      rootNodeIDs,
      links,
      data,
      markupNodeIDs,
    } as CreatorDiagram,
    { nodes, ports }
  );

  return { ...diagram, variables };
};

export const saveActiveDiagram = (): Thunk => async (dispatch) => {
  const { _id, ...activeDiagram } = dispatch(adaptActiveDiagram());
  await clientV2.api.diagram.update(_id, activeDiagram);
};

export const createNewDiagram = (name: string, diagram: PrimativeDiagram = DEFAULT_DIAGRAM): Thunk<string> => async (dispatch, getState) => {
  const versionID = activeSkillIDSelector(getState());
  const creatorID = userIDSelector(getState()) as number;

  const newDiagram = await clientV2.api.diagram.create({
    versionID,
    creatorID,
    name,
    modified: getCurrentTimestamp(),
    ...diagram,
  });

  await dispatch(loadVersionDiagrams(versionID));
  return newDiagram._id;
};

export const copyDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const diagram = diagramByIDSelector(state)(diagramID);
  const versionID = activeSkillIDSelector(state);
  const allDiagrams = allDiagramsSelector(state);

  const existingNames = new Set<string>();
  allDiagrams.forEach(({ name }) => existingNames.add(name));

  let newFlowName = `${diagram.name} (COPY)`;
  let index = 1;
  while (existingNames.has(newFlowName)) {
    newFlowName = `${diagram.name} (COPY ${index})`;
    index++;
  }

  const { _id, ...activeDiagram } = dispatch(adaptActiveDiagram());
  const newDiagramID = await dispatch(createNewDiagram(newFlowName, activeDiagram));

  await dispatch(loadVersionDiagrams(versionID));
  await dispatch(goToDiagram(newDiagramID));
};

export const deleteDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = activeSkillIDSelector(state);

  await clientV2.api.diagram.delete(diagramID);
  await dispatch(loadVersionDiagrams(versionID));

  // if the user is on the deleted diagram, redirect to roott
  const activeDiagramID = activeDiagramIDSelector(state);
  if (diagramID === activeDiagramID) {
    await dispatch(goToRootDiagram());
  }
};

export const renameDiagram = (diagramID: string, name: string): Thunk => async (dispatch) => {
  dispatch(updateDiagram(diagramID, { name }, true));
  await clientV2.api.diagram.update(diagramID, { name });
};
