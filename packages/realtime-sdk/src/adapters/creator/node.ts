import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import createAdapter from 'bidirectional-adapter';

import { BlockType } from '../../constants';
import { Link, Node, NodeData, Port } from '../../models';
import { AdapterContext } from '../types';
import { defaultOutPortsAdapter, getOutPortsAdapter, noInPortTypes, OutPortsAdapter, removePortDataFalsyValues } from './block';
import nodeDataAdapter from './nodeData';
import { generateInPort, getInPortID, isBlock, isStep } from './utils';

const nodeAdapter = createAdapter<
  BaseModels.BaseDiagramNode,
  { node: Node; data: NodeData<unknown>; ports: Port[] },
  [
    {
      parentNode: BaseModels.BaseBlock | null;
      links: Link[];
      platform: VoiceflowConstants.PlatformType;
      projectType: VoiceflowConstants.ProjectType;
      context: AdapterContext;
    }
  ],
  [
    {
      portToTargets: Record<string, string>;
      stepMap: Record<string, string>;
      platform: VoiceflowConstants.PlatformType;
      projectType: VoiceflowConstants.ProjectType;
      portLinksMap: Record<string, Link>;
      context: AdapterContext;
    }
  ]
>(
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

    if (isBlock(dbNode)) {
      if (data.type === BlockType.COMBINED) {
        registerInPort(generateInPort(node.id));
      }

      node.combinedNodes = dbNode.data.steps;
    }

    if (isStep(dbNode)) {
      const stepIndex = siblingSteps.indexOf(node.id);
      const hasNextStep = stepIndex !== -1 && stepIndex + 1 < siblingSteps.length;
      const nextStep = hasNextStep ? siblingSteps[stepIndex + 1] : null;

      if (!noInPortTypes.has(node.type)) {
        registerInPort(generateInPort(node.id));
      }

      const outPortAdapter = getOutPortsAdapter(platform)?.[node.type] || (defaultOutPortsAdapter as OutPortsAdapter);

      const { ports, dynamic, builtIn } = outPortAdapter.fromDB(dbNode.data.ports!, { node: dbNode });

      node.ports.out.dynamic = dynamic;
      node.ports.out.builtIn = builtIn;

      ports.forEach(({ port, target }) => registerOutPort(port, nextStep === target ? null : target));
    }

    return {
      node,
      data,
      ports,
    };
  },
  ({ node, data, ports }, { portToTargets, stepMap, platform, projectType, portLinksMap, context }) => {
    const portMap = ports.reduce<Record<string, Port>>((acc, port) => (port ? { ...acc, [port.id]: port } : acc), {});
    const { data: dbData, type } = nodeDataAdapter.toDB(data, { platform, projectType, context });
    const allPorts = ports.filter((port) => port);

    const diagramNode: BaseModels.BaseDiagramNode = {
      nodeID: node.id,
      type,
      coords: node.parentNode ? undefined : [node.x, node.y],
      data: dbData,
    };

    if ([BlockType.COMBINED, BlockType.START].includes(node.type)) {
      diagramNode.data.steps = node.combinedNodes;
    }

    const builtInPortTypes = Utils.object.getKeys(node.ports.out.builtIn);
    let dbPorts: BaseModels.BasePort[] = [];

    if (allPorts.length > 0 && (builtInPortTypes.length || node.ports.out.dynamic.length)) {
      const outPortAdapter = getOutPortsAdapter(platform)?.[type as BlockType] || (defaultOutPortsAdapter as OutPortsAdapter);

      dbPorts = outPortAdapter.toDB(
        {
          dynamic: node.ports.out.dynamic
            .filter((portID) => portMap[portID])
            .map((portID) => ({
              port: portMap[portID],
              link: portLinksMap[portID],
              target: portToTargets[portID] || stepMap[node.id] || null,
            })),
          builtIn: builtInPortTypes.reduce<Parameters<typeof outPortAdapter.toDB>[0]['builtIn']>((acc, type) => {
            const portID = node.ports.out.builtIn[type];

            if (portID && portMap[portID]) {
              acc[type] = {
                port: portMap[portID],
                link: portLinksMap[portID],
                target: portToTargets[portID] || stepMap[node.id] || null,
              };
            }

            return acc;
          }, {}),
        },
        { node, data }
      );
    }

    if (dbPorts.length) {
      diagramNode.data.ports = dbPorts.map(removePortDataFalsyValues);
    }

    return diagramNode;
  }
);

export default nodeAdapter;
