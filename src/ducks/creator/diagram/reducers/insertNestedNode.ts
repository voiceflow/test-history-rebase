import { Node } from '@/models';
import { Reducer } from '@/store/types';
import { insert, insertAll, reorder, withoutValue } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { InsertNestedNode } from '../actions';
import { DiagramState } from '../types';
import {
  getIncomingLinkIDs,
  getJoiningLinkIDs,
  getNestedOutgoingLinkIDs,
  getOutgoingLinkIDs,
  patchNodeInState,
  removeAllLinksFromState,
  removeBlockFromState,
} from '../utils';

export const reorderNestedNode = (state: DiagramState, targetNode: Node, index: number, recipientNode: Node) => {
  const currentIndex = recipientNode.combinedNodes.indexOf(targetNode.id);
  const isReorderingHighToLow = currentIndex < index;
  const nextIndex = isReorderingHighToLow ? index - 1 : index;

  const isLast = nextIndex === recipientNode.combinedNodes.length - 1;
  const oldLinks = isLast ? getNestedOutgoingLinkIDs(state, recipientNode) : getOutgoingLinkIDs(state, targetNode);

  return compose(
    removeAllLinksFromState(oldLinks),
    patchNodeInState(recipientNode.id, {
      combinedNodes: reorder(recipientNode.combinedNodes, currentIndex, nextIndex),
    }),
    patchNodeInState(targetNode.id, {
      parentNode: recipientNode.id,
    })
  )(state);
};

export const transplantNestedNode = (state: DiagramState, targetNode: Node, index: number, recipientNodeID: string) => {
  const recipientNode = getNormalizedByKey(state.nodes, recipientNodeID);

  if (recipientNodeID === targetNode.parentNode) {
    return reorderNestedNode(state, targetNode, index, recipientNode);
  }

  const surrogateNode = getNormalizedByKey(state.nodes, targetNode.parentNode!);

  const surrogateCombinedIDs = withoutValue(surrogateNode.combinedNodes, targetNode.id);
  const recipientCombinedIDs = insert(recipientNode.combinedNodes, index, targetNode.id);
  const isLast = index === recipientCombinedIDs.length - 1;

  const oldLinks = isLast
    ? [...getJoiningLinkIDs(state)(targetNode.id, recipientNodeID), ...getNestedOutgoingLinkIDs(state, recipientNode)]
    : getOutgoingLinkIDs(state, targetNode);

  return compose(
    removeAllLinksFromState(oldLinks),
    surrogateCombinedIDs.length
      ? patchNodeInState(surrogateNode.id, {
          combinedNodes: surrogateCombinedIDs,
        })
      : removeBlockFromState(surrogateNode),
    patchNodeInState(recipientNode.id, {
      combinedNodes: recipientCombinedIDs,
    }),
    patchNodeInState(targetNode.id, {
      parentNode: recipientNode.id,
    })
  )(state);
};

const insertNestedNodeReducer: Reducer<DiagramState, InsertNestedNode> = (state, { payload: { parentNodeID, nodeID, index } }) => {
  const parentNode = getNormalizedByKey(state.nodes, parentNodeID);
  const targetNode = getNormalizedByKey(state.nodes, nodeID);

  if (targetNode.parentNode) {
    return transplantNestedNode(state, targetNode, index, parentNodeID);
  }

  const nextCombinedIDs = insertAll(parentNode.combinedNodes, index, targetNode.combinedNodes);
  const isFirst = index === 0;
  const isLast = index === parentNode.combinedNodes.length;

  const oldLinks = [];
  if (isFirst) {
    oldLinks.push(...getIncomingLinkIDs(state, targetNode));
  }

  if (isLast) {
    oldLinks.push(...getNestedOutgoingLinkIDs(state, parentNode));
  } else {
    oldLinks.push(...getNestedOutgoingLinkIDs(state, targetNode));
  }

  return compose(
    removeBlockFromState(targetNode),
    removeAllLinksFromState(oldLinks),
    patchNodeInState(parentNode.id, {
      combinedNodes: nextCombinedIDs,
    }),
    ...targetNode.combinedNodes.map((childNodeID) => patchNodeInState(childNodeID, { parentNode: parentNode.id }))
  )(state);
};

export default insertNestedNodeReducer;
