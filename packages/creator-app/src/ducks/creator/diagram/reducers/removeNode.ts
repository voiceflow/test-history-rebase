import { BlockType } from '@/constants';
import { Node } from '@/models';
import { Reducer } from '@/store/types';
import { without } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getAllNormalizedByKeys, getNormalizedByKey } from '@/utils/normalized';

import { RemoveManyNodes } from '../actions';
import { DiagramState } from '../types';
import { patchNodeInState, removeAllBlocksFromState, removeBlockFromState } from '../utils';

export function removeCombinedNode(state: DiagramState, node: Node) {
  const combinedNodes = getAllNormalizedByKeys(state.nodes, node.combinedNodes);

  return removeAllBlocksFromState([...combinedNodes, node])(state);
}

export function removeNestedNode(state: DiagramState, node: Node) {
  const parentNode = getNormalizedByKey(state.nodes, node.parentNode!);
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

export const removeSingleNode = (nodeID: string) => (state: DiagramState) => {
  const node = getNormalizedByKey(state.nodes, nodeID);

  if (node.type === BlockType.COMBINED) {
    return removeCombinedNode(state, node);
  }

  if (node.parentNode) {
    return removeNestedNode(state, node);
  }

  return removeBlockFromState(node)(state);
};

export const removeManyNodesReducer: Reducer<DiagramState, RemoveManyNodes> = (state, { payload: nodeIDs }) =>
  compose(...nodeIDs.map(removeSingleNode))(state);
