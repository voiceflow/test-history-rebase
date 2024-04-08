import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import { PageProgress } from '@/components/PageProgressBar/utils';
import * as Errors from '@/config/errors';
import { PageProgressBar } from '@/constants';
import { linksByNodeIDSelector } from '@/ducks/creatorV2/selectors';
import { setLastCreatedID } from '@/ducks/diagramV2/actions';
import { diagramByIDSelector } from '@/ducks/diagramV2/selectors';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { waitAsync } from '@/ducks/utils';
import { schemaVersionSelector } from '@/ducks/versionV2/selectors/active';
import {
  ActiveDomainContext,
  ActiveVersionContext,
  assertDomainContext,
  assertVersionContext,
  getActiveDomainContext,
  getActiveVersionContext,
} from '@/ducks/versionV2/utils';
import { SyncThunk, Thunk } from '@/store/types';
import { BLOCK_WIDTH } from '@/styles/theme';
import { PathPoint, Point } from '@/types';
import { getNodesGroupCenter } from '@/utils/node';

// side effects

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const createTopicDiagramForDomain =
  (domainID: string, { name }: { name: string }): Thunk<Realtime.Diagram> =>
  async (dispatch, getState) => {
    PageProgress.start(PageProgressBar.TOPIC_CREATING);

    const diagram = await dispatch(
      waitAsync(Realtime.domain.topicCreate, {
        ...getActiveVersionContext(getState()),
        domainID,
        topic: { name },
      })
    );

    dispatch(Tracking.trackTopicCreated());

    PageProgress.stop(PageProgressBar.TOPIC_CREATING);

    return diagram;
  };

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const deleteTopicDiagramForDomain =
  (domainID: string, diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch(Router.goToRootDiagramIfActive(diagramID));

    await dispatch.sync(Realtime.domain.topicRemove({ ...getActiveVersionContext(state), domainID, topicID: diagramID }));

    dispatch(Tracking.trackTopicDeleted());
  };

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const createTopicDiagram =
  (name: string): Thunk<Realtime.Diagram> =>
  async (dispatch, getState) => {
    const domainID = Session.activeDomainIDSelector(getState());

    Errors.assertDomainID(domainID);

    const diagram = await dispatch(createTopicDiagramForDomain(domainID, { name }));

    dispatch(setLastCreatedID({ id: diagram.id }));

    return diagram;
  };

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const createSubtopicDiagram =
  (rootTopicID: string, name: string): Thunk<Realtime.Diagram> =>
  async (dispatch, getState) => {
    PageProgress.start(PageProgressBar.TOPIC_CREATING);

    const diagram = await dispatch(
      waitAsync(Realtime.diagram.subtopicCreate, {
        ...getActiveDomainContext(getState()),
        subtopic: { name },
        rootTopicID,
      })
    );

    dispatch(Tracking.trackSubtopicCreated({ topicID: rootTopicID }));
    dispatch(setLastCreatedID({ id: diagram.id }));

    PageProgress.stop(PageProgressBar.TOPIC_CREATING);

    return diagram;
  };

interface CreateDiagramWithDataOptions {
  data: Record<string, Realtime.NodeData<unknown>>;
  nodes: Realtime.Node[];
  links: Realtime.Link[];
  ports: Realtime.Port[];
  startCoords?: Point;
}

interface CreateDiagramWithDataResult {
  incomingLinks: Realtime.Link[];
  outgoingLinks: Realtime.Link[];
  dbCreatorDiagram: Realtime.Adapters.DBCreatorDiagram;
}

