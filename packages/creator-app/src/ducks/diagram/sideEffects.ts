import { Models as BaseModels, Node as BaseNode } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import { RootPageProgressBar } from '@/components/PageProgressBar';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { PageProgressBar, RESERVED_JS_WORDS } from '@/constants';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { CanvasCreationType, VariableType } from '@/ducks/tracking/constants';
import { AsyncActionError, waitAsync } from '@/ducks/utils';
import { saveComponents, saveTopics } from '@/ducks/version/sideEffects/common/topicsComponents';
import { getActiveVersionContext } from '@/ducks/version/utils';
import * as VersionV2 from '@/ducks/versionV2';
import mutableStore from '@/store/mutable';
import { Thunk } from '@/store/types';
import { BLOCK_WIDTH } from '@/styles/theme';
import { PathPoint, Point } from '@/types';
import logger from '@/utils/logger';
import { getNodesGroupCenter } from '@/utils/node';
import { isMarkupOrCombinedBlockType } from '@/utils/typeGuards';

import { crud } from './actions';
import { fullActiveDiagramSelector } from './fullDiagram';
import { diagramByIDSelector } from './selectors';

// side effects

/**
 * @deprecated resource sync is handled by subscription to the project/:projectID channel
 */
export const loadDiagrams =
  (versionID: string, rootDiagramID: string): Thunk<Realtime.Diagram[]> =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return [];

    const dbDiagrams = await client.api.version.getDiagrams<Realtime.DBDiagram>(versionID, [
      '_id',
      'type',
      'name',
      'variables',
      'children',
      'intentStepIDs',
    ]);

    const diagrams = Realtime.Adapters.diagramAdapter.mapFromDB(dbDiagrams, { rootDiagramID });

    dispatch(crud.replace(diagrams));

    return diagrams;
  };

/**
 * @deprecated no longer need to load diagram variables individually in the future
 */
export const loadLocalVariables =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    const fields = ['variables'] as const;

    const { variables } = await client.api.diagram.get(diagramID, fields);

    dispatch(crud.patch(diagramID, { variables }));
  };

export const removeLocalVariable =
  (diagramID: string, variable: string): Thunk =>
  (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const variables = DiagramV2.localVariablesByDiagramIDSelector(getState(), { id: diagramID });

          dispatch(crud.patch(diagramID, { variables: Utils.array.withoutValue(variables, variable) }));
        },
        async (context) => {
          await dispatch.sync(Realtime.diagram.removeLocalVariable({ ...context, variable, diagramID }));
        }
      )
    );

export const addLocalVariable =
  (diagramID: string, variable: string, creationType: CanvasCreationType): Thunk =>
  async (dispatch, getState) => {
    if (RESERVED_JS_WORDS.includes(variable)) {
      throw new Error("Reserved word. You can prefix with '_' to fix this issue");
    }

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const variables = DiagramV2.localVariablesByDiagramIDSelector(getState(), { id: diagramID });

          dispatch(crud.patch(diagramID, { variables: Utils.array.append(variables, variable) }));
        },
        async (context) => {
          await dispatch.sync(Realtime.diagram.addLocalVariable({ ...context, variable, diagramID }));
        }
      )
    );

    dispatch(Tracking.trackVariableCreated({ variableType: VariableType.FLOW, diagramID, creationType }));
  };

const createDiagram =
  (primitiveDiagram: Realtime.Utils.diagram.PrimitiveDiagram): Thunk<Realtime.Diagram> =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const creatorID = Account.userIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertCreatorID(creatorID);

    const diagram = {
      ...primitiveDiagram,
      modified: Utils.time.getCurrentTimestamp(),
      versionID,
      creatorID,
    };

    const { _id: diagramID } = await client.api.diagram.create(diagram);

    const newDiagram = {
      name: diagram.name,
      type: diagram.type,
      id: diagramID,
      subDiagrams: [],
      variables: [],
      intentStepIDs: diagram.intentStepIDs,
    };

    dispatch(crud.add(diagramID, newDiagram));

    return newDiagram;
  };

