import { insert, insertAll, reorder, withoutValue } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { getIncomingLinkIDs, getNestedOutgoingLinkIDs, getOutgoingLinkIDs } from './insertNestedNode';
import { patchNodeInState, removeAllLinksFromState, removeBlockFromState } from './utils';

const reorderNestedNode = (state, targetNode, index, recipientNode) => {
  const currentIndex = recipientNode.combinedNodes.indexOf(targetNode.id);
  const isReorderingHighToLow = currentIndex < index;
  const isLastOffset = isReorderingHighToLow ? -1 : 0;

  const isLast = index === recipientNode.combinedNodes.length - 1 + isLastOffset;
  const oldLinks = isLast ? getNestedOutgoingLinkIDs(state, recipientNode) : getOutgoingLinkIDs(state, targetNode);

  return compose(
    removeAllLinksFromState(oldLinks),
    patchNodeInState(recipientNode.id, {
      combinedNodes: reorder(recipientNode.combinedNodes, currentIndex, isReorderingHighToLow ? index - 1 : index),
    }),
    patchNodeInState(targetNode.id, {
      parentNode: recipientNode.id,
    })
  )(state);
};

const transplantNestedNode = (state, targetNode, index, recipientNodeID) => {
  const recipientNode = getNormalizedByKey(state.nodes, recipientNodeID);

  if (recipientNodeID === targetNode.parentNode) {
    return reorderNestedNode(state, targetNode, index, recipientNode);
  }

  const surrogateNode = getNormalizedByKey(state.nodes, targetNode.parentNode);

  const surrogateCombinedIDs = withoutValue(surrogateNode.combinedNodes, targetNode.id);
  const recipientCombinedIDs = insert(recipientNode.combinedNodes, index, targetNode.id);
  const isLast = index === recipientCombinedIDs.length - 1;

  const oldLinks = isLast ? [] : getOutgoingLinkIDs(state, targetNode);

  return compose(
    removeAllLinksFromState(oldLinks),
    patchNodeInState(surrogateNode.id, {
      combinedNodes: surrogateCombinedIDs,
    }),
    patchNodeInState(recipientNode.id, {
      combinedNodes: recipientCombinedIDs,
    }),
    patchNodeInState(targetNode.id, {
      parentNode: recipientNode.id,
    })
  )(state);
};

const insertNestedNodeV2Reducer = (state, { payload: { parentNodeID, nodeID, index } }) => {
  const parentNode = getNormalizedByKey(state.nodes, parentNodeID);
  const targetNode = getNormalizedByKey(state.nodes, nodeID);

  if (targetNode.parentNode) {
    return transplantNestedNode(state, targetNode, index, parentNodeID);
  }

  const nextCombinedIDs = insertAll(parentNode.combinedNodes, index, targetNode.combinedNodes);
  const isFirst = index === 0;
  const isLast = index === nextCombinedIDs.length - 1;

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

export default insertNestedNodeV2Reducer;
