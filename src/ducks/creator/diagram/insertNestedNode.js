import { insert } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { getLinkIDsByPortID, patchNodeInState, removeAllLinksFromState } from './utils';

export const getOutgoingLinkIDs = (state, node) => node.ports.out.flatMap((portID) => getLinkIDsByPortID(state)(portID));

export const getIncomingLinkIDs = (state, node) => node.ports.in.flatMap((portID) => getLinkIDsByPortID(state)(portID));

export const getNestedOutgoingLinkIDs = (state, node) => {
  const combinedNodes = node.combinedNodes;
  const lastNodeID = combinedNodes[combinedNodes.length - 1];
  const lastNode = getNormalizedByKey(state.nodes, lastNodeID);

  return getOutgoingLinkIDs(state, lastNode);
};

const insertNestedNodeReducer = (state, { payload: { parentNodeID, nodeID, index } }) => {
  const parentNode = getNormalizedByKey(state.nodes, parentNodeID);
  const targetNode = getNormalizedByKey(state.nodes, nodeID);
  const nextCombinedIDs = insert(parentNode.combinedNodes, index, nodeID);
  const isLast = index === nextCombinedIDs.length - 1;

  const oldLinks = isLast ? getNestedOutgoingLinkIDs(state, parentNode) : getOutgoingLinkIDs(state, targetNode);

  return compose(
    removeAllLinksFromState(oldLinks),
    patchNodeInState(parentNode.id, {
      combinedNodes: nextCombinedIDs,
    }),
    patchNodeInState(nodeID, {
      parentNode: parentNode.id,
    })
  )(state);
};

export default insertNestedNodeReducer;
