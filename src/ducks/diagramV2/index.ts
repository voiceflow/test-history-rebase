import clientV2 from '@/clientV2';
import creatorAdapterV2 from '@/clientV2/adapters/creator';
import { CreatorDiagram } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { getCurrentTimestamp } from '@/utils/time';

import { userIDSelector } from '../account';
import * as Creator from '../creator';
import * as DiagramReducer from '../diagram';
import { rtctimestampSelector } from '../realtime';
import { goToDiagram, goToRootDiagram } from '../router';
import { activeDiagramIDSelector, activeSkillIDSelector } from '../skill';
import { viewportByIDSelector } from '../viewport';
import { DEFAULT_DIAGRAM } from './constants';
import { PrimativeDiagram } from './types';

// side effects

export const loadVersionDiagrams = (versionID: string): Thunk => async (dispatch) => {
  const diagrams = await clientV2.api.version.getDiagrams<{ _id: string; name: string; variables: string[] }>(versionID, [
    '_id',
    'name',
    'variables',
  ]);

  dispatch(DiagramReducer.replaceDiagrams(diagrams.map(({ _id, name, variables }) => ({ id: _id, name, subDiagrams: [], variables }))));
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
  const variables = DiagramReducer.diagramVariablesSelector(state)(diagramID);

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

export const saveActiveDiagram = (): Thunk => async (dispatch, getState) => {
  const { _id, ...activeDiagram } = dispatch(adaptActiveDiagram());
  await clientV2.api.diagram.options({ headers: { rtctimestamp: rtctimestampSelector(getState()) } }).update(_id, activeDiagram);
};

export const createNewDiagram = (name: string, diagram: PrimativeDiagram = DEFAULT_DIAGRAM): Thunk<string> => async (dispatch, getState) => {
  const versionID = activeSkillIDSelector(getState());
  const creatorID = userIDSelector(getState()) as number;

  const { _id: diagramID } = await clientV2.api.diagram.create({
    versionID,
    creatorID,
    name,
    modified: getCurrentTimestamp(),
    ...diagram,
  });

  dispatch(DiagramReducer.addDiagram(diagramID, { name, id: diagramID, subDiagrams: [], variables: [] }));
  return diagramID;
};

export const copyDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const diagram = DiagramReducer.diagramByIDSelector(state)(diagramID);
  const versionID = activeSkillIDSelector(state);
  const allDiagrams = DiagramReducer.allDiagramsSelector(state);

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

  await clientV2.api.diagram.options({ headers: { rtctimestamp: rtctimestampSelector(state) } }).delete(diagramID);
  await dispatch(loadVersionDiagrams(versionID));

  // if the user is on the deleted diagram, redirect to roott
  const activeDiagramID = activeDiagramIDSelector(state);
  if (diagramID === activeDiagramID) {
    await dispatch(goToRootDiagram());
  }
};

export const renameDiagram = (diagramID: string, name: string): Thunk => async (dispatch, getState) => {
  dispatch(DiagramReducer.updateDiagram(diagramID, { name }, true));
  await clientV2.api.diagram.options({ headers: { rtctimestamp: rtctimestampSelector(getState()) } }).update(diagramID, { name });
};
