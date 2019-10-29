import { createSelector } from 'reselect';

import client from '@/client';
import linkAdapter from '@/client/adapters/creator/link';
import nodeAdapter from '@/client/adapters/creator/node';
import { BlockType } from '@/constants';
import { clearModal, setConfirm } from '@/ducks/modal';
import { getAllNormalizedByKeys } from '@/utils/normalized';

import { allLinksSelector, allNodeDataSelector, creatorDiagramIDSelector, creatorStateSelector } from './creator';
import { lastRealtimeTimestampSelector } from './realtime';
import { goToDiagram, goToRootDiagram } from './router';
import { activeDiagramIDSelector, activePlatformSelector, activeSkillIDSelector } from './skill';
import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';
import { loadVariableSetForDiagram, variablesByDiagramIDSelector } from './variableSet';
import { viewportByIDSelector } from './viewport';

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
        audio: '',
        audioText: '',
        audioVoice: '',
        preview: '',
        previewText: '',
        previewVoice: '',
        prompt: '',
        promptText: '',
        promptVoice: '',
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

const diagramReducer = createCRUDReducer(STATE_KEY);

export default diagramReducer;

// selectors

export const {
  root: rootDiagramsSelector,
  all: allDiagramsSelector,
  byID: diagramByIDSelector,
  findByIDs: diagramsByIDsSelector,
  has: hasDiagramsSelector,
  key: allDiagramIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const flowStructureSelector = createSelector(
  rootDiagramsSelector,
  ({ byKey, allKeys }) => (diagramID) => {
    const flows = allKeys.reduce((acc, key) => Object.assign(acc, { [key]: { id: byKey[key].id, name: byKey[key].name } }), {});

    allKeys.forEach((id) => {
      flows[id].children = byKey[id].subDiagrams.map((subDiagramID) => flows[subDiagramID]).filter(Boolean);
      flows[id].parents = allKeys
        .filter((subDiagramID) => byKey[subDiagramID].subDiagrams.includes(id))
        .map((subDiagramID) => flows[subDiagramID])
        .filter(Boolean);
    });

    return flows[diagramID];
  }
);

// action creators

export const {
  add: addDiagram,
  addMany: addDiagrams,
  update: updateDiagram,
  remove: removeDiagram,
  replace: replaceDiagrams,
} = createCRUDActionCreators(STATE_KEY);

export const updateDiagramViewport = (diagramID, x, y, zoom) => updateDiagram(diagramID, { x, y, zoom }, true);

export const replaceSubDiagrams = (diagramID, subDiagrams) => updateDiagram(diagramID, { subDiagrams }, true);

// side effects

export const loadDiagramsForSkill = (skillID) => async (dispatch) => {
  const diagrams = await client.skill.findDiagrams(skillID);

  dispatch(replaceDiagrams(diagrams));

  await Promise.all(diagrams.map((diagram) => dispatch(loadVariableSetForDiagram(diagram.id))));
};

export const loadUpdatedDiagram = (diagramID, name) => async (dispatch) => {
  const diagram = await client.diagram.get(diagramID);

  dispatch(addDiagram(diagramID, { ...diagram, name }));
  dispatch(loadVariableSetForDiagram(diagramID));
};

export const updateSubDiagrams = (diagramID) => async (dispatch, getState) => {
  const state = getState();
  const targetDiagramID = diagramID || activeDiagramIDSelector(state);
  const platform = activePlatformSelector(state);
  const allNodeData = allNodeDataSelector(state);

  const subDiagramIDs = Array.from(
    allNodeData.reduce((acc, data) => {
      if (data.type === BlockType.FLOW && data.diagramID) {
        acc.add(data.diagramID);
      } else if (data.type === BlockType.COMMAND && data[platform].diagramID) {
        acc.add(data[platform].diagramID);
      }

      return acc;
    }, new Set())
  );

  dispatch(replaceSubDiagrams(targetDiagramID, subDiagramIDs));

  return subDiagramIDs;
};

export const saveDiagram = (skillID, diagramID, data) => async (dispatch, getState) => {
  const state = getState();
  const lastTimestamp = lastRealtimeTimestampSelector(state);
  const diagram = diagramByIDSelector(state)(diagramID);
  const variables = variablesByDiagramIDSelector(state)(diagramID);

  const subDiagramIDs = await dispatch(updateSubDiagrams(diagramID));

  const diagramRequest = {
    skill: skillID,
    sub_diagrams: JSON.stringify(subDiagramIDs),
    title: diagram.name,
    variables,
    data,
    ...(lastTimestamp && { lastTimestamp }),
  };

  await client.diagram.update(diagramRequest);
};

export const saveActiveDiagram = () => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);
  const diagramID = creatorDiagramIDSelector(state);

  if (!diagramID) {
    throw new Error('No Active Diagram');
  }

  const viewport = viewportByIDSelector(state)(diagramID);
  const platform = activePlatformSelector(state);
  const { rootNodes: rootNodeIDs, nodes, ports, data, linksByPortID } = creatorStateSelector(state);
  const links = allLinksSelector(state);

  const rootNodes = getAllNormalizedByKeys(nodes, rootNodeIDs);

  const updatedData = {
    id: diagramID,
    offsetX: viewport.x,
    offsetY: viewport.y,
    zoom: viewport.zoom,
    links: linkAdapter.mapToDB(links),
    nodes: rootNodes.map((node) => nodeAdapter.toDB(node, { nodes, ports, data, linksByPortID, platform })),
  };

  const dataString = JSON.stringify(updatedData);

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

export const createDiagram = (diagramID, name) => async (dispatch, getState) => {
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

export const copyDiagram = (diagramID) => async (dispatch, getState) => {
  const state = getState();
  const diagram = diagramByIDSelector(state)(diagramID);
  const allDiagrams = allDiagramsSelector(state);
  const skillID = activeSkillIDSelector(state);

  const exists = (name) => allDiagrams.find((d) => d.name === name);

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

export const deleteDiagram = (diagramID) => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);

  await client.diagram.delete(diagramID);
  await dispatch(loadDiagramsForSkill(skillID));

  const activeDiagramID = activeDiagramIDSelector(state);
  if (diagramID === activeDiagramID) {
    await dispatch(goToRootDiagram());
  }
};

export const renameDiagram = (diagramID, name) => async (dispatch, getState) => {
  const skillID = activeSkillIDSelector(getState());
  dispatch(updateDiagram(diagramID, { name }, true));

  await client.diagram.rename(diagramID, name);

  dispatch(loadDiagramsForSkill(skillID));
};
