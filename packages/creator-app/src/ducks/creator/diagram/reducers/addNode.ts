import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { BlockType } from '@/constants';
import { Reducer } from '@/store/types';

import { AddManyNodes, AddNestedNode, AddNode, AddWrappedNode } from '../actions';
import { nodeFactory } from '../factories';
import { DiagramState } from '../types';
import {
  addAllLinksToState,
  addAllNodesToState,
  addAllPortsToState,
  addBlockToState,
  buildNewNode,
  getLinkIDsByPortID,
  patchNodeInState,
  removeAllLinksFromState,
} from '../utils';

const addNodeReducer: Reducer<DiagramState, AddNode> = (state, { payload: { node, data } }) => {
  const [newNode, newPorts, newNodeData] = buildNewNode(node, data);

  return addBlockToState(newNode, newPorts, newNodeData)(state);
};

export default addNodeReducer;

export const addNestedNodeReducer: Reducer<DiagramState, AddNestedNode> = (state, { payload: { parentNodeID, node, data } }) => {
  const parentNode = Normal.getOne(state.nodes, parentNodeID);

  if (!parentNode) {
    return state;
  }

  const [newNode, newPorts, newNodeData] = buildNewNode({ ...node, parentNode: parentNodeID }, data);

  const isCombinedBlock = parentNode.combinedNodes.length;
  // adding to existing combined block or start block
  if (isCombinedBlock || parentNode.type === BlockType.START) {
    const additionalActions = [];
    if (isCombinedBlock) {
      const terminalBlock = Normal.getOne(state.nodes, parentNode.combinedNodes[parentNode.combinedNodes.length - 1]);

      if (terminalBlock) {
        const outLinkIDs = Realtime.Utils.port.flattenOutPorts(terminalBlock.ports).flatMap(getLinkIDsByPortID(state));

        additionalActions.push(removeAllLinksFromState(outLinkIDs));
      }
    }

    return Utils.functional.compose(
      addBlockToState(newNode, newPorts, newNodeData),
      patchNodeInState(parentNodeID, {
        combinedNodes: [...parentNode.combinedNodes, node.id],
      }),
      ...additionalActions
    )(state);
  }

  return state;
};

export const addManyNodesReducer: Reducer<DiagramState, AddManyNodes> = (
  state,
  {
    payload: {
      entities: { nodesWithData, ports, links },
    },
  }
) => {
  return Utils.functional.compose(addAllPortsToState(ports), addAllNodesToState(nodesWithData), addAllLinksToState(links))(state);
};

export const addWrappedNodeReducer: Reducer<DiagramState, AddWrappedNode> = (
  state,
  {
    payload: {
      node,
      data,
      parentNode: { ports: parentPorts, ...parentNode },
    },
  }
) => {
  const [newNode, newPorts, newNodeData] = buildNewNode({ ...node, parentNode: parentNode.id }, data);
  const [rootNode, rootPorts, rootNodeData] = buildNewNode(
    {
      ...nodeFactory(parentNode.id, {
        ...parentNode,
        type: BlockType.COMBINED,
        x: node.x,
        y: node.y,
        combinedNodes: [node.id],
      }),
      ports: parentPorts,
    },
    { name: `New Block ${state.rootNodeIDs.length}` }
  );

  return Utils.functional.compose(addBlockToState(rootNode, rootPorts, rootNodeData), addBlockToState(newNode, newPorts, newNodeData))(state);
};
