import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { Reducer } from '@/store/types';

import { RemoveManyNodes } from '../actions';
import { DiagramState } from '../types';
import { patchNodeInState, removeAllBlocksFromState, removeBlockFromState } from '../utils';

export function removeCombinedNode(state: DiagramState, node: Realtime.Node) {
  const combinedNodes = Utils.normalized.getAllNormalizedByKeys(state.nodes, node.combinedNodes);

  return removeAllBlocksFromState([...combinedNodes, node])(state);
}

export function removeNestedNode(state: DiagramState, node: Realtime.Node) {
  const parentNode = Utils.normalized.getNormalizedByKey(state.nodes, node.parentNode!);
  const index = parentNode.combinedNodes.indexOf(node.id);

  if (parentNode.combinedNodes.length === 1 && parentNode.type !== BlockType.START) {
    return removeAllBlocksFromState([parentNode, node])(state);
  }

  const remainingNodeIDs = Utils.array.without(parentNode.combinedNodes, index);

  return Utils.functional.compose(
    patchNodeInState(parentNode.id, {
      combinedNodes: remainingNodeIDs,
    }),
    removeBlockFromState(node)
  )(state);
}

export const removeSingleNode = (nodeID: string) => (state: DiagramState) => {
  const node = Utils.normalized.getNormalizedByKey(state.nodes, nodeID);

  if (node.type === BlockType.COMBINED) {
    return removeCombinedNode(state, node);
  }

  if (node.parentNode) {
    return removeNestedNode(state, node);
  }

  return removeBlockFromState(node)(state);
};

export const removeManyNodesReducer: Reducer<DiagramState, RemoveManyNodes> = (state, { payload: nodeIDs }) =>
  Utils.functional.compose(...nodeIDs.map(removeSingleNode))(state);