const getDiagramToCreate =
  ({ data, nodes, links, ports, startCoords = Realtime.START_NODE_POSITION }: CreateDiagramWithDataOptions): SyncThunk<CreateDiagramWithDataResult> =>
  (_, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const projectType = ProjectV2.active.projectTypeSelector(state);
    const schemaVersion = schemaVersionSelector(state);
    const allNodesLinks = nodes.flatMap((node) => linksByNodeIDSelector(state, { id: node.id }));

    const nodeIDMap = nodes.reduce<Record<string, boolean>>((acc, node) => Object.assign(acc, { [node.id]: true }), {});
    const incomingLinks = allNodesLinks.filter(({ source, target }) => nodeIDMap[target.nodeID] && !nodeIDMap[source.nodeID]);
    const outgoingLinks = allNodesLinks.filter(({ source, target }) => !nodeIDMap[target.nodeID] && nodeIDMap[source.nodeID]);

    const { center, minX } = getNodesGroupCenter(
      nodes.map((node) => ({ data: data[node.id], node })),
      links
    );

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

    const dbCreatorDiagram = Realtime.Adapters.creatorAdapter.toDB(
      {
        data,
        ports: [],
        nodes: [],
        links: adjustedLinks,
        viewport: { zoom: 1, x: 0, y: 0 },
        rootNodeIDs: [],
        markupNodeIDs: [],
      },
      { nodes: normalize(adjustedNodes), ports: normalize(adjustedPorts), platform, projectType, context: { schemaVersion } }
    );

    return {
      incomingLinks,
      outgoingLinks,
      dbCreatorDiagram,
    };
  };

export interface ConvertToDiagramResult {
  name: string;
  diagramID: string;
  outgoingLinkTarget: Nullable<{ nodeID: string; portID: string }>;
  incomingLinkSource: Nullable<{ nodeID: string; portID: string }>;
}

interface ConvertToSubtopicOptions extends CreateDiagramWithDataOptions {
  rootTopicID: string;
}

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const convertToSubtopic =
  ({ data, nodes, links, ports, rootTopicID, startCoords = Realtime.START_NODE_POSITION }: ConvertToSubtopicOptions): Thunk<ConvertToDiagramResult> =>
  async (dispatch, getState) => {
    const state = getState();
    const rootTopic = diagramByIDSelector(state, { id: rootTopicID });

    const subtopics = rootTopic?.menuItems.filter((item) => item.type === BaseModels.Diagram.MenuItemType.DIAGRAM) ?? [];

    const name = `Sub Topic ${subtopics.length + 1}`;
    const subtopic = Realtime.Utils.diagram.topicDiagramFactory(name, startCoords);

    const { incomingLinks, outgoingLinks, dbCreatorDiagram } = dispatch(getDiagramToCreate({ data, nodes, links, ports }));

    const nodesArr = Object.values(dbCreatorDiagram.nodes);
    const hasIntent = nodesArr.some((node) => node.type === BaseNode.NodeType.INTENT);

    if (hasIntent) {
      subtopic.nodes = dbCreatorDiagram.nodes;
      subtopic.menuItems = nodesArr
        .filter(Realtime.Utils.typeGuards.isDiagramMenuDBNode)
        .map<BaseModels.Diagram.MenuItem>((node) => ({ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: node.nodeID }));
    } else {
      subtopic.nodes = { ...subtopic.nodes, ...dbCreatorDiagram.nodes };
    }

    if (incomingLinks.length === 1 && !hasIntent) {
      const incomingLink = incomingLinks[0];

      const subtopicNodesArr = Object.values(subtopic.nodes);
      const intentNode = subtopicNodesArr.find((node) => node.type === BaseNode.NodeType.INTENT);
      const connectedNode = subtopicNodesArr.find((node) => node.nodeID === incomingLink.target.nodeID);
      const intentNodeNextPort = intentNode?.data.portsV2?.builtIn[BaseModels.PortType.NEXT];

      if (intentNode && connectedNode && intentNodeNextPort) {
        intentNodeNextPort.target = connectedNode.nodeID;
      }
    }

    const diagram = await dispatch(
      waitAsync(Realtime.diagram.subtopicCreate, {
        ...getActiveDomainContext(getState()),
        subtopic,
        rootTopicID,
      })
    );

    dispatch(Tracking.trackSubtopicCreated({ topicID: rootTopicID }));
    dispatch(setLastCreatedID({ id: diagram.id }));

    return {
      name,
      diagramID: diagram.id,
      incomingLinkSource: incomingLinks.length === 1 ? incomingLinks[0].source : null,
      outgoingLinkTarget: outgoingLinks.length === 1 ? outgoingLinks[0].target : null,
    };
  };

