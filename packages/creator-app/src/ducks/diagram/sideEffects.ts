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
import { ActiveVersionContext, assertVersionContext, getActiveVersionContext } from '@/ducks/version/utils';
import * as VersionV2 from '@/ducks/versionV2';
import { Thunk } from '@/store/types';
import { BLOCK_WIDTH } from '@/styles/theme';
import { PathPoint, Point } from '@/types';
import logger from '@/utils/logger';
import { AsyncActionError } from '@/utils/logux';
import { getNodesGroupCenter } from '@/utils/node';

// side effects

export const removeLocalVariable =
  (diagramID: string, variable: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.diagram.removeLocalVariable({
        ...getActiveVersionContext(getState()),
        variable,
        diagramID,
      })
    );
  };

export const addLocalVariable =
  (diagramID: string, variable: string, creationType: CanvasCreationType): Thunk =>
  async (dispatch, getState) => {
    if (RESERVED_JS_WORDS.includes(variable)) {
      throw new Error("Reserved word. You can prefix with '_' to fix this issue");
    }

    await dispatch.sync(Realtime.diagram.addLocalVariable({ ...getActiveVersionContext(getState()), variable, diagramID }));

    dispatch(Tracking.trackVariableCreated({ variableType: VariableType.COMPONENT, diagramID, creationType }));
  };

export const createTopicDiagram =
  (name: string): Thunk<Realtime.Diagram> =>
  async (dispatch, getState) => {
    PageProgress.start(PageProgressBar.TOPIC_CREATING);

    const diagram = await dispatch(
      waitAsync(Realtime.diagram.createTopic, {
        ...getActiveVersionContext(getState()),
        diagram: { name },
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
      waitAsync(Realtime.diagram.createComponent, {
        ...getActiveVersionContext(state),
        diagram: { name: name || `Component ${activeComponents.length + 1}` },
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
    const diagram = Realtime.Utils.diagram.componentDiagramFactory(name, startCoords);

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

    diagram.nodes = { ...diagram.nodes, ...convertedDiagram.nodes };
    diagram.children = [...diagram.children, ...convertedDiagram.children];

    if (incomingLinks.length === 1) {
      const incomingLink = incomingLinks[0];

      const startNode = Object.values(diagram.nodes).find((node) => node.type === BaseNode.NodeType.START);
      const connectedNode = Object.values(diagram.nodes).find((node) => node.nodeID === incomingLink.target.nodeID);
      const startNodeNextPort = startNode?.data.portsV2?.builtIn[BaseModels.PortType.NEXT];

      if (startNode && connectedNode && startNodeNextPort) {
        startNodeNextPort.target = connectedNode.nodeID;
      }
    }

    const newDiagram = await dispatch(
      waitAsync(Realtime.diagram.createComponent, {
        ...getActiveVersionContext(getState()),
        diagram,
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
    waitAsync(Realtime.diagram.createTemplateDiagram, {
      ...getActiveVersionContext(state),
      diagram: { name: 'Template Diagram' },
    })
  );

  return diagram.id;
};

export const duplicateDiagram =
  (diagramID: string, { openDiagram = false }: { openDiagram?: boolean } = {}): Thunk<string> =>
  async (dispatch, getState) => {
    const newDiagram = await dispatch(
      waitAsync(Realtime.diagram.duplicate, {
        ...getActiveVersionContext(getState()),
        diagramID,
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
    const rootDiagramID = VersionV2.active.rootDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(rootDiagramID);

    // if the user is on the deleted diagram, redirect to root
    const activeDiagramID = CreatorV2.activeDiagramIDSelector(state);

    if (diagramID === activeDiagramID) {
      await dispatch(Router.goToRootDiagram());
    }

    const { type } = DiagramV2.diagramByIDSelector(state, { id: diagramID }) ?? {};
    const isTopic = type === BaseModels.Diagram.DiagramType.TOPIC;
    const isComponent = !type || type === BaseModels.Diagram.DiagramType.COMPONENT;

    await dispatch.sync(
      Realtime.diagram.crud.remove({
        ...getActiveVersionContext(state),
        key: diagramID,
      })
    );

    if (isTopic) {
      dispatch(Tracking.trackTopicDeleted());
    } else if (isComponent) {
      dispatch(Tracking.trackComponentDeleted());
    }
  };

export const renameDiagram =
  (diagramID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.diagram.crud.patch({ ...getActiveVersionContext(getState()), key: diagramID, value: { name } }));
  };

export const convertToTopic =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    PageProgress.start(PageProgressBar.TOPIC_CREATING);

    const state = getState();
    const activeDiagramID = CreatorV2.activeDiagramIDSelector(state);

    if (diagramID === activeDiagramID) {
      await dispatch(Router.goToRootDiagram());
    }

    try {
      await dispatch(
        waitAsync(Realtime.diagram.convertToTopic, {
          ...getActiveVersionContext(getState()),
          diagramID,
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
  (dispatch, getState) => {
    const activeDiagramID = CreatorV2.activeDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    return dispatch(addLocalVariable(activeDiagramID, variable, creationType));
  };

export const removeActiveDiagramVariable =
  (variable: string): Thunk =>
  (dispatch, getState) => {
    const activeDiagramID = CreatorV2.activeDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    return dispatch(removeLocalVariable(activeDiagramID, variable));
  };

export const reorderIntentStepIDs =
  (diagramID: string, from: number, to: number): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.diagram.reorderIntentSteps({
        ...getActiveVersionContext(getState()),
        to,
        from,
        diagramID,
      })
    );
  };

export const diagramHeartbeat =
  (
    { diagramID, ...context }: ActiveVersionContext & { diagramID: Nullable<string> },
    data: {
      lock: Nullable<{ type: Realtime.diagram.awareness.LockEntityType; entityIDs: string[] }>;
      unlock: Nullable<{ type: Realtime.diagram.awareness.LockEntityType; entityIDs: string[] }>;
      locksMap: Realtime.diagram.awareness.HeartbeatLocksMap;
      forceSync: boolean;
    }
  ): Thunk =>
  async (dispatch) => {
    Errors.assertDiagramID(diagramID);
    assertVersionContext(context);

    await dispatch.sync(
      Realtime.diagram.awareness.heartbeat({
        diagramID,
        ...context,
        ...data,
      })
    );
  };
