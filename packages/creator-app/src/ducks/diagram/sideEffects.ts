import { DiagramType, VersionFolderItemType } from '@voiceflow/api-sdk';
import { Adapters } from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { RESERVED_JS_WORDS } from '@/constants';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { activeComponentsSelector, activeRootDiagramIDSelector, activeTopicsSelector, activeVersionSelector } from '@/ducks/version/selectors';
import { saveComponents, saveTopics } from '@/ducks/version/sideEffects/common/topicsComponents';
import { CreatorDiagram, DBDiagram, Diagram, Link, Node, NodeData, Port } from '@/models';
import mutableStore from '@/store/mutable';
import { SyncThunk, Thunk } from '@/store/types';
import { BLOCK_WIDTH } from '@/styles/theme';
import { PathPoint, Point } from '@/types';
import { append, insert, unique, withoutValue, withoutValues } from '@/utils/array';
import { getNodesGroupCenter } from '@/utils/node';
import { normalize } from '@/utils/normalized';
import { getCurrentTimestamp } from '@/utils/time';
import { isMarkupOrCombinedBlockType } from '@/utils/typeGuards';

import { addDiagram, patchDiagram, replaceDiagrams, replaceLocalVariables, updateDiagram } from './actions';
import { generateDefaultComponentDiagram, generateDefaultTopicDiagram } from './constants';
import { allDiagramsSelector, diagramByIDSelector, fullActiveDiagramSelector, localVariablesByDiagramIDSelector } from './selectors';
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

export const saveDiagramIntentSteps =
  (diagramID: string, intentStepIDs: string[]): Thunk =>
  async (dispatch) => {
    const rtctimestamp = mutableStore.getRTCTimestamp();

    dispatch(patchDiagram(diagramID, { intentStepIDs }));
    await client.api.diagram.options({ headers: { rtctimestamp } }).update(diagramID, { intentStepIDs });
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
    if (RESERVED_JS_WORDS.includes(variable)) {
      throw new Error(`Reserved word. You can prefix with '_' to fix this issue`);
    }
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
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

    const diagramID = await dispatch(createDiagram(name, diagram));

    if (isTopicsAndComponents) {
      Errors.assertVersionID(versionID);

      const activeTopics = activeTopicsSelector(state);
      const activeDiagramID = Session.activeDiagramIDSelector(state);

      const newTopicItem = { type: VersionFolderItemType.DIAGRAM, sourceID: diagramID };
      const activeTopicIndex = activeDiagramID ? activeTopics.findIndex(({ sourceID }) => sourceID === activeDiagramID) : -1;

      const topics = activeTopicIndex === -1 ? append(activeTopics, newTopicItem) : insert(activeTopics, activeTopicIndex + 1, newTopicItem);

      await dispatch(saveTopics(topics));
    }

    return diagramID;
  };

export const createComponentDiagram =
  (name: string, diagram: PrimitiveComponentDiagram = generateDefaultComponentDiagram()): Thunk<string> =>
  async (dispatch) =>
    dispatch(createDiagram(name, diagram));

const addDiagramIDIntoComponentsList =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeDiagramID = Session.activeDiagramIDSelector(state);
    const activeComponents = activeComponentsSelector(state);

    const newTopicItem = { type: VersionFolderItemType.DIAGRAM, sourceID: diagramID };
    const activeComponentIndex = activeDiagramID ? activeComponents.findIndex(({ sourceID }) => sourceID === activeDiagramID) : -1;

    const components =
      activeComponentIndex === -1 ? append(activeComponents, newTopicItem) : insert(activeComponents, activeComponentIndex + 1, newTopicItem);

    await dispatch(saveComponents(components));
  };

