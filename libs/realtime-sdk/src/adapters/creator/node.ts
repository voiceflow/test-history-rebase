import { DBNodeStart, Link, Node, NodeData, Port } from '@realtime-sdk/models';
import { getInPortID } from '@realtime-sdk/utils/port';
import {
  isActions,
  isActionsBlockType,
  isBlock,
  isMarkupOrCombinedBlockType,
  isRootBlockType,
  isStart,
  isStep,
} from '@realtime-sdk/utils/typeGuards';
import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { createMultiAdapter } from 'bidirectional-adapter';

import { BlockType } from '../../constants';
import { AdapterContext, VersionAdapterContext } from '../types';
import { noInPortTypes } from './block';
import { PortData } from './block/utils';
import nodeDataAdapter from './nodeData';
import stepPortsAdapter from './stepPorts';
import { generateInPort } from './utils';

interface InOptions {
  links: Link[];
  context: AdapterContext;
  platform: Platform.Constants.PlatformType;
  parentNode: BaseModels.BaseBlock | BaseModels.BaseActions | DBNodeStart | null;
  projectType: Platform.Constants.ProjectType;
}

interface OutData {
  node: Node;
  data: NodeData<unknown>;
  ports: Port[];
}

interface OutOptions {
  context: VersionAdapterContext;
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  portLinksMap: Record<string, Link>;
  portToTargets: Record<string, string>;
}

const nodeAdapter = createMultiAdapter<BaseModels.BaseDiagramNode, OutData, [InOptions], [OutOptions]>(
  // eslint-disable-next-line sonarjs/cognitive-complexity
  (dbNode, { parentNode, links, platform, projectType, context }) => {
    const siblingSteps = parentNode?.data.steps ?? [];
    const data = nodeDataAdapter.fromDB({ data: dbNode.data, type: dbNode.type }, { platform, projectType, nodeID: dbNode.nodeID, context });

    const ports: Port[] = [];

    const node: Node = {
      id: dbNode.nodeID,
      type: data.type,
      x: dbNode.coords?.[0] || 0,
      y: dbNode.coords?.[1] || 0,
      parentNode: parentNode?.nodeID || null,
      combinedNodes: [],
      ports: {
        in: [],
        out: {
          byKey: {},
          builtIn: {},
          dynamic: [],
        },
      },
    };

    const registerLinkTarget = (port: Port, target: string) => {
      links.push({
        id: port.id,
        source: {
          nodeID: node.id,
          portID: port.id,
        },
        target: {
          nodeID: target,
          portID: getInPortID(target),
        },
        data: port.linkData,
      });
    };

    const registerInPort = (port: Port) => {
      ports.push(port);
      node.ports.in.push(port.id);
    };

    const registerOutPort = (port: Port, target?: string | null) => {
      ports.push(port);

      if (target) {
        registerLinkTarget(port, target);
      }
    };

    if (isStart(dbNode) || isActions(dbNode) || isBlock(dbNode)) {
      if (data.type !== BlockType.START) {
        registerInPort(generateInPort(node.id));
      }

      node.combinedNodes = dbNode.data.steps;
    }

    if (isStep<AnyRecord, BaseModels.AnyBaseStepPorts, BaseModels.BasePort[]>(dbNode)) {
      const stepIndex = siblingSteps.indexOf(node.id);
      const hasNextStep = stepIndex !== -1 && stepIndex + 1 < siblingSteps.length;
      const nextStep = hasNextStep ? siblingSteps[stepIndex + 1] : null;

      // don't register in ports for the actions as well
      if (!noInPortTypes.has(node.type) && !isActionsBlockType(parentNode?.type)) {
        registerInPort(generateInPort(node.id));
      }

      const { dynamic, builtIn, byKey } = stepPortsAdapter.fromDB(dbNode.data, { platform, nodeType: node.type, dbNode });
      const allPorts = [...Object.values(builtIn), ...Object.values(byKey), ...dynamic].filter(Utils.array.isNotNullish);

      node.ports.out.dynamic = dynamic.map(({ port }) => port.id);
      node.ports.out.builtIn = Utils.object.mapValue(builtIn, (portData) => portData?.port.id ?? null);
      node.ports.out.byKey = Utils.object.mapValue(byKey, (portData) => portData?.port.id ?? null);

      allPorts.forEach(({ port, target }) => registerOutPort(port, nextStep === target ? null : target));
    }

    return {
      node,
      data,
      ports,
    };
  },
  ({ node, data, ports }, { portToTargets, platform, projectType, portLinksMap, context }) => {
    const portMap = ports.reduce<Record<string, Port>>((acc, port) => (port ? { ...acc, [port.id]: port } : acc), {});
    const { data: dbData, type } = nodeDataAdapter.toDB(data, { platform, projectType, context });

    const diagramNode: BaseModels.BaseDiagramNode = {
      type,
      data: dbData,
      nodeID: node.id,
      coords: node.parentNode ? undefined : [node.x, node.y],
    };

    if (isRootBlockType(node.type) || isActionsBlockType(node.type)) {
      diagramNode.data.steps = node.combinedNodes;
    }

    if (!isMarkupOrCombinedBlockType(node.type) && !isActionsBlockType(node.type)) {
      const builtInPortTypes = Utils.object.getKeys(node.ports.out.builtIn);

      const dynamicPorts = node.ports.out.dynamic
        .filter((portID) => portMap[portID])
        .map((portID) => ({
          port: portMap[portID],
          link: portLinksMap[portID],
          target: portToTargets[portID] || null,
        }));

      const builtInPorts = builtInPortTypes.reduce<Record<string, PortData>>((acc, type) => {
        const portID = node.ports.out.builtIn[type];

        if (portID && portMap[portID]) {
          acc[type] = {
            port: portMap[portID],
            link: portLinksMap[portID],
            target: portToTargets[portID] || null,
          };
        }

        return acc;
      }, {});

      const byKeyPorts = Object.fromEntries(
        Object.entries(node.ports.out.byKey || {})
          .filter(([, portID]) => portMap[portID])
          .map(([key, portID]) => [
            key,
            {
              port: portMap[portID],
              link: portLinksMap[portID],
              target: portToTargets[portID] || null,
            },
          ])
      );

      const stepPortsData = stepPortsAdapter.toDB(
        { dynamic: dynamicPorts, builtIn: builtInPorts, byKey: byKeyPorts },
        { platform, node, data, context }
      );

      Object.assign(diagramNode.data, stepPortsData);
    }

    return diagramNode;
  }
);

export default nodeAdapter;
