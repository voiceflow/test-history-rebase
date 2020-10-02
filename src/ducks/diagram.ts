import { createSelector } from 'reselect';

import client from '@/client';
import creatorAdapter from '@/client/adapters/creator';
import clientV2 from '@/clientV2';
import { IS_TEST } from '@/config';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { creatorDiagramIDSelector } from '@/ducks/creator';
import { clearModal, setConfirm } from '@/ducks/modal';
import { CreatorDiagram, Diagram } from '@/models';
import { Thunk } from '@/store/types';
import { append, hasIdenticalMembers, unique, withoutValue } from '@/utils/array';
import { isLinkedCommandNode, isLinkedFlowNode } from '@/utils/node';
import { denormalize, getNormalizedByKey } from '@/utils/normalized';

import * as Creator from './creator';
import * as Feature from './feature';
import { lastRealtimeTimestampSelector, rtctimestampSelector } from './realtime';
import { goToDiagram, goToRootDiagram } from './router';
import { activeDiagramIDSelector, activePlatformSelector, activeSkillIDSelector } from './skill';
import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';
import { viewportByIDSelector } from './viewport';

export type StructuredFlow = {
  id: string;
  name: string;
  children: StructuredFlow[];
  parents: StructuredFlow[];
};

export const STATE_KEY = 'diagram';
const MAX_DIAGRAM_SIZE = 395000;

const DEFAULT_DIAGRAM = {
  offsetX: 0,
  offsetY: 0,
  zoom: 100,
  gridSize: 0,
  links: [],
  nodes: [
    {
      id: '09c59c5e-579c-49b2-a59b-125b6d8924b3',
      type: 'default',
      selected: false,
      x: 360,
      y: 120,
      extras: {
        type: 'story',
      },
      ports: [
        {
          id: '7b3ce0a0-5cd2-4b46-a3c5-67909add19bc',
          type: 'default',
          selected: false,
          name: '76579fee-85d2-4685-82b8-bb7dde6f5b79',
          parentNode: '09c59c5e-579c-49b2-a59b-125b6d8924b3',
          links: [],
          maximumLinks: 1,
          in: false,
          label: ' ',
        },
      ],
      name: 'Start',
      color: '#FBE9E7',
    },
  ],
};

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

export const activeDiagramSelector = createSelector([diagramByIDSelector, creatorDiagramIDSelector], (getDiagram, activeDiagramID) =>
  activeDiagramID ? getDiagram(activeDiagramID) : null
);

export const subDiagramsByIDSelector = createSelector([diagramByIDSelector], (getDiagram) => (diagramID: string) =>
  getDiagram(diagramID)?.subDiagrams || []
);

export const flowStructureSelector = createSelector([rootDiagramsSelector], (state) => (diagramID: string) => {
  const flowIDs = state.allKeys;
  const flows = denormalize(state)
    .map(({ id, name }) => ({ id, name }))
    .reduce<Record<string, StructuredFlow>>((acc, flow) => Object.assign(acc, { [flow.id]: flow }), {});

  flowIDs.forEach((id) => {
    flows[id].children = getNormalizedByKey(state, id)
      .subDiagrams.map((subDiagramID) => flows[subDiagramID])
      .filter(Boolean);
    flows[id].parents = flowIDs
      .filter((subDiagramID) => getNormalizedByKey(state, subDiagramID).subDiagrams.includes(id))
      .map((subDiagramID) => flows[subDiagramID])
      .filter(Boolean);
  });

  return flows[diagramID];
});

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

export const loadDiagramsForSkill = (skillID: string, meta?: any): Thunk => async (dispatch) => {
  const diagrams = await client.skill.findDiagrams(skillID);

  dispatch(replaceDiagrams(diagrams, meta));
};

export const loadUpdatedDiagram = (diagramID: string, name: string): Thunk => async (dispatch) => {
  const diagram = await client.diagram.get(diagramID);

  dispatch(addDiagram(diagramID, { ...diagram, name }));
  dispatch(loadDiagramVariables(diagramID));
};

export const updateSubDiagrams = (diagramID: string): Thunk<string[]> => async (dispatch, getState) => {
  const state = getState();
  const targetDiagramID = diagramID || activeDiagramIDSelector(state);
  const platform: PlatformType = activePlatformSelector(state);
  const allNodeData = Creator.allNodeDataSelector(state);
  const currentSubDiagramIDs = subDiagramsByIDSelector(state)(diagramID);

  const subDiagramIDs = Array.from(
    allNodeData.reduce((acc, data) => {
      if (isLinkedFlowNode(data)) {
        acc.add(data.diagramID);
      } else if (isLinkedCommandNode(data, platform)) {
        acc.add(data[platform].diagramID);
      }

      return acc;
    }, new Set<string>())
  );

  if (!hasIdenticalMembers(subDiagramIDs, currentSubDiagramIDs)) {
    dispatch(replaceSubDiagrams(targetDiagramID, subDiagramIDs));
  }

  return subDiagramIDs;
};

export const saveDiagram = (skillID: string, diagramID: string, data: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const lastTimestamp = lastRealtimeTimestampSelector(state);
  const diagram = diagramByIDSelector(state)(diagramID);

  const subDiagramIDs = await dispatch(updateSubDiagrams(diagramID));

  const diagramRequest = {
    skill: skillID,
    sub_diagrams: JSON.stringify(subDiagramIDs),
    title: diagram?.name ?? 'Name',
    variables: diagram.variables,
    data,
    ...(lastTimestamp && { lastTimestamp }),
  };

  await client.diagram.update(diagramRequest);
};

