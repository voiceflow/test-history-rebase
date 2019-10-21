import cuid from 'cuid';

import { BlockType } from '@/constants';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

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
  const newNode = {
    x: 0,
    y: 0,
    parentNode: null,
    ...node,
    ports: {
      in: inPorts.map((port) => port.id),
      out: outPorts.map((port) => port.id),
    },
    combinedNodes: [],
  };

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
  const newNode = {
    x: 0,
    y: 0,
    ...node,
    parentNode: parentNodeID,
    ports: {
      in: inPorts.map((port) => port.id),
      out: outPorts.map((port) => port.id),
    },
    combinedNodes: [],
  };

  // adding to existing combined block
  if (parentNode.combinedNodes.length || parentNode.type === BlockType.START) {
    return compose(
      addBlockToState(newNode, [...inPorts, ...outPorts], newNodeData),
      patchNodeInState(parentNodeID, {
        combinedNodes: [...parentNode.combinedNodes, node.id],
      })
    )(state);
  }

  // constructing a new combined block
  const parentNodeOutPortIDs = parentNode.ports.out;
  const parentNodeOutLinkIDs = parentNodeOutPortIDs.flatMap(getLinkIDsByPortID(state));
  const mergedNodeID = cuid();

  const mergedNode = {
    id: mergedNodeID,
    type: BlockType.COMBINED,
    x: parentNode.x,
    y: parentNode.y,
    parentNode: null,
    combinedNodes: [parentNode.id, node.id],
    ports: {
      in: [],
      out: [],
    },
  };
  const mergedData = {
    nodeID: mergedNodeID,
    name: 'New Block',
    type: BlockType.COMBINED,
  };

  newNode.parentNode = mergedNodeID;

  return compose(
    addNodeToState(mergedNode, mergedData),
    removeAllLinksFromState(parentNodeOutLinkIDs),
    patchNodeInState(parentNode.id, {
      parentNode: mergedNodeID,
    }),
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
