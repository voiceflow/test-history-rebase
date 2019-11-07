import { insert } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { getLinkIDsByPortID, patchNodeInState, removeAllLinksFromState } from './utils';

const insertNestedNodeReducer = (state, { payload: { parentNodeID, nodeID, index } }) => {
  const parentNode = getNormalizedByKey(state.nodes, parentNodeID);
  const nextCombinedIDs = insert(parentNode.combinedNodes, index, nodeID);
  const isLast = index === nextCombinedIDs.length - 1;

  let removeLinks = [];
  if (isLast) {
    const combinedNodes = parentNode.combinedNodes;
    const lastNodeId = combinedNodes[combinedNodes.length - 1];
    const lastNode = getNormalizedByKey(state.nodes, lastNodeId);
    const lastNodeOutPortIDs = lastNode.ports.out;
    const lastNodeOutLinkIDs = lastNodeOutPortIDs.flatMap((portId) => getLinkIDsByPortID(state)(portId));

    removeLinks = lastNodeOutLinkIDs;
  } else {
    const node = getNormalizedByKey(state.nodes, nodeID);
    const outgoingPortIDs = [...node.ports.out];
    const nodeLinkIDs = outgoingPortIDs.flatMap((portId) => getLinkIDsByPortID(state)(portId));

    removeLinks = nodeLinkIDs;
  }

  return compose(
    removeAllLinksFromState(removeLinks),
    patchNodeInState(parentNode.id, {
      combinedNodes: nextCombinedIDs,
    }),
    patchNodeInState(nodeID, {
      parentNode: parentNode.id,
    })
  )(state);
};

export default insertNestedNodeReducer;