export const saveActiveDiagram = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);
  const diagramID = Creator.creatorDiagramIDSelector(state);

  if (!diagramID) {
    throw new Error('No Active Diagram');
  }

  const viewport = viewportByIDSelector(state)(diagramID);
  const platform = activePlatformSelector(state);
  const { rootNodeIDs, nodes, ports, data, linksByPortID, markupNodeIDs } = Creator.creatorDiagramSelector(state);
  const links = Creator.allLinksSelector(state);

  const dataString = JSON.stringify(
    creatorAdapter.toDB(
      {
        diagramID,
        viewport,
        rootNodeIDs,
        links,
        data,
        markupNodeIDs,
      } as CreatorDiagram,
      {
        nodes,
        ports,
        linksByPortID,
        platform,
      }
    )
  );

  if (Buffer.from(dataString).length > MAX_DIAGRAM_SIZE) {
    await dispatch(
      setConfirm({
        text: 'The current flow has exceeded the size limit, updates will not save. Please separate into different flows or reduce blocks.',
        confirm: () => {
          dispatch(clearModal());
        },
      })
    );
    return;
  }

  await dispatch(saveDiagram(skillID, diagramID, dataString));
};

export const createDiagram = (diagramID: string, name: string): Thunk => async (dispatch, getState) => {
  const skillID = activeSkillIDSelector(getState());
  const data = JSON.stringify(DEFAULT_DIAGRAM);

  await client.diagram.create({
    id: diagramID,
    data,
    title: name,
    variables: [],
    skill: skillID,
  });
  await dispatch(loadUpdatedDiagram(diagramID, name));
};

export const copyDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const diagram = diagramByIDSelector(state)(diagramID);
  const allDiagrams = allDiagramsSelector(state);
  const skillID = activeSkillIDSelector(state);

  const exists = (name: string) => allDiagrams.find((diagram) => diagram.name === name);

  let newFlowName = `${diagram.name} (COPY)`;
  let index = 1;
  while (exists(newFlowName)) {
    newFlowName = `${diagram.name} (COPY ${index})`;
    index++;
  }

  const newDiagramID = await client.diagram.copy(diagramID, newFlowName);

  await dispatch(loadDiagramsForSkill(skillID));
  await dispatch(goToDiagram(newDiagramID));
};

export const deleteDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);

  await client.diagram.delete(diagramID);
  await dispatch(loadDiagramsForSkill(skillID));

  const activeDiagramID = activeDiagramIDSelector(state);
  if (diagramID === activeDiagramID) {
    await dispatch(goToRootDiagram());
  }
};

export const renameDiagram = (diagramID: string, name: string): Thunk => async (dispatch, getState) => {
  const skillID = activeSkillIDSelector(getState());
  dispatch(updateDiagram(diagramID, { name }, true));

  await client.diagram.rename(diagramID, name);

  dispatch(loadDiagramsForSkill(skillID));
};

// Diagram Variables
export const diagramVariablesSelector = createSelector([diagramByIDSelector], (getDiagram) => (diagramID: string) =>
  getDiagram(diagramID)?.variables || []
);

export const activeDiagramVariables = createSelector([creatorDiagramIDSelector, diagramVariablesSelector], (diagramID, variablesByDiagramID) =>
  variablesByDiagramID(diagramID!)
);

export const updateDiagramVariables = (diagramID: string, variables: string[], meta?: any) => updateDiagram(diagramID, { variables }, true, meta);

export const removeDiagramVariable = (diagramID: string, variable: string): Thunk => async (dispatch, getState) => {
  const variables = diagramVariablesSelector(getState())(diagramID);
  dispatch(updateDiagramVariables(diagramID, withoutValue(variables, variable)));
};

export const addDiagramVariable = (diagramID: string, variable: string): Thunk => async (dispatch, getState) => {
  const variables = diagramVariablesSelector(getState())(diagramID);
  dispatch(updateDiagramVariables(diagramID, unique(append(variables, variable))));
};

export const loadDiagramVariables = (diagramID: string): Thunk<string[]> => async (dispatch, getState) => {
  const isDataRefactorEnabled = IS_TEST ? false : Feature.isFeatureEnabledSelector(getState())(FeatureFlag.DATA_REFACTOR);
  // TODO: no longer need to load diagram variables individually in the future
  if (isDataRefactorEnabled) {
    const { variables } = await clientV2.api.diagram.get<{ variables: string[] }>(diagramID, ['variables']);
    dispatch(updateDiagramVariables(diagramID, variables));
    return variables;
  }

  const variables = await client.diagram.findVariables(diagramID);
  dispatch(updateDiagramVariables(diagramID, variables));

  return variables;
};

export const saveDiagramVariables = (diagramID: string): Thunk => async (_, getState) => {
  const state = getState();
  const variables = diagramVariablesSelector(state)(diagramID);

  const isDataRefactorEnabled = IS_TEST ? false : Feature.isFeatureEnabledSelector(getState())(FeatureFlag.DATA_REFACTOR);
  if (isDataRefactorEnabled) {
    const rtctimestamp = rtctimestampSelector(state);
    await clientV2.api.diagram.options({ headers: { rtctimestamp } }).update(diagramID, { variables });
    return;
  }

  const remoteDiagramVariables = await client.diagram.findVariables(diagramID);

  if (!hasIdenticalMembers(remoteDiagramVariables, variables)) {
    await client.diagram.updateVariables(diagramID, variables);
  }
};

export const saveActiveDiagramVariables = (): Thunk => async (dispatch, getState) => {
  const diagramID = creatorDiagramIDSelector(getState());
  if (!diagramID) return;

  await dispatch(saveDiagramVariables(diagramID));
};
