import { isActions, isBlock, isStart, isStep } from '@realtime-sdk/utils/typeGuards';
import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

type NodesMap = Record<string, BaseModels.BaseDiagramNode>;
type ValidNodeIDsMap = Record<string, boolean>;

const cleanupBlockSteps = (nodesMap: NodesMap, stepsIDs: string[]): string[] => stepsIDs.filter((stepID) => !!(stepID in nodesMap));

const cleanupStepPorts = (
  data: BaseModels.StepOnlyData<BaseModels.AnyBaseStepPorts, BaseModels.BasePort[]>,
  validNodesMap: ValidNodeIDsMap
): BaseModels.StepOnlyData<BaseModels.AnyBaseStepPorts, BaseModels.BasePort[]> => {
  const mapPort = (port: BaseModels.BasePort): BaseModels.BasePort => ({
    ...port,
    target: port.target && validNodesMap[port.target] ? port.target : null,
  });

  if (data.portsV2) {
    const byKey = Utils.object.mapValue((data.portsV2.byKey ?? {}) as Record<string, BaseModels.BasePort>, mapPort);
    const builtIn = Utils.object.mapValue(data.portsV2.builtIn ?? {}, mapPort);
    const dynamic = data.portsV2.dynamic?.map(mapPort) ?? [];

    return { portsV2: { byKey, builtIn, dynamic } };
  }

  if (data.ports) {
    return { ports: data.ports.map(mapPort) };
  }

  return { portsV2: { byKey: {}, builtIn: {}, dynamic: [] } };
};

export const cleanupDBNodes = (nodesMap: NodesMap): BaseModels.BaseDiagramNode[] => {
  const validNodeIDsMap: ValidNodeIDsMap = {};

  // remove the steps ids which are not exists in the nodesMap as well as empty combined nodes
  const nodesList = Object.values(nodesMap).filter((node) => {
    if (isBlock(node) || isActions(node) || isStart(node)) {
      const steps = cleanupBlockSteps(nodesMap, node.data.steps ?? []);

      if (!steps.length && !isStart(node)) return false;

      // eslint-disable-next-line no-param-reassign
      node.data.steps = steps;
    }

    validNodeIDsMap[node.nodeID] = true;

    return true;
  });

  // reset port's targetID if the target node is not exists
  nodesList.forEach((node) => {
    if (isStep<AnyRecord, BaseModels.AnyBaseStepPorts, BaseModels.BasePort[]>(node)) {
      Object.assign(node.data, cleanupStepPorts(node.data, validNodeIDsMap));
    }
  });

  return nodesList;
};
