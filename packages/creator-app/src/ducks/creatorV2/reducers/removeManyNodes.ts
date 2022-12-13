import * as Realtime from '@voiceflow/realtime-sdk';

import * as Project from '@/ducks/projectV2';
import { createReverter } from '@/ducks/utils';
import * as Version from '@/ducks/versionV2';

import { allPortsByIDsSelector, linksByNodeIDSelector, nodeByIDSelector, nodeDataByIDSelector, portsByNodeIDSelector } from '../selectors';
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
    const nodeIDs = nodes.map<string>((node) => node.stepID ?? node.parentNodeID);
    const nodesWithData = nodeIDs.flatMap((nodeID) => {
      const node = nodeByIDSelector(state, { id: nodeID });
      const data = nodeDataByIDSelector(state, { id: nodeID });
      if (!node || !data) return [];

      return [{ node, data }];
    });
    const portsIDs = nodeIDs.flatMap((nodeID) => Realtime.Utils.port.flattenAllPorts(portsByNodeIDSelector(state, { id: nodeID })));
    const ports = allPortsByIDsSelector(state, { ids: portsIDs });
    const schemaVersion = Version.active.schemaVersionSelector(state);
    const links = nodeIDs.flatMap((nodeID) => linksByNodeIDSelector(state, { id: nodeID }));

    if (!nodesWithData.length) return null;

    return Realtime.creator.importSnapshot({
      workspaceID,
      projectID,
      versionID,
      domainID,
      diagramID,
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
