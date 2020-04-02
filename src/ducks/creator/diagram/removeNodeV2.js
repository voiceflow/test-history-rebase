import { BlockType } from '@/constants';
import { without } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { removeCombinedNode } from './removeNode';
import { patchNodeInState, removeAllBlocksFromState, removeBlockFromState } from './utils';

function removeNestedNode(state, node) {
  const parentNode = getNormalizedByKey(state.nodes, node.parentNode);
  const index = parentNode.combinedNodes.indexOf(node.id);

  if (parentNode.combinedNodes.length === 1 && parentNode.type !== BlockType.START) {
    return removeAllBlocksFromState([parentNode, node])(state);
  }

  const remainingNodeIDs = without(parentNode.combinedNodes, index);

  return compose(
    patchNodeInState(parentNode.id, {
      combinedNodes: remainingNodeIDs,
    }),
    removeBlockFromState(node)
  )(state);
}

function removeSingleNode(nodeID) {
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

export const removeManyNodesV2Reducer = (state, { payload: nodeIDs }) => compose(...nodeIDs.map(removeSingleNode))(state);

const removeNodeV2Reducer = (state, { payload: nodeID }) => removeSingleNode(nodeID)(state);

export default removeNodeV2Reducer;