export const createTemplateDiagram = (): Thunk<string> => async (dispatch, getState) => {
  const state = getState();

  const diagram = await dispatch(
    waitAsync(Realtime.diagram.templateCreate, {
      ...getActiveVersionContext(state),
      template: { name: 'Template Diagram' },
    })
  );

  return diagram.id;
};

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const deleteSubtopicDiagram =
  (diagramID: string, rootTopicID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch(Router.goToRootDiagramIfActive(diagramID));

    await dispatch.sync(Realtime.diagram.subtopicRemove({ ...getActiveDomainContext(state), subtopicID: diagramID, rootTopicID }));

    dispatch(Tracking.trackTopicDeleted());
  };

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const moveSubtopicDiagram =
  (subtopicID: string, diagramID: string, newTopicID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const subtopicAlreadyExists = state.diagramV2.byKey[newTopicID].menuItems.find((i) => i.sourceID === subtopicID);

    if (subtopicAlreadyExists) return;

    await dispatch(Router.goToRootDiagramIfActive(subtopicID));

    await dispatch.sync(
      Realtime.diagram.subtopicMove({ ...getActiveDomainContext(state), subtopicID, toTopicID: newTopicID, rootTopicID: diagramID })
    );

    dispatch(Tracking.trackSubtopicMoved({ originTopicID: diagramID, destinationTopicID: newTopicID }));
  };

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const deleteTopicDiagram =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const domainID = Session.activeDomainIDSelector(getState());

    Errors.assertDomainID(domainID);

    await dispatch(deleteTopicDiagramForDomain(domainID, diagramID));
  };

export const renameDiagram =
  (diagramID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.diagram.crud.patch({ ...getActiveVersionContext(getState()), key: diagramID, value: { name } }));
  };

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const moveTopicDomain =
  (diagramID: string, newDomainID: string, rootTopicID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const domainID = Session.activeDomainIDSelector(state);

    Errors.assertDomainID(domainID);
    Errors.assertDomainID(newDomainID);
    Errors.assertDiagramID(diagramID);

    await dispatch.sync(
      Realtime.domain.topicMoveDomain({ ...getActiveVersionContext(state), domainID, topicDiagramID: diagramID, newDomainID, rootTopicID })
    );

    dispatch(Tracking.trackTopicMovedDomain({ topicID: diagramID, originDomain: domainID, destinationDomain: newDomainID }));

    await dispatch(Router.goToDomainDiagram(newDomainID, diagramID));
  };

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const reorderMenuItem =
  ({ toIndex, sourceID, diagramID, skipPersist }: { toIndex: number; sourceID: string; diagramID: string; skipPersist?: boolean }): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.diagram.reorderMenuItem({ ...getActiveDomainContext(getState()), sourceID, toIndex, diagramID }, { skipPersist }));
  };

export const diagramHeartbeat =
  (
    { diagramID, ...context }: (ActiveDomainContext | ActiveVersionContext) & { diagramID: Nullable<string> },
    data: {
      lock: Nullable<{ type: Realtime.diagram.awareness.LockEntityType; entityIDs: string[] }>;
      unlock: Nullable<{ type: Realtime.diagram.awareness.LockEntityType; entityIDs: string[] }>;
      locksMap: Realtime.diagram.awareness.HeartbeatLocksMap;
      forceSync: boolean;
    }
  ): Thunk =>
  async (dispatch, getState) => {
    Errors.assertDiagramID(diagramID);

    const state = getState();
    let ctx = context;
    let domainID: string | null = null;

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS)) {
      ctx = { ...context, domainID };

      assertVersionContext(ctx);
    } else {
      domainID = 'domainID' in context ? context.domainID : null;
      ctx = { ...context, domainID };

      assertDomainContext(ctx);
    }

    await dispatch.sync(Realtime.diagram.awareness.heartbeat({ diagramID, ...ctx, ...data, domainID }));
  };