export const createTopicDiagram =
  (name: string): Thunk<Realtime.Diagram> =>
  (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const diagram = Realtime.Utils.diagram.topicDiagramFactory(name);
          const newDiagram = await dispatch(createDiagram(diagram));

          const state = getState();
          const activeTopics = VersionV2.active.topicsSelector(state);
          const activeDiagramID = Session.activeDiagramIDSelector(state);

          const newTopicItem = { type: BaseModels.VersionFolderItemType.DIAGRAM, sourceID: newDiagram.id };
          const activeTopicIndex = activeDiagramID ? activeTopics.findIndex(({ sourceID }) => sourceID === activeDiagramID) : -1;

          const topics =
            activeTopicIndex === -1
              ? Utils.array.append(activeTopics, newTopicItem)
              : Utils.array.insert(activeTopics, activeTopicIndex + 1, newTopicItem);

          await dispatch(saveTopics(topics));

          return newDiagram;
        },
        async (context) => {
          RootPageProgressBar.start(PageProgressBar.TOPIC_CREATING);

          const diagram = await dispatch(waitAsync(Realtime.diagram.createTopic, { ...context, diagram: { name } }));

          RootPageProgressBar.stop(PageProgressBar.TOPIC_CREATING);

          return diagram;
        }
      )
    );

export const createComponentDiagram =
  (name: string): Thunk<string> =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const diagram = Realtime.Utils.diagram.componentDiagramFactory(name);

          const { id: diagramID } = await dispatch(createDiagram(diagram));

          return diagramID;
        },
        async (context) => {
          const diagram = await dispatch(waitAsync(Realtime.diagram.createComponent, { ...context, diagram: { name } }));

          return diagram.id;
        }
      )
    );

const addDiagramIDIntoComponentsList =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeDiagramID = Session.activeDiagramIDSelector(state);
    const activeComponents = VersionV2.active.componentsSelector(state);

    const newTopicItem = { type: BaseModels.VersionFolderItemType.DIAGRAM, sourceID: diagramID };
    const activeComponentIndex = activeDiagramID ? activeComponents.findIndex(({ sourceID }) => sourceID === activeDiagramID) : -1;

    const components =
      activeComponentIndex === -1
        ? Utils.array.append(activeComponents, newTopicItem)
        : Utils.array.insert(activeComponents, activeComponentIndex + 1, newTopicItem);

    await dispatch(saveComponents(components));
  };

export const createEmptyComponent =
  (name: string): Thunk<string> =>
  async (dispatch) => {
    RootPageProgressBar.start(PageProgressBar.COMPONENT_CREATING);

    const diagramID = await dispatch(createComponentDiagram(name));

    await dispatch(addDiagramIDIntoComponentsList(diagramID));

    RootPageProgressBar.stop(PageProgressBar.COMPONENT_CREATING);

    return diagramID;
  };

export const convertToComponent =
  ({
    nodes,
    links,
    ports,
    data,
  }: {
    nodes: Realtime.Node[];
    links: Realtime.Link[];
    ports: Realtime.Port[];
    data: Record<string, Realtime.NodeData<unknown>>;
  }): Thunk<{
    name: string;
    diagramID: string;
    outgoingLinkTarget: Nullable<{ nodeID: string; portID: string }>;
    incomingLinkSource: Nullable<{ nodeID: string; portID: string }>;
  }> =>
  async (dispatch, getState) => {
    const startCoords: Point = [360, 120];

    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const activeComponents = VersionV2.active.componentsSelector(state);
    const name = `Component ${activeComponents.length + 1}`;
    const diagram = Realtime.Utils.diagram.componentDiagramFactory(name, startCoords);

    const nodeIDMap = nodes.reduce<Record<string, boolean>>((acc, node) => Object.assign(acc, { [node.id]: true }), {});
    const allNodesLinks = nodes.flatMap((node) => Creator.linksByNodeIDSelector(state)(node.id));
    const incomingLinks = allNodesLinks.filter(({ source, target }) => nodeIDMap[target.nodeID] && !nodeIDMap[source.nodeID]);
    const outgoingLinks = allNodesLinks.filter(({ source, target }) => !nodeIDMap[target.nodeID] && nodeIDMap[source.nodeID]);

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

    const convertedDiagram = Realtime.Adapters.creatorAdapter.toDB(
      {
        data,
        links: adjustedLinks,
        viewport: { zoom: 1, x: 0, y: 0 },
        diagramID: '',
      } as Realtime.CreatorDiagram,
      { nodes: Utils.normalized.normalize(adjustedNodes), ports: Utils.normalized.normalize(adjustedPorts), platform, context: {} }
    );

    diagram.nodes = { ...diagram.nodes, ...convertedDiagram.nodes };
    diagram.children = [...diagram.children, ...convertedDiagram.children];

    if (incomingLinks.length === 1) {
      const incomingLink = incomingLinks[0];

      const startNode = Object.values(diagram.nodes).find((node) => node.type === BaseNode.NodeType.START);
      const connectedNode = Object.values(diagram.nodes).find((node) => node.nodeID === incomingLink.target.nodeID);
      const startNodeNextPort: BaseModels.BasePort =
        (startNode?.data.ports as BaseModels.BasePort[])?.find((port) => port.type === BaseModels.PortType.NEXT) ?? startNode?.data.ports?.[0];

      if (startNode && connectedNode && startNodeNextPort) {
        startNodeNextPort.target = connectedNode.nodeID;
      }
    }

    const diagramID = await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const { id: diagramID } = await dispatch(createDiagram(diagram));

          await dispatch(addDiagramIDIntoComponentsList(diagramID));

          return diagramID;
        },
        async (context) => {
          const newDiagram = await dispatch(waitAsync(Realtime.diagram.createComponent, { ...context, diagram }));

          return newDiagram.id;
        }
      )
    );

    return {
      name,
      diagramID,
      incomingLinkSource: incomingLinks.length === 1 ? incomingLinks[0].source : null,
      outgoingLinkTarget: outgoingLinks.length === 1 ? outgoingLinks[0].target : null,
    };
  };

