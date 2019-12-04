import { BlockType } from '@/constants';
import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { nodeFactory } from './factories';
import { addNodeToState, getLinkIDsByPortID, patchNodeInState, removeAllLinksFromState } from './utils';

const mergeNodesReducer = (
  state,
  {
    payload: {
      sourceNodeID,
      targetNodeID,
      position: [x, y],
      mergedNodeID,
    },
  }
) => {
  const targetNode = getNormalizedByKey(state.nodes, targetNodeID);
  const oldPortIdTargets = [...targetNode.ports.out];

  const targetPorts = oldPortIdTargets.map((portID) => getNormalizedByKey(state.ports, portID));
  const targetLinkIds = targetPorts.flatMap((port) => getLinkIDsByPortID(state)(port.id));

  const mergedNode = nodeFactory(mergedNodeID, {
    type: BlockType.COMBINED,
    x,
    y,
    combinedNodes: [targetNodeID, sourceNodeID],
  });
  const mergedData = {
    nodeID: mergedNodeID,
    name: 'New Block',
    type: BlockType.COMBINED,
  };

  return compose(
    removeAllLinksFromState(targetLinkIds),
    patchNodeInState(sourceNodeID, { parentNode: mergedNodeID }),
    patchNodeInState(targetNodeID, { parentNode: mergedNodeID }),
    addNodeToState(mergedNode, mergedData)
  )(state);
};

export default mergeNodesReducer;
