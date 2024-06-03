import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { builtInPortTypeSelector } from '../selectors';
import { CreatorState } from '../types';
import { createActiveDiagramReducer, DIAGRAM_INVALIDATORS } from './utils';

const importNode =
  (state: CreatorState) =>
  ({ node, data }: Realtime.NodeWithData): void => {
    const nodeID = node.id;

    state.nodes.allKeys.push(nodeID);
    state.nodes.byKey[nodeID] = data;

    if (Realtime.Utils.typeGuards.isMarkupBlockType(node.type)) {
      state.markupIDs.push(nodeID);
      state.coordsByNodeID[nodeID] = [node.x, node.y];

      return;
    }

    state.portsByNodeID[nodeID] = node.ports;
    state.linkIDsByNodeID[nodeID] = [];

    if (node.parentNode) {
      state.parentNodeIDByStepID[nodeID] = node.parentNode;
    } else {
      if (node.type === Realtime.BlockType.ACTIONS) {
        state.actionsIDs.push(nodeID);
      } else {
        state.blockIDs.push(nodeID);
      }

      state.coordsByNodeID[nodeID] = [node.x, node.y];
      state.stepIDsByParentNodeID[nodeID] = node.combinedNodes;
    }
  };

const importPort =
  (state: CreatorState) =>
  (port: Realtime.Port): void => {
    const portID = port.id;

    state.ports.allKeys.push(portID);
    state.ports.byKey[portID] = port;

    state.nodeIDByPortID[portID] = port.nodeID;
    state.linkIDsByPortID[portID] = [];
  };

const importLink =
  (state: CreatorState) =>
  (link: Realtime.Link): void => {
    const linkID = link.id;

    // validate source and target ports exist
    if (!(link.source.portID in state.ports.byKey && link.target.portID in state.ports.byKey)) {
      return;
    }

    state.links.allKeys.push(linkID);
    state.links.byKey[linkID] = link;

    state.nodeIDsByLinkID[linkID] = [link.source.nodeID, link.target.nodeID];
    state.portIDsByLinkID[linkID] = [link.source.portID, link.target.portID];
    state.linkIDsByNodeID[link.source.nodeID]?.push(linkID);
    state.linkIDsByPortID[link.source.portID]?.push(linkID);
    state.linkIDsByNodeID[link.target.nodeID]?.push(linkID);
    state.linkIDsByPortID[link.target.portID]?.push(linkID);
  };

export const importSnapshot = (state: CreatorState, { nodesWithData, ports, links }: Realtime.EntityMap): void => {
  nodesWithData.forEach(importNode(state));
  ports.forEach(importPort(state));
  links.forEach(importLink(state));
};

const importSnapshotReducer = createActiveDiagramReducer(
  Realtime.creator.importSnapshot,
  (state, { diagramID, ...entities }) => {
    importSnapshot(state, entities);
  }
);

export default importSnapshotReducer;

export const importSnapshotReverter = createReverter(
  Realtime.creator.importSnapshot,

  ({ workspaceID, projectID, versionID, diagramID, nodesWithData, links, ports }, getState) => {
    const state = getState();
    const ctx = { workspaceID, projectID, versionID, diagramID };
    const removedNodeIDs = new Set(nodesWithData.map(({ node }) => node.id));
    // no need to remove the port if the node is already being removed
    const portsToRemove = ports.filter((port) => !removedNodeIDs.has(port.nodeID));

    return [
      Realtime.link.removeMany({
        ...ctx,
        links: links.map((link) => {
          const type = builtInPortTypeSelector(state, { id: link.source.portID });

          return {
            nodeID: link.source.nodeID,
            portID: link.source.portID,
            linkID: link.id,
            type: type || undefined,
          };
        }),
      }),
      ...portsToRemove.map((port) => {
        const type = builtInPortTypeSelector(state, { id: port.id });

        return type
          ? Realtime.port.removeBuiltin({ ...ctx, nodeID: port.nodeID, portID: port.id, type, removeNodes: [] })
          : Realtime.port.removeDynamic({ ...ctx, nodeID: port.nodeID, portID: port.id, removeNodes: [] });
      }),
      Realtime.node.removeMany({
        ...ctx,
        nodes: nodesWithData.map(({ node }) =>
          node.parentNode ? { parentNodeID: node.parentNode, stepID: node.id } : { parentNodeID: node.id }
        ),
      }),
    ];
  },

  DIAGRAM_INVALIDATORS
);
