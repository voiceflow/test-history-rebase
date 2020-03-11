import { BlockType } from '@/constants';
import { without } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { patchNodeInState, removeBlockFromState } from './utils';

const unmergeNodeReducer = (
  state,
  {
    payload: {
      nodeID,
      position: [x, y],
    },
    meta,
  }
) => {
  const node = getNormalizedByKey(state.nodes, nodeID);
  const parentNode = getNormalizedByKey(state.nodes, node.parentNode);
  const isBlockRedesignEnabled = meta?.isBlockRedesignEnabled;

  if (!parentNode) {
    return state;
  }

  const index = parentNode.combinedNodes.indexOf(node.id);

  if (parentNode.combinedNodes.length > 2) {
    const remainingNodeIDs = without(parentNode.combinedNodes, index);

    return compose(
      patchNodeInState(parentNode.id, {
        combinedNodes: remainingNodeIDs,
      }),
      patchNodeInState(node.id, {
        parentNode: null,
        x,
        y,
      })
    )(state);
  }

  const remainingNodeID = parentNode.combinedNodes[index === 0 ? 1 : 0];

  if (isBlockRedesignEnabled && parentNode.type === BlockType.COMBINED && parentNode.combinedNodes.length === 1) {
    return compose(
      removeBlockFromState(parentNode),
      patchNodeInState(node.id, {
        parentNode: null,
        x,
        y,
      })
    )(state);
  }

  return compose(
    removeBlockFromState(parentNode),
    patchNodeInState(node.id, {
      parentNode: null,
      x,
      y,
    }),
    patchNodeInState(remainingNodeID, {
      parentNode: null,
      x: parentNode.x,
      y: parentNode.y,
    })
  )(state);
};

export default unmergeNodeReducer;