export const createComponent =
  ({
    nodes,
    links,
    ports,
    data,
  }: {
    nodes: Node[];
    links: Link[];
    ports: Port[];
    data: Record<string, NodeData<unknown>>;
  }): Thunk<{ name: string; diagramID: string }> =>
  async (dispatch, getState) => {
    const startCoords: Point = [360, 120];

    const state = getState();
    const diagram = generateDefaultComponentDiagram({ coords: startCoords });
    const platform = ProjectV2.active.platformSelector(state);
    const activeComponents = activeComponentsSelector(state);

    const combinedAndMarkupNodes = nodes.filter(({ type }) => isMarkupOrCombinedBlockType(type)).map((node) => ({ data: data[node.id], node }));
    const { center, minX } = getNodesGroupCenter(combinedAndMarkupNodes, links);

    const adjustX = startCoords[0] - minX + BLOCK_WIDTH * 1.5;
    const adjustY = startCoords[1] - center[1];

    const adjustPathPoint = (point: PathPoint): PathPoint => ({
      ...point,
      point: [point.point[0] + adjustX, point.point[1] + adjustY],
    });

    const adjustedNodes = nodes.map((node) => ({ ...node, x: node.x + adjustX, y: node.y + adjustY }));
    const adjustedPorts = ports.map((port) =>
      port.linkData?.points ? { ...port, linkData: { ...port.linkData, points: port.linkData.points.map(adjustPathPoint) } } : port
    );
    const adjustedLinks = links.map((link) =>
      link.data?.points ? { ...link, data: { ...link.data, points: link.data.points.map(adjustPathPoint) } } : link
    );

    const convertedDiagram = Adapters.creatorAdapter.toDB(
      {
        data,
        links: adjustedLinks,
        viewport: { zoom: 1, x: 0, y: 0 },
        diagramID: '',
      } as CreatorDiagram,
      { nodes: normalize(adjustedNodes), ports: normalize(adjustedPorts), platform, context: {} }
    );

    diagram.nodes = { ...diagram.nodes, ...convertedDiagram.nodes };
    diagram.children = [...diagram.children, ...convertedDiagram.children];

    const name = `Component ${activeComponents.length + 1}`;

    const diagramID = await dispatch(createComponentDiagram(name, diagram));

    await dispatch(addDiagramIDIntoComponentsList(diagramID));

    return { name, diagramID };
  };

export const createEmptyComponent =
  (name: string): Thunk<string> =>
  async (dispatch) => {
    const diagramID = await dispatch(createComponentDiagram(name));

    await dispatch(addDiagramIDIntoComponentsList(diagramID));

    return diagramID;
  };

export const copyDiagram =
  (diagramID: string, { openDiagram = false }: { openDiagram?: boolean } = {}): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const rootDiagramID = activeRootDiagramIDSelector(state);
    const allDiagrams = allDiagramsSelector(state);
    const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

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

    if (isTopicsAndComponents) {
      await dispatch(addDiagramIDIntoComponentsList(newDiagramID));
    }

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
    const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(rootDiagramID);

    if (isTopicsAndComponents) {
      const { type } = diagramByIDSelector(state)(diagramID) ?? {};
      const { topics = [], components = [] } = activeVersionSelector(state) ?? {};

      if (type === DiagramType.TOPIC) {
        const newTopics = topics.filter(({ sourceID }) => sourceID !== diagramID);

        await dispatch(saveTopics(newTopics));
      } else if (type === DiagramType.COMPONENT) {
        const newComponents = components.filter(({ sourceID }) => sourceID !== diagramID);

        await dispatch(saveComponents(newComponents));
      }
    }

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

export const removeActiveDiagramIntentStepIDs =
  (intentStepIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeDiagramID = Creator.creatorDiagramIDSelector(state);

    Errors.assertDiagramID(activeDiagramID);

    const activeDiagram = diagramByIDSelector(state)(activeDiagramID);

    dispatch(saveDiagramIntentSteps(activeDiagramID, withoutValues(activeDiagram?.intentStepIDs ?? [], intentStepIDs)));
  };

export const addActiveDiagramIntentStepIDs =
  (intentStepIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeDiagramID = Creator.creatorDiagramIDSelector(state);

    Errors.assertDiagramID(activeDiagramID);

    const activeDiagram = diagramByIDSelector(state)(activeDiagramID);

    dispatch(saveDiagramIntentSteps(activeDiagramID, [...(activeDiagram?.intentStepIDs ?? []), ...intentStepIDs]));
  };
