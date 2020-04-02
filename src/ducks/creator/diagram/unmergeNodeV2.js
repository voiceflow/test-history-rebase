import { BlockType } from '@/constants';
import { without } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { addBlockToState, buildNewNode, patchNodeInState } from './utils';

const unmergeNodeV2Reducer = (
  state,
  {
    payload: {
      nodeID,
      position: [x, y],
      parentNodeID,
      parentPortID,
    },
  }
) => {
  const node = getNormalizedByKey(state.nodes, nodeID);
  const parentNode = getNormalizedByKey(state.nodes, node.parentNode);

  if (parentNode?.type !== BlockType.COMBINED) {
    return state;
  }

  const index = parentNode.combinedNodes.indexOf(node.id);
  const remainingNodeIDs = without(parentNode.combinedNodes, index);

  const [newParentNode, newRootPorts, newParentNodeData] = buildNewNode(
    {
      id: parentNodeID,
      type: BlockType.COMBINED,
      x,
      y,
      combinedNodes: [node.id],
      ports: { in: [{ id: parentPortID }], out: [] },
    },
    { name: 'Block' }
  );

  return compose(
    addBlockToState(newParentNode, newRootPorts, newParentNodeData),
    patchNodeInState(parentNode.id, {
      combinedNodes: remainingNodeIDs,
    }),
    patchNodeInState(node.id, {
      parentNode: parentNodeID,
    })
  )(state);
};

export default unmergeNodeV2Reducer;
