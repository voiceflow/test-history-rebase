import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import { PageProgress } from '@/components/PageProgressBar/utils';
import * as Errors from '@/config/errors';
import { PageProgressBar, RESERVED_JS_WORDS } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { CanvasCreationType, VariableType } from '@/ducks/tracking/constants';
import { waitAsync } from '@/ducks/utils';
import { ActiveDomainContext, assertDomainContext, getActiveDomainContext, getActiveVersionContext } from '@/ducks/version/utils';
import * as VersionV2 from '@/ducks/versionV2';
import { Thunk } from '@/store/types';
import { BLOCK_WIDTH } from '@/styles/theme';
import { PathPoint, Point } from '@/types';
import logger from '@/utils/logger';
import { AsyncActionError } from '@/utils/logux';
import { getNodesGroupCenter } from '@/utils/node';

// side effects

export const createTopicDiagram =
  (name: string): Thunk<Realtime.Diagram> =>
  async (dispatch, getState) => {
    PageProgress.start(PageProgressBar.TOPIC_CREATING);

    const diagram = await dispatch(
      waitAsync(Realtime.domain.topicCreate, {
        ...getActiveDomainContext(getState()),
        topic: { name },
      })
    );

    dispatch(Tracking.trackTopicCreated());

    PageProgress.stop(PageProgressBar.TOPIC_CREATING);

    return diagram;
  };

export const createComponentDiagram =
  (name: string): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const activeComponents = VersionV2.active.componentsSelector(state);

    const diagram = await dispatch(
      waitAsync(Realtime.diagram.componentCreate, {
        ...getActiveVersionContext(state),
        component: { name: name || `Component ${activeComponents.length + 1}` },
      })
    );

    return diagram.id;
  };

export const createEmptyComponent =
  (name: string): Thunk<string> =>
  async (dispatch) => {
    PageProgress.start(PageProgressBar.COMPONENT_CREATING);

    const diagramID = await dispatch(createComponentDiagram(name));

    dispatch(Tracking.trackComponentCreated());

    PageProgress.stop(PageProgressBar.COMPONENT_CREATING);

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
    const projectType = ProjectV2.active.projectTypeSelector(state);
    const activeComponents = VersionV2.active.componentsSelector(state);
    const schemaVersion = VersionV2.active.schemaVersionSelector(state);
    const name = `Component ${activeComponents.length + 1}`;
    const component = Realtime.Utils.diagram.componentDiagramFactory(name, startCoords);

    const nodeIDMap = nodes.reduce<Record<string, boolean>>((acc, node) => Object.assign(acc, { [node.id]: true }), {});
    const allNodesLinks = nodes.flatMap((node) => CreatorV2.linksByNodeIDSelector(state, { id: node.id }));
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

    const convertedDiagram = Realtime.Adapters.creatorAdapter.toDB(
      {
        data,
        links: adjustedLinks,
        viewport: { zoom: 1, x: 0, y: 0 },
        diagramID: '',
      } as Realtime.CreatorDiagram,
      { nodes: normalize(adjustedNodes), ports: normalize(adjustedPorts), platform, projectType, context: { schemaVersion } }
    );

    component.nodes = { ...component.nodes, ...convertedDiagram.nodes };
    component.children = [...component.children, ...convertedDiagram.children];

    if (incomingLinks.length === 1) {
      const incomingLink = incomingLinks[0];

      const startNode = Object.values(component.nodes).find((node) => node.type === BaseNode.NodeType.START);
      const connectedNode = Object.values(component.nodes).find((node) => node.nodeID === incomingLink.target.nodeID);
      const startNodeNextPort = startNode?.data.portsV2?.builtIn[BaseModels.PortType.NEXT];

      if (startNode && connectedNode && startNodeNextPort) {
        startNodeNextPort.target = connectedNode.nodeID;
      }
    }

    const newDiagram = await dispatch(
      waitAsync(Realtime.diagram.componentCreate, {
        ...getActiveVersionContext(getState()),
        component,
      })
    );

    dispatch(Tracking.trackComponentCreated());

    return {
      name,
      diagramID: newDiagram.id,
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

export const duplicateComponent =
  (componentID: string, { openDiagram = false }: { openDiagram?: boolean } = {}): Thunk<string> =>
  async (dispatch, getState) => {
    const newDiagram = await dispatch(
      waitAsync(Realtime.diagram.componentDuplicate, {
        ...getActiveDomainContext(getState()),
        diagramID: componentID,
      })
    );

    if (openDiagram) {
      await dispatch(Router.goToDiagram(newDiagram.id));
    }

    return newDiagram.id;
  };

export const duplicateTopic =
  (topicID: string, { openDiagram = false }: { openDiagram?: boolean } = {}): Thunk<string> =>
  async (dispatch, getState) => {
    const newDiagram = await dispatch(
      waitAsync(Realtime.domain.topicDuplicate, {
        ...getActiveDomainContext(getState()),
        topicID,
      })
    );

    if (openDiagram) {
      await dispatch(Router.goToDiagram(newDiagram.id));
    }

    return newDiagram.id;
  };

export const deleteDiagram =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    // if the user is on the deleted diagram, redirect to root
    const activeDiagramID = CreatorV2.activeDiagramIDSelector(state);

    if (diagramID === activeDiagramID) {
      await dispatch(Router.goToDomainRootDiagram());
    }

    const { type } = DiagramV2.diagramByIDSelector(state, { id: diagramID }) ?? {};
    const isTopic = type === BaseModels.Diagram.DiagramType.TOPIC;

    if (isTopic) {
      await dispatch.sync(Realtime.domain.topicRemove({ ...getActiveDomainContext(state), topicID: diagramID }));
    } else {
      await dispatch.sync(Realtime.diagram.componentRemove({ ...getActiveDomainContext(state), diagramID }));
    }

    if (isTopic) {
      dispatch(Tracking.trackTopicDeleted());
    } else {
      dispatch(Tracking.trackComponentDeleted());
    }
  };

export const renameDiagram =
  (diagramID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.diagram.crud.patch({ ...getActiveVersionContext(getState()), key: diagramID, value: { name } }));
  };

