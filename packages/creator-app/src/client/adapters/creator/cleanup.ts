import { BaseDiagramNode, BasePort, NodeID } from '@voiceflow/api-sdk';

import { BlockType } from '@/constants';

import { isBlock, isStep } from './utils';

type NodesMap = Record<NodeID, BaseDiagramNode>;
type ValidNodeIDsMap = Record<NodeID, boolean>;

const cleanupBlockSteps = (nodesMap: NodesMap, stepsIDs: NodeID[]): NodeID[] => stepsIDs.filter((stepID) => !!(stepID in nodesMap));
const cleanupStepPorts = (ports: BasePort[], validNodesMap: ValidNodeIDsMap): [BasePort, ...BasePort[]] =>
  ports.map((port) => ({ ...port, target: port.target && validNodesMap[port.target] ? port.target : null })) as [BasePort, ...BasePort[]];

// eslint-disable-next-line import/prefer-default-export
export const cleanupDBNodes = (nodesMap: NodesMap): BaseDiagramNode[] => {
  const validNodeIDsMap: ValidNodeIDsMap = {};

  // remove the steps ids which are not exists in the nodesMap as well as empty combined nodes
  const nodesList = Object.values(nodesMap).filter((node) => {
    if (isBlock(node)) {
      const steps = cleanupBlockSteps(nodesMap, node.data.steps);

      if (!steps.length && node.type === BlockType.COMBINED) {
        return false;
      }

      node.data.steps = steps;
    }

    validNodeIDsMap[node.nodeID] = true;

    return true;
  });

  // reset port's targetID if the target node is not exists
  nodesList.forEach((node) => {
    if (isStep(node)) {
      node.data.ports = cleanupStepPorts(node.data.ports, validNodeIDsMap);
    }
  });

  return nodesList;
};