export const duplicateDiagram =
  (diagramID: string, { openDiagram = false }: { openDiagram?: boolean } = {}): Thunk<string> =>
  async (dispatch, getState) => {
    const newDiagramID = await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const state = getState();
          const versionID = Session.activeVersionIDSelector(state);
          const rootDiagramID = VersionV2.active.rootDiagramIDSelector(state);
          const allDiagrams = DiagramV2.allDiagramsSelector(state);
          const isTopicsAndComponentsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);
          const isTopicsAndComponentsVersion = ProjectV2.active.isTopicsAndComponentsVersionSelector(state);

          Errors.assertVersionID(versionID);
          Errors.assertDiagramID(rootDiagramID);

          const { _id, type = BaseModels.DiagramType.COMPONENT, ...diagram } = await client.api.diagram.get(diagramID);

          const newFlowName = Realtime.Utils.diagram.getUniqueCopyName(diagram.name, Utils.array.unique(allDiagrams.map(({ name }) => name)));

          const { id: newDiagramID } = await dispatch(
            createDiagram({ ...diagram, intentStepIDs: diagram.intentStepIDs ?? [], type, name: newFlowName })
          );

          if (isTopicsAndComponentsEnabled && isTopicsAndComponentsVersion) {
            await dispatch(addDiagramIDIntoComponentsList(newDiagramID));
          }

          await dispatch(loadDiagrams(versionID, rootDiagramID));

          return newDiagramID;
        },
        async (context) => {
          const diagram = await dispatch(waitAsync(Realtime.diagram.duplicate, { ...context, diagramID }));

          return diagram.id;
        }
      )
    );

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
    const rootDiagramID = VersionV2.active.rootDiagramIDSelector(state);
    const isTopicsAndComponentsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);
    const isTopicsAndComponentsVersion = ProjectV2.active.isTopicsAndComponentsVersionSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(rootDiagramID);

    // if the user is on the deleted diagram, redirect to root
    const activeDiagramID = Session.activeDiagramIDSelector(state);

    if (diagramID === activeDiagramID) {
      await dispatch(Router.goToRootDiagram());
    }

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          if (isTopicsAndComponentsEnabled && isTopicsAndComponentsVersion) {
            const { type } = diagramByIDSelector(state)(diagramID) ?? {};
            const { topics = [], components = [] } = VersionV2.active.versionSelector(state) ?? {};

            if (type === BaseModels.DiagramType.TOPIC) {
              const newTopics = topics.filter(({ sourceID }) => sourceID !== diagramID);

              await dispatch(saveTopics(newTopics));
            } else if (type === BaseModels.DiagramType.COMPONENT) {
              const newComponents = components.filter(({ sourceID }) => sourceID !== diagramID);

              await dispatch(saveComponents(newComponents));
            }
          }

          await client.api.diagram.options({ headers: { rtctimestamp: mutableStore.getRTCTimestamp() } }).delete(diagramID);
          await dispatch(loadDiagrams(versionID, rootDiagramID));
        },
        async (context) => {
          await dispatch.sync(Realtime.diagram.crud.remove({ ...context, key: diagramID }));
        }
      )
    );
  };