export const convertComponentToTopic =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    PageProgress.start(PageProgressBar.TOPIC_CREATING);

    const state = getState();
    const activeDiagramID = CreatorV2.activeDiagramIDSelector(state);

    if (diagramID === activeDiagramID) {
      await dispatch(Router.goToDomainRootDiagram());
    }

    try {
      await dispatch(
        waitAsync(Realtime.domain.topicConvertFromComponent, {
          ...getActiveDomainContext(state),
          componentID: diagramID,
        })
      );

      dispatch(Tracking.trackTopicConversion({ diagramID }));
    } catch (err) {
      if (err instanceof AsyncActionError && err.code === Realtime.ErrorCode.CANNOT_CONVERT_TO_TOPIC) {
        logger.warn(`unable to convert to topic: ${err.message}`);
      } else {
        throw err;
      }
    }

    PageProgress.stop(PageProgressBar.TOPIC_CREATING);
  };

// active diagram

export const addActiveDiagramVariable =
  (variable: string, creationType: CanvasCreationType): Thunk =>
  async (dispatch, getState) => {
    if (RESERVED_JS_WORDS.includes(variable)) {
      throw new Error("Reserved word. You can prefix with '_' to fix this issue");
    }

    const activeDiagramID = CreatorV2.activeDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    await dispatch.sync(Realtime.diagram.addLocalVariable({ ...getActiveDomainContext(getState()), variable, diagramID: activeDiagramID }));

    dispatch(Tracking.trackVariableCreated({ diagramID: activeDiagramID, variableType: VariableType.COMPONENT, creationType }));
  };

export const removeActiveDiagramVariable =
  (variable: string): Thunk =>
  async (dispatch, getState) => {
    const activeDiagramID = CreatorV2.activeDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    await dispatch.sync(
      Realtime.diagram.removeLocalVariable({
        ...getActiveDomainContext(getState()),
        variable,
        diagramID: activeDiagramID,
      })
    );
  };

export const reorderMenuNode =
  ({ toIndex, nodeID, diagramID, skipPersist }: { diagramID: string; nodeID: string; toIndex: number; skipPersist?: boolean }): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.diagram.reorderMenuNode({ ...getActiveDomainContext(getState()), nodeID, toIndex, diagramID }, { skipPersist }));
  };

export const diagramHeartbeat =
  (
    { diagramID, ...context }: ActiveDomainContext & { diagramID: Nullable<string> },
    data: {
      lock: Nullable<{ type: Realtime.diagram.awareness.LockEntityType; entityIDs: string[] }>;
      unlock: Nullable<{ type: Realtime.diagram.awareness.LockEntityType; entityIDs: string[] }>;
      locksMap: Realtime.diagram.awareness.HeartbeatLocksMap;
      forceSync: boolean;
    }
  ): Thunk =>
  async (dispatch) => {
    assertDomainContext(context);
    Errors.assertDiagramID(diagramID);

    await dispatch.sync(
      Realtime.diagram.awareness.heartbeat({
        diagramID,
        ...context,
        ...data,
      })
    );
  };
