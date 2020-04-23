import { BlockType } from '@/constants';
import { Reducer } from '@/store/types';
import { without } from '@/utils/array';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { UnmergeNode } from '../actions';
import { nodeFactory } from '../factories';
import { DiagramState } from '../types';
import { addBlockToState, buildNewNode, patchNodeInState } from '../utils';

const unmergeNodeReducer: Reducer<DiagramState, UnmergeNode> = (
  state,
  {
    payload: {
      nodeID,
      position: [x, y],
      parentNode: { ports: parentPorts, ...parentNode },
    },
  }
) => {
  const node = getNormalizedByKey(state.nodes, nodeID);
  const surrogateNode = getNormalizedByKey(state.nodes, node.parentNode!);

  if (surrogateNode?.type !== BlockType.COMBINED) {
    return state;
  }

  const index = surrogateNode.combinedNodes.indexOf(node.id);
  const remainingNodeIDs = without(surrogateNode.combinedNodes, index);

  if (remainingNodeIDs.length === 0) {
    return patchNodeInState(surrogateNode.id, {
      x,
      y,
    })(state);
  }

  const [newParentNode, newRootPorts, newParentNodeData] = buildNewNode(
    {
      ...nodeFactory(parentNode.id, {
        ...parentNode,
        type: BlockType.COMBINED,
        x,
        y,
        combinedNodes: [node.id],
      }),
      ports: parentPorts,
    },
    { name: 'Block' }
  );

  return compose(
    addBlockToState(newParentNode, newRootPorts, newParentNodeData),
    patchNodeInState(surrogateNode.id, {
      combinedNodes: remainingNodeIDs,
    }),
    patchNodeInState(node.id, {
      parentNode: parentNode.id,
    })
  )(state);
};

export default unmergeNodeReducer;