export const renameDiagram =
  (diagramID: string, name: string): Thunk =>
  async (dispatch) => {
    return dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(crud.patch(diagramID, { name }));

          await client.api.diagram.options({ headers: { rtctimestamp: mutableStore.getRTCTimestamp() } }).update(diagramID, { name });
        },
        async (context) => {
          await dispatch.sync(Realtime.diagram.crud.patch({ ...context, key: diagramID, value: { name } }));
        }
      )
    );
  };

export const convertToTopic =
  (diagramID: string): Thunk =>
  (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          throw new Error('Not implemented');
        },
        async (context) => {
          RootPageProgressBar.start(PageProgressBar.TOPIC_CREATING);

          const state = getState();
          const activeDiagramID = Session.activeDiagramIDSelector(state);

          if (diagramID === activeDiagramID) {
            await dispatch(Router.goToRootDiagram());
          }

          try {
            await dispatch(waitAsync(Realtime.diagram.convertToTopic, { ...context, diagramID }));
          } catch (err) {
            if (err instanceof AsyncActionError && err.code === Realtime.ErrorCode.CANNOT_CONVERT_TO_TOPIC) {
              logger.warn(`unable to convert to topic: ${err.message}`);
            } else {
              throw err;
            }
          }

          RootPageProgressBar.stop(PageProgressBar.TOPIC_CREATING);
        }
      )
    );

// active diagram

/**
 * @deprecated changes will be synched by the new realtime service
 */
export const saveActiveDiagram = (): Thunk => async (_, getState) => {
  const state = getState();
  const fullDiagram = fullActiveDiagramSelector(state);
  const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS_PHASE_2);
  const isTopicsAndComponentsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = ProjectV2.active.isTopicsAndComponentsVersionSelector(state);

  if (isAtomicActions) return;

  if (!fullDiagram) throw Errors.noActiveDiagramID();

  const { _id, ...activeDiagram } = fullDiagram;

  if (!isTopicsAndComponentsEnabled || !isTopicsAndComponentsVersion) {
    delete activeDiagram.type;
  }

  if (activeDiagram.type !== BaseModels.DiagramType.TOPIC) {
    delete activeDiagram.intentStepIDs;
  }

  await client.api.diagram.options({ headers: { rtctimestamp: mutableStore.getRTCTimestamp() } }).update(_id, activeDiagram);
};

/**
 * @deprecated changes will be synched by the new realtime service
 */
export const saveActiveDiagramVariables = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const diagramID = Creator.creatorDiagramIDSelector(state);
  const variables = DiagramV2.localVariablesByDiagramIDSelector(state, { id: diagramID });
  const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
  if (isAtomicActions) return;

  Errors.assertDiagramID(diagramID);

  const rtctimestamp = mutableStore.getRTCTimestamp();
  await client.api.diagram.options({ headers: { rtctimestamp } }).update(diagramID, { variables });
};

export const addActiveDiagramVariable =
  (variable: string, creationType: CanvasCreationType): Thunk =>
  (dispatch, getState) => {
    const activeDiagramID = Creator.creatorDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    return dispatch(addLocalVariable(activeDiagramID, variable, creationType));
  };

export const removeActiveDiagramVariable =
  (variable: string): Thunk =>
  (dispatch, getState) => {
    const activeDiagramID = Creator.creatorDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    return dispatch(removeLocalVariable(activeDiagramID, variable));
  };

const updateIntentSteps =
  (diagramID: string, intentStepIDs: string[]): Thunk =>
  async (dispatch) => {
    const rtctimestamp = mutableStore.getRTCTimestamp();

    dispatch(crud.patch(diagramID, { intentStepIDs }));
    await client.api.diagram.options({ headers: { rtctimestamp } }).update(diagramID, { intentStepIDs });
  };

export const reorderIntentStepIDs =
  (diagramID: string, from: number, to: number): Thunk =>
  (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const activeDiagram = DiagramV2.diagramByIDSelector(getState(), { id: diagramID });

          await dispatch(updateIntentSteps(diagramID, Utils.array.reorder(activeDiagram?.intentStepIDs ?? [], from, to)));
        },
        async (context) => {
          await dispatch.sync(Realtime.diagram.reorderIntentSteps({ ...context, diagramID, from, to }));
        }
      )
    );
