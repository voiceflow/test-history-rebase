import { BlockType } from '@/constants';
import { Reducer } from '@/store/types';
import { PathPoint } from '@/types';
import { compose } from '@/utils/functional';
import { getNodesGroupCenter } from '@/utils/node';
import { getNormalizedByKey } from '@/utils/normalized';
import { isMarkupOrCombinedBlockType } from '@/utils/typeGuards';

import { AddManyNodes, AddNestedNode, AddNode, AddWrappedNode } from '../actions';
import { blockNodeDataFactory, nodeFactory } from '../factories';
import { DiagramState } from '../types';
import {
  addAllLinksToState,
  addAllNodesToState,
  addAllPortsToState,
  addBlockToState,
  addNodeToState,
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

export const addNestedNodeReducer: Reducer<DiagramState, AddNestedNode> = (state, { payload: { parentNodeID, node, data, mergedNodeID } }) => {
  const parentNode = getNormalizedByKey(state.nodes, parentNodeID);
  const [newNode, newPorts, newNodeData] = buildNewNode({ ...node, parentNode: parentNodeID }, data);

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
      addBlockToState(newNode, newPorts, newNodeData),
      patchNodeInState(parentNodeID, {
        combinedNodes: [...parentNode.combinedNodes, node.id],
      }),
      ...additionalActions
    )(state);
  }

  // constructing a new combined block
  const parentNodeOutPortIDs = parentNode.ports.out;
  const parentNodeOutLinkIDs = parentNodeOutPortIDs.flatMap(getLinkIDsByPortID(state));

  const mergedNode = nodeFactory(mergedNodeID, {
    type: BlockType.COMBINED,
    x: parentNode.x,
    y: parentNode.y,
    combinedNodes: [parentNode.id, node.id],
  });
  const mergedData = blockNodeDataFactory(mergedNodeID, {
    type: BlockType.COMBINED,
  });

  newNode.parentNode = mergedNodeID;

  return compose(
    addNodeToState(mergedNode, mergedData),
    removeAllLinksFromState(parentNodeOutLinkIDs),
    patchNodeInState(parentNode.id, { parentNode: mergedNodeID }),
    addBlockToState(newNode, newPorts, newNodeData)
  )(state);
};

export const addManyNodesReducer: Reducer<DiagramState, AddManyNodes> = (
  state,
  {
    payload: {
      entities: { nodesWithData, ports, links },
      position: [positionX, positionY],
    },
  }
) => {
  const combinedAndMarkupNodes = nodesWithData.filter(({ node }) => isMarkupOrCombinedBlockType(node.type));

  const {
    center: [centerX, centerY],
  } = getNodesGroupCenter(combinedAndMarkupNodes, links);

  const adjustPathPoint = (point: PathPoint): PathPoint => ({
    ...point,
    point: [positionX + (point.point[0] - centerX), positionY + (point.point[1] - centerY)],
  });

  return compose(
    addAllPortsToState(
      ports.map((port) =>
        port.linkData?.points ? { ...port, linkData: { ...port.linkData, points: port.linkData.points.map(adjustPathPoint) } } : port
      )
    ),
    addAllNodesToState(
      nodesWithData.map(({ node, data }) => ({
        node: { ...node, x: positionX + (node.x - centerX), y: positionY + (node.y - centerY) },
        data,
      }))
    ),
    addAllLinksToState(
      links.map((link) => (link.data?.points ? { ...link, data: { ...link.data, points: link.data.points.map(adjustPathPoint) } } : link))
    )
  )(state);
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

  return compose(addBlockToState(rootNode, rootPorts, rootNodeData), addBlockToState(newNode, newPorts, newNodeData))(state);
};
