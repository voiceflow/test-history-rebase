import cuid from 'cuid';

import { BlockType } from '@/constants';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { nodeFactory } from './factories';
import {
  addAllLinksToState,
  addAllNodesToState,
  addAllPortsToState,
  addBlockToState,
  addNodeToState,
  clonePortForNode,
  getLinkIDsByPortID,
  patchNodeInState,
  removeAllLinksFromState,
} from './utils';

export const buildPortForNode = (nodeID) => (port) => ({
  ...port,
  nodeID,
});

const addNodeReducer = (state, { payload: { node, data } }) => {
  const inPorts = node.ports.in.map(buildPortForNode(node.id));
  const outPorts = node.ports.out.map(buildPortForNode(node.id));

  const newNodeData = {
    ...data,
    nodeID: node.id,
    type: node.type,
  };
  const newNode = nodeFactory(node.id, {
    ...node,
    ports: {
      in: inPorts.map((port) => port.id),
      out: outPorts.map((port) => port.id),
    },
    combinedNodes: [],
  });

  return addBlockToState(newNode, [...inPorts, ...outPorts], newNodeData)(state);
};

export default addNodeReducer;

export const addNestedNodeReducer = (state, { payload: { parentNodeID, node, data } }) => {
  const parentNode = getNormalizedByKey(state.nodes, parentNodeID);
  const inPorts = ((node.ports || {}).in || []).map(clonePortForNode(node.id));
  const outPorts = ((node.ports || {}).out || []).map(clonePortForNode(node.id));

  const newNodeData = {
    ...data,
    nodeID: node.id,
    type: node.type,
  };
  const newNode = nodeFactory(node.id, {
    ...node,
    parentNode: parentNodeID,
    ports: {
      in: inPorts.map((port) => port.id),
      out: outPorts.map((port) => port.id),
    },
    combinedNodes: [],
  });

  const isCombinedBlock = parentNode.combinedNodes.length;
  // adding to existing combined block or start block
  if (isCombinedBlock || parentNode.type === BlockType.START) {
    const additionalActions = [];
    if (isCombinedBlock) {
      const terminalBlock = getNormalizedByKey(state.nodes, parentNode.combinedNodes[parentNode.combinedNodes.length - 1]);
      const outLinkIDs = terminalBlock.ports.out.flatMap(getLinkIDsByPortID(state));

      additionalActions.push(removeAllLinksFromState(outLinkIDs));
    }

    return compose(
      addBlockToState(newNode, [...inPorts, ...outPorts], newNodeData),
      patchNodeInState(parentNodeID, {
        combinedNodes: [...parentNode.combinedNodes, node.id],
      }),
      ...additionalActions
    )(state);
  }

  // constructing a new combined block
  const parentNodeOutPortIDs = parentNode.ports.out;
  const parentNodeOutLinkIDs = parentNodeOutPortIDs.flatMap(getLinkIDsByPortID(state));
  const mergedNodeID = cuid();

  const mergedNode = nodeFactory(mergedNodeID, {
    type: BlockType.COMBINED,
    x: parentNode.x,
    y: parentNode.y,
    combinedNodes: [parentNode.id, node.id],
  });
  const mergedData = {
    nodeID: mergedNodeID,
    name: 'New Block',
    type: BlockType.COMBINED,
  };

  newNode.parentNode = mergedNodeID;

  return compose(
    addNodeToState(mergedNode, mergedData),
    removeAllLinksFromState(parentNodeOutLinkIDs),
    patchNodeInState(parentNode.id, { parentNode: mergedNodeID }),
    addBlockToState(newNode, [...inPorts, ...outPorts], newNodeData)
  )(state);
};

export const addManyNodesReducer = (
  state,
  {
    payload: {
      nodeGroup: { nodesWithData, ports, links },
      position: [positionX, positionY],
    },
  }
) => {
  const nodeXs = nodesWithData.map(({ node: { x } }) => x);
  const nodeYs = nodesWithData.map(({ node: { y } }) => y);
  const minX = Math.min(...nodeXs);
  const maxX = Math.max(...nodeXs);
  const minY = Math.min(...nodeYs);
  const maxY = Math.max(...nodeYs);

  const [centerX, centerY] = [minX + (maxX - minX) / 2, minY + (maxY - minY) / 2];

  return compose(
    addAllPortsToState(ports),
    addAllNodesToState(
      nodesWithData.map(({ node, data }) => ({
        node: { ...node, x: positionX + (node.x - centerX), y: positionY + (node.y - centerY) },
        data,
      }))
    ),
    addAllLinksToState(links)
  )(state);
};
