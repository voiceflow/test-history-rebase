import clientV2 from '@/clientV2';
import creatorAdapterV2 from '@/clientV2/adapters/creator';
import { creatorDiagramIDSelector } from '@/ducks/creator';
import { CreatorDiagram } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { unique } from '@/utils/array';
import { getCurrentTimestamp } from '@/utils/time';

import { userIDSelector } from '../account';
import * as Creator from '../creator';
import { rtctimestampSelector } from '../realtime';
import { goToDiagram, goToRootDiagram } from '../router';
import { activeDiagramIDSelector, activePlatformSelector, activeSkillIDSelector } from '../skill';
import { viewportByIDSelector } from '../viewport';
import { addDiagram, replaceDiagrams, updateDiagram, updateDiagramVariables } from './actions';
import { generateDefaultDiagram } from './constants';
import { allDiagramsSelector, diagramVariablesSelector } from './selectors';
import { PrimativeDiagram } from './types';

// side effects

// TODO: no longer need to load diagram variables individually in the future
export const loadDiagramVariables = (diagramID: string): Thunk<string[]> => async (dispatch) => {
  const { variables } = await clientV2.api.diagram.get<{ variables: string[] }>(diagramID, ['variables']);
  dispatch(updateDiagramVariables(diagramID, variables));
  return variables;
};

export const saveDiagramVariables = (diagramID: string): Thunk => async (_, getState) => {
  const state = getState();
  const variables = diagramVariablesSelector(state)(diagramID);

  const rtctimestamp = rtctimestampSelector(state);
  await clientV2.api.diagram.options({ headers: { rtctimestamp } }).update(diagramID, { variables });
};

export const saveActiveDiagramVariables = (): Thunk => async (dispatch, getState) => {
  const diagramID = creatorDiagramIDSelector(getState());
  if (!diagramID) return;

  await dispatch(saveDiagramVariables(diagramID));
};

export const loadVersionDiagrams = (versionID: string): Thunk => async (dispatch) => {
  const diagrams = await clientV2.api.version.getDiagrams<{ _id: string; name: string; variables: string[]; children: string[] }>(versionID, [
    '_id',
    'name',
    'variables',
    'children',
  ]);

  dispatch(replaceDiagrams(diagrams.map(({ _id, name, variables, children = [] }) => ({ id: _id, name, subDiagrams: children, variables }))));
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
  const variables = diagramVariablesSelector(state)(diagramID);
  const platform = activePlatformSelector(state);

  const diagram = creatorAdapterV2.toDB(
    {
      diagramID,
      viewport,
      rootNodeIDs,
      links,
      data,
      markupNodeIDs,
    } as CreatorDiagram,
    { nodes, ports, platform }
  );

  return { ...diagram, variables };
};

export const saveActiveDiagram = (): Thunk => async (dispatch, getState) => {
  const { _id, ...activeDiagram } = dispatch(adaptActiveDiagram());
  await clientV2.api.diagram.options({ headers: { rtctimestamp: rtctimestampSelector(getState()) } }).update(_id, activeDiagram);
};

export const createNewDiagram = (name: string, diagram: PrimativeDiagram = generateDefaultDiagram()): Thunk<string> => async (dispatch, getState) => {
  const versionID = activeSkillIDSelector(getState());
  const creatorID = userIDSelector(getState()) as number;

  const { _id: diagramID } = await clientV2.api.diagram.create({
    ...diagram,
    versionID,
    creatorID,
    name,
    modified: getCurrentTimestamp(),
  });

  dispatch(addDiagram(diagramID, { name, id: diagramID, subDiagrams: [], variables: [] }));
  return diagramID;
};

export const copyDiagram = (diagramID: string, { openDiagram = false }: { openDiagram?: boolean } = {}): Thunk<string> => async (
  dispatch,
  getState
) => {
  const state = getState();
  const versionID = activeSkillIDSelector(state);
  const allDiagrams = allDiagramsSelector(state);

  const { _id, ...diagram } = await clientV2.api.diagram.get(diagramID);

  const existingNames = unique(allDiagrams.map(({ name }) => name));

  let newFlowName = existingNames.includes(diagram.name) ? `${diagram.name} (COPY)` : diagram.name;
  let index = 1;
  while (existingNames.includes(newFlowName)) {
    newFlowName = `${diagram.name} (COPY ${index})`;
    index++;
  }

  const newDiagramID = await dispatch(createNewDiagram(newFlowName, diagram));

  await dispatch(loadVersionDiagrams(versionID));

  if (openDiagram) {
    await dispatch(goToDiagram(newDiagramID));
  }

  return newDiagramID;
};

export const deleteDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = activeSkillIDSelector(state);

  await clientV2.api.diagram.options({ headers: { rtctimestamp: rtctimestampSelector(state) } }).delete(diagramID);
  await dispatch(loadVersionDiagrams(versionID));

  // if the user is on the deleted diagram, redirect to roott
  const activeDiagramID = activeDiagramIDSelector(state);
  if (diagramID === activeDiagramID) {
    await dispatch(goToRootDiagram());
  }
};

export const renameDiagram = (diagramID: string, name: string): Thunk => async (dispatch, getState) => {
  dispatch(updateDiagram(diagramID, { name }, true));
  await clientV2.api.diagram.options({ headers: { rtctimestamp: rtctimestampSelector(getState()) } }).update(diagramID, { name });
};
