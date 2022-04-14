import { BlockType } from '@realtime-sdk/constants';
import { BaseModels } from '@voiceflow/base-types';

import { isBlock, isStep } from './utils';

type NodesMap = Record<string, BaseModels.BaseDiagramNode>;
type ValidNodeIDsMap = Record<string, boolean>;

const cleanupBlockSteps = (nodesMap: NodesMap, stepsIDs: string[]): string[] => stepsIDs.filter((stepID) => !!(stepID in nodesMap));

const cleanupStepPorts = (ports: BaseModels.BasePort[], validNodesMap: ValidNodeIDsMap): [BaseModels.BasePort, ...BaseModels.BasePort[]] =>
  ports.map((port) => ({ ...port, target: port.target && validNodesMap[port.target] ? port.target : null })) as [
    BaseModels.BasePort,
    ...BaseModels.BasePort[]
  ];

// eslint-disable-next-line import/prefer-default-export
export const cleanupDBNodes = (nodesMap: NodesMap): BaseModels.BaseDiagramNode[] => {
  const validNodeIDsMap: ValidNodeIDsMap = {};

  // remove the steps ids which are not exists in the nodesMap as well as empty combined nodes
  const nodesList = Object.values(nodesMap).filter((node) => {
    if (isBlock(node)) {
      const steps = cleanupBlockSteps(nodesMap, node.data.steps);

      if (!steps.length && node.type === BlockType.COMBINED) {
        return false;
      }

      // eslint-disable-next-line no-param-reassign
      node.data.steps = steps;
    }

    validNodeIDsMap[node.nodeID] = true;

    return true;
  });

  // reset port's targetID if the target node is not exists
  nodesList.forEach((node) => {
    if (isStep(node) && node.data.ports) {
      // eslint-disable-next-line no-param-reassign
      node.data.ports = cleanupStepPorts(node.data.ports, validNodeIDsMap);
    }
  });

  return nodesList;
};
