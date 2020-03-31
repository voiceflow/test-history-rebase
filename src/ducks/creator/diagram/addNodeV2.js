import { BlockType } from '@/constants';
import { compose } from '@/utils/functional';

import { addBlockToState, buildNewNode } from './utils';

const addNodeV2Reducer = (state, { payload: { node, data, parentNodeID, parentPortID } }) => {
  const [newNode, newPorts, newNodeData] = buildNewNode({ ...node, parentNode: parentNodeID }, data);
  const [parentNode, newRootPorts, parentNodeData] = buildNewNode(
    {
      id: parentNodeID,
      type: BlockType.COMBINED,
      x: node.x,
      y: node.y,
      combinedNodes: [node.id],
      ports: { in: [{ id: parentPortID }], out: [] },
    },
    { name: 'Block' }
  );

  return compose(addBlockToState(parentNode, newRootPorts, parentNodeData), addBlockToState(newNode, newPorts, newNodeData))(state);
};

export default addNodeV2Reducer;
