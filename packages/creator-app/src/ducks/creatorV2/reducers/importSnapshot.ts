import * as Realtime from '@voiceflow/realtime-sdk';

import { CreatorState } from '../types';
import { createActiveDiagramReducer } from './utils';

const importNode =
  (state: CreatorState) =>
  ({ node, data }: Realtime.NodeWithData): void => {
    const nodeID = node.id;

    state.nodes.allKeys.push(nodeID);
    state.nodes.byKey[nodeID] = data;

    if (Realtime.Utils.typeGuards.isMarkupBlockType(node.type)) {
      state.markupIDs.push(nodeID);
      state.originByNodeID[nodeID] = [node.x, node.y];

      return;
    }

    state.portsByNodeID[nodeID] = node.ports;
    state.linkIDsByNodeID[nodeID] = [];

    if (node.parentNode) {
      state.blockIDByStepID[nodeID] = node.parentNode;
    } else {
      state.blockIDs.push(nodeID);
      state.originByNodeID[nodeID] = [node.x, node.y];
      state.stepIDsByBlockID[nodeID] = node.combinedNodes;
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

const importSnapshotReducer = createActiveDiagramReducer(Realtime.creator.importSnapshot, (state, { diagramID, ...entities }) => {
  importSnapshot(state, entities);
});

export default importSnapshotReducer;
