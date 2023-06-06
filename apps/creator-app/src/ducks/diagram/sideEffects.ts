import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import { PageProgress } from '@/components/PageProgressBar/utils';
import * as Errors from '@/config/errors';
import { PageProgressBar, RESERVED_JS_WORDS } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import { setLastCreatedID } from '@/ducks/diagramV2/actions';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Tracking from '@/ducks/tracking';
import { CanvasCreationType, VariableType } from '@/ducks/tracking/constants';
import { waitAsync } from '@/ducks/utils';
import { ActiveVersionContext, assertVersionContext, getActiveVersionContext } from '@/ducks/version/utils';
import * as VersionV2 from '@/ducks/versionV2';
import { SyncThunk, Thunk } from '@/store/types';
import { BLOCK_WIDTH } from '@/styles/theme';
import { PathPoint, Point } from '@/types';
import { getNodesGroupCenter } from '@/utils/node';

// side effects

export const createEmptyComponent =
  (name: string): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();

    PageProgress.start(PageProgressBar.COMPONENT_CREATING);

    const diagram = await dispatch(
      waitAsync(Realtime.diagram.componentCreate, {
        ...getActiveVersionContext(state),
        component: { name: name || `Component ${VersionV2.active.componentsSelector(state).length + 1}` },
      })
    );

    dispatch(Tracking.trackComponentCreated());
    dispatch(setLastCreatedID({ id: diagram.id }));

    PageProgress.stop(PageProgressBar.COMPONENT_CREATING);

    return diagram.id;
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
    const schemaVersion = VersionV2.active.schemaVersionSelector(state);

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

    const dbCreatorDiagram = Realtime.Adapters.creatorAdapter.toDB(
      {
        data,
        ports: [],
        nodes: [],
        links: adjustedLinks,
        viewport: { zoom: 1, x: 0, y: 0 },
        diagramID: '',
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

interface ConvertToDiagramResult {
  name: string;
  diagramID: string;
  outgoingLinkTarget: Nullable<{ nodeID: string; portID: string }>;
  incomingLinkSource: Nullable<{ nodeID: string; portID: string }>;
}

export const convertToComponent =
  ({ data, nodes, links, ports, startCoords = Realtime.START_NODE_POSITION }: CreateDiagramWithDataOptions): Thunk<ConvertToDiagramResult> =>
  async (dispatch, getState) => {
    const state = getState();
    const activeComponents = VersionV2.active.componentsSelector(state);

    const name = `Component ${activeComponents.length + 1}`;
    const component = Realtime.Utils.diagram.componentDiagramFactory(name, startCoords);

    const { incomingLinks, outgoingLinks, dbCreatorDiagram } = dispatch(getDiagramToCreate({ data, nodes, links, ports, startCoords }));

    component.nodes = { ...component.nodes, ...dbCreatorDiagram.nodes };

    if (incomingLinks.length === 1) {
      const incomingLink = incomingLinks[0];

      const startNode = Object.values(component.nodes).find((node) => node.type === BaseNode.NodeType.START);
      const connectedNode = Object.values(component.nodes).find((node) => node.nodeID === incomingLink.target.nodeID);
      const startNodeNextPort = startNode?.data.portsV2?.builtIn[BaseModels.PortType.NEXT];

      if (startNode && connectedNode && startNodeNextPort) {
        startNodeNextPort.target = connectedNode.nodeID;
      }
    }

    const diagram = await dispatch(
      waitAsync(Realtime.diagram.componentCreate, {
        ...getActiveVersionContext(getState()),
        component,
      })
    );

    dispatch(Tracking.trackComponentCreated());
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

export const duplicateComponent =
  (componentID: string, { openDiagram = false }: { openDiagram?: boolean } = {}): Thunk<string> =>
  async (dispatch, getState) => {
    const diagram = await dispatch(
      waitAsync(Realtime.diagram.componentDuplicate, {
        ...getActiveVersionContext(getState()),
        diagramID: componentID,
      })
    );

    if (openDiagram) {
      await dispatch(Router.goToDiagram(diagram.id));
    }

    dispatch(setLastCreatedID({ id: diagram.id }));

    return diagram.id;
  };

const goToRootDiagramIfActive =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    // if the user is on the deleted diagram, redirect to root
    const activeDiagramID = CreatorV2.activeDiagramIDSelector(getState());

    if (diagramID === activeDiagramID) {
      await dispatch(Router.goToRootDiagram());
    }
  };

export const deleteComponentDiagram =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch(goToRootDiagramIfActive(diagramID));

    await dispatch.sync(Realtime.diagram.componentRemove({ ...getActiveVersionContext(state), diagramID }));

    dispatch(Tracking.trackComponentDeleted());
  };

export const renameDiagram =
  (diagramID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.diagram.crud.patch({ ...getActiveVersionContext(getState()), key: diagramID, value: { name } }));
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

    await dispatch.sync(Realtime.diagram.addLocalVariable({ ...getActiveVersionContext(getState()), variable, diagramID: activeDiagramID }));

    dispatch(Tracking.trackVariableCreated({ diagramID: activeDiagramID, variableType: VariableType.COMPONENT, creationType }));
  };

export const removeActiveDiagramVariable =
  (variable: string): Thunk =>
  async (dispatch, getState) => {
    const activeDiagramID = CreatorV2.activeDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    await dispatch.sync(
      Realtime.diagram.removeLocalVariable({
        ...getActiveVersionContext(getState()),
        variable,
        diagramID: activeDiagramID,
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
    assertVersionContext(context);
    Errors.assertDiagramID(diagramID);

    await dispatch.sync(
      Realtime.diagram.awareness.heartbeat({
        diagramID,
        ...context,
        ...data,
      })
    );
  };
