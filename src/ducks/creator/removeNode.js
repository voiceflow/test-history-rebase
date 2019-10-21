import { BlockType } from '@/constants';
import { without } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getAllNormalizedByKeys, getNormalizedByKey } from '@/utils/normalized';

import { patchNodeInState, removeAllBlocksFromState, removeBlockFromState } from './utils';

const removeNodeReducer = (state, { payload: nodeID }) => removeSingleNode(nodeID)(state);

export default removeNodeReducer;

export const removeManyNodesReducer = (state, { payload: nodeIDs }) => compose(...nodeIDs.map(removeSingleNode))(state);

export function removeSingleNode(nodeID) {
  return (state) => {
    const node = getNormalizedByKey(state.nodes, nodeID);

    if (node.type === BlockType.COMBINED) {
      return removeCombinedNode(state, node);
    }

    if (node.parentNode) {
      return removeNestedNode(state, node);
    }

    return removeBlockFromState(node)(state);
  };
}

export function removeNestedNode(state, node) {
  const parentNode = getNormalizedByKey(state.nodes, node.parentNode);
  const index = parentNode.combinedNodes.indexOf(node.id);

  if (parentNode.combinedNodes.length > 2 || parentNode.type === BlockType.START) {
    const remainingNodeIDs = without(parentNode.combinedNodes, index);

    return compose(
      patchNodeInState(parentNode.id, {
        combinedNodes: remainingNodeIDs,
      }),
      removeBlockFromState(node)
    )(state);
  }

  const remainingNodeID = parentNode.combinedNodes[index === 0 ? 1 : 0];

  return compose(
    removeBlockFromState(parentNode),
    removeBlockFromState(node),
    patchNodeInState(remainingNodeID, {
      parentNode: null,
      x: parentNode.x,
      y: parentNode.y,
    })
  )(state);
}

export function removeCombinedNode(state, node) {
  const combinedNodes = getAllNormalizedByKeys(state.nodes, node.combinedNodes);

  return removeAllBlocksFromState([...combinedNodes, node])(state);
}
