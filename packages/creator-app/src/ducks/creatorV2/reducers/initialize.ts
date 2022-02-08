import * as Realtime from '@voiceflow/realtime-sdk';

import { createInitialState } from '../constants';
import { createReducer } from './utils';

const initializeReducer = createReducer(Realtime.creator.initialize, (_state, { diagramID, nodes, ports, links }) => {
  const nextState = createInitialState();

  nextState.activeDiagramID = diagramID;

  nodes.forEach(([node, data]) => {
    const nodeID = node.id;

    nextState.nodes.allKeys.push(nodeID);
    nextState.nodes.byKey[nodeID] = data;

    if (Realtime.Utils.typeGuards.isMarkupBlockType(node.type)) {
      nextState.markupIDs.push(nodeID);
      nextState.originByNodeID[nodeID] = [node.x, node.y];

      return;
    }

    nextState.portsByNodeID[nodeID] = node.ports;
    nextState.linkIDsByNodeID[nodeID] = [];

    if (node.parentNode) {
      nextState.blockIDByStepID[nodeID] = node.parentNode;
    } else {
      nextState.blockIDs.push(nodeID);
      nextState.originByNodeID[nodeID] = [node.x, node.y];
      nextState.stepIDsByBlockID[nodeID] = node.combinedNodes;
    }
  });

  ports.forEach((port) => {
    const portID = port.id;

    nextState.ports.allKeys.push(portID);
    nextState.ports.byKey[portID] = port;

    nextState.nodeIDByPortID[portID] = port.nodeID;
    nextState.linkIDsByPortID[portID] = [];
  });

  links.forEach((link) => {
    const linkID = link.id;

    nextState.links.allKeys.push(linkID);
    nextState.links.byKey[linkID] = link;

    nextState.nodeIDsByLinkID[linkID] = [link.source.nodeID, link.target.nodeID];
    nextState.portIDsByLinkID[linkID] = [link.source.portID, link.target.portID];
    nextState.linkIDsByNodeID[link.source.nodeID]?.push(linkID);
    nextState.linkIDsByPortID[link.source.portID]?.push(linkID);
    nextState.linkIDsByNodeID[link.target.nodeID]?.push(linkID);
    nextState.linkIDsByPortID[link.target.portID]?.push(linkID);
  });

  return nextState;
});

export default initializeReducer;
