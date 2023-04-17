import * as Realtime from '@voiceflow/realtime-sdk';

import * as Project from '@/ducks/projectV2';
import { createReverter } from '@/ducks/utils';
import * as Version from '@/ducks/versionV2';

import {
  allPortsByIDsSelector,
  builtInPortTypeSelector,
  byKeyPortKeySelector,
  linksByNodeIDSelector,
  nodeByIDSelector,
  nodeDataByIDSelector,
  portsByNodeIDSelector,
} from '../selectors';
import { removeManyNodes } from '../utils';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const removeManyNodesReducer = createActiveDiagramReducer(Realtime.node.removeMany, (state, { nodes }) => {
  const nodeIDs = nodes.map((node) => node.stepID ?? node.parentNodeID);

  removeManyNodes(state, nodeIDs);
});

export default removeManyNodesReducer;

export const removeManyNodesReverter = createReverter(
  Realtime.node.removeMany,

  ({ workspaceID, projectID, versionID, domainID, diagramID, nodes }, getState) => {
    const state = getState();
    const projectMeta = Project.active.metaSelector(state);
    const schemaVersion = Version.active.schemaVersionSelector(state);
    const nodeIDs = nodes.map<string>((node) => node.stepID ?? node.parentNodeID);
    const nodesWithData = nodeIDs.flatMap((nodeID) => {
      const node = nodeByIDSelector(state, { id: nodeID });
      const data = nodeDataByIDSelector(state, { id: nodeID });
      if (!node || !data) return [];

      return [{ node, data }];
    });

    if (!nodesWithData.length) return null;

    const actionContext = {
      workspaceID,
      projectID,
      versionID,
      domainID,
      diagramID,
    };

    const firstNodeData = nodesWithData[0];
    if (nodesWithData.length === 1 && firstNodeData.node.parentNode) {
      const parentNode = nodeByIDSelector(state, { id: firstNodeData.node.parentNode });

      if (!parentNode) return null;

      const index = parentNode.combinedNodes.indexOf(firstNodeData.node.id);

      if (index === -1) return null;

      const ports = portsByNodeIDSelector(state, { id: firstNodeData.node.id });
      const links = linksByNodeIDSelector(state, { id: firstNodeData.node.id });

      return [
        Realtime.node.insertStep({
          ...actionContext,
          projectMeta,
          schemaVersion,
          index,
          parentNodeID: firstNodeData.node.parentNode,
          stepID: firstNodeData.node.id,
          data: firstNodeData.data,
          ports: {
            in: ports.in.map((port) => ({ id: port })),
            out: {
              byKey: Object.fromEntries(Object.entries(ports.out.byKey).map(([key, port]) => [key, { id: port }])),
              builtIn: Object.fromEntries(Object.entries(ports.out.builtIn).map(([key, port]) => [key, { id: port }])),
              dynamic: ports.out.dynamic.map((port) => ({ id: port })),
            },
          },
          nodePortRemaps: [],
        }),

        ...links.map((link) => {
          const portKey = byKeyPortKeySelector(state, { id: link.source.portID });
          const portType = builtInPortTypeSelector(state, { id: link.source.portID });

          const context = {
            ...actionContext,
            sourceParentNodeID: parentNode.id,
            sourceNodeID: link.source.nodeID,
            sourcePortID: link.source.portID,
            targetNodeID: link.target.nodeID,
            targetPortID: link.target.portID,
            data: link.data,
            linkID: link.id,
          };

          if (portKey) return Realtime.link.addByKey({ ...context, key: portKey });

          if (portType) return Realtime.link.addBuiltin({ ...context, type: portType });

          return Realtime.link.addDynamic(context);
        }),
      ];
    }

    const portsIDs = nodeIDs.flatMap((nodeID) => Realtime.Utils.port.flattenAllPorts(portsByNodeIDSelector(state, { id: nodeID })));
    const ports = allPortsByIDsSelector(state, { ids: portsIDs });
    const links = nodeIDs.flatMap((nodeID) => linksByNodeIDSelector(state, { id: nodeID }));

    return Realtime.creator.importSnapshot({
      ...actionContext,
      links,
      ports,
      projectMeta,
      schemaVersion,
      nodesWithData,
    });
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.RemoveManyPayload>((origin, nodeID) =>
      origin.nodes.some((node) => (node.stepID ?? node.parentNodeID) === nodeID)
    ),
    createDiagramInvalidator(Realtime.node.insertStep, (origin, subject) => origin.nodes.some((node) => node.parentNodeID === subject.parentNodeID)),
    createDiagramInvalidator(Realtime.node.reorderSteps, (origin, subject) =>
      origin.nodes.some((node) => node.parentNodeID === subject.parentNodeID)
    ),
    createDiagramInvalidator(Realtime.node.moveMany, (origin, subject) => origin.nodes.some((node) => !!subject.blocks[node.parentNodeID])),
    createDiagramInvalidator(Realtime.node.updateDataMany, (origin, subject) =>
      origin.nodes.some((originNode) => subject.nodes.some((subjectNode) => originNode.stepID === subjectNode.nodeID))
    ),
    createDiagramInvalidator(Realtime.port.addBuiltin, (origin, subject) =>
      origin.nodes.some((node) => (node.stepID ?? node.parentNodeID) === subject.nodeID)
    ),
    createDiagramInvalidator(Realtime.port.addBuiltin, (origin, subject) =>
      origin.nodes.some((node) => (node.stepID ?? node.parentNodeID) === subject.nodeID)
    ),
    createDiagramInvalidator(Realtime.port.addDynamic, (origin, subject) =>
      origin.nodes.some((node) => (node.stepID ?? node.parentNodeID) === subject.nodeID)
    ),
    createDiagramInvalidator(Realtime.port.reorderDynamic, (origin, subject) =>
      origin.nodes.some((node) => (node.stepID ?? node.parentNodeID) === subject.nodeID)
    ),
    createDiagramInvalidator(Realtime.link.addBuiltin, (origin, subject) =>
      origin.nodes.some((node) => [subject.sourceNodeID, subject.targetNodeID].includes(node.stepID ?? node.parentNodeID))
    ),
    createDiagramInvalidator(Realtime.link.addByKey, (origin, subject) =>
      origin.nodes.some((node) => [subject.sourceNodeID, subject.targetNodeID].includes(node.stepID ?? node.parentNodeID))
    ),
    createDiagramInvalidator(Realtime.link.addDynamic, (origin, subject) =>
      origin.nodes.some((node) => [subject.sourceNodeID, subject.targetNodeID].includes(node.stepID ?? node.parentNodeID))
    ),
  ]
);
