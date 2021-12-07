import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { Reducer } from '@/store/types';

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

export const reorderNestedNode = (state: DiagramState, targetNode: Realtime.Node, index: number, recipientNode: Realtime.Node) => {
  const currentIndex = recipientNode.combinedNodes.indexOf(targetNode.id);
  const isReorderingHighToLow = currentIndex < index;
  const nextIndex = isReorderingHighToLow ? index - 1 : index;

  const isLast = nextIndex === recipientNode.combinedNodes.length - 1;
  const oldLinks = isLast ? getNestedOutgoingLinkIDs(state, recipientNode) : getOutgoingLinkIDs(state, targetNode);

  return Utils.functional.compose(
    removeAllLinksFromState(oldLinks),
    patchNodeInState(recipientNode.id, {
      combinedNodes: Utils.array.reorder(recipientNode.combinedNodes, currentIndex, nextIndex),
    }),
    patchNodeInState(targetNode.id, {
      parentNode: recipientNode.id,
    })
  )(state);
};

export const insertIntoParentNode = (state: DiagramState, targetNode: Realtime.Node, index: number, recipientNode: Realtime.Node) => {
  const isLast = recipientNode.combinedNodes.length === index;
  const oldLinks = isLast ? getNestedOutgoingLinkIDs(state, recipientNode) : getOutgoingLinkIDs(state, targetNode);

  return Utils.functional.compose(
    removeAllLinksFromState(oldLinks),
    patchNodeInState(recipientNode.id, {
      combinedNodes: Utils.array.insert(recipientNode.combinedNodes, index, targetNode.id),
    })
  )(state);
};

export const transplantNestedNode = (state: DiagramState, targetNode: Realtime.Node, index: number, recipientNodeID: string) => {
  const recipientNode = Utils.normalized.getNormalizedByKey(state.nodes, recipientNodeID);

  if (!recipientNode || !targetNode.parentNode) {
    return state;
  }

  if (recipientNodeID === targetNode.parentNode) {
    return recipientNode.combinedNodes.includes(targetNode.id)
      ? reorderNestedNode(state, targetNode, index, recipientNode)
      : insertIntoParentNode(state, targetNode, index, recipientNode);
  }

  const surrogateNode = Utils.normalized.getNormalizedByKey(state.nodes, targetNode.parentNode);

  if (!surrogateNode) {
    return state;
  }

  const surrogateCombinedIDs = Utils.array.withoutValue(surrogateNode.combinedNodes, targetNode.id);
  const recipientCombinedIDs = Utils.array.insert(recipientNode.combinedNodes, index, targetNode.id);
  const isLast = index === recipientCombinedIDs.length - 1;

  const oldLinks = isLast
    ? [...getJoiningLinkIDs(state)(targetNode.id, recipientNodeID), ...getNestedOutgoingLinkIDs(state, recipientNode)]
    : getOutgoingLinkIDs(state, targetNode);

  return Utils.functional.compose(
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
  const parentNode = Utils.normalized.getNormalizedByKey(state.nodes, parentNodeID);
  const targetNode = Utils.normalized.getNormalizedByKey(state.nodes, nodeID);

  if (!targetNode || !parentNode) {
    return state;
  }

  if (targetNode.parentNode) {
    return transplantNestedNode(state, targetNode, index, parentNodeID);
  }

  const nextCombinedIDs = Utils.array.insertAll(parentNode.combinedNodes, index, targetNode.combinedNodes);
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

  return Utils.functional.compose(
    removeBlockFromState(targetNode),
    removeAllLinksFromState(oldLinks),
    patchNodeInState(parentNode.id, {
      combinedNodes: nextCombinedIDs,
    }),
    ...targetNode.combinedNodes.map((childNodeID) => patchNodeInState(childNodeID, { parentNode: parentNode.id }))
  )(state);
};

export default insertNestedNodeReducer;
