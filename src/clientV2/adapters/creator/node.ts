import { Block, DiagramNode, NodeID } from '@voiceflow/api-sdk';

import { createAdapter } from '@/client/adapters/utils';
import { BlockType, PlatformType } from '@/constants';
import { Link, Node, NodeData, Port } from '@/models';

import { defaultPortAdapter, portsAdapter } from './block';
import { IN_PORT_KEY } from './constants';
import nodeDataAdapter from './nodeData';
import { generateInPort, getInPortID, isBlock, isStep } from './utils';

const nodeAdapter = createAdapter<
  DiagramNode,
  { node: Node; data: NodeData<unknown>; ports: Port[] },
  [{ parentNode: Block | null; links: Link[]; platform: PlatformType }],
  [{ portToTargets: Record<string, NodeID>; stepMap: Record<NodeID, NodeID>; platform: PlatformType }]
>(
  (dbNode, { parentNode, links, platform }) => {
    const siblingSteps = parentNode?.data.steps ?? [];
    const data = nodeDataAdapter.fromDB({ data: dbNode.data, type: dbNode.type }, { platform, nodeID: dbNode.nodeID });

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
        out: [],
      },
    };

    const registerPort = (port: Port, target?: NodeID | null) => {
      ports.push(port);

      if (port.id.endsWith(IN_PORT_KEY)) {
        node.ports.in.push(port.id);
      } else if (port.id) {
        node.ports.out.push(port.id);
      }

      if (target) {
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
        });
      }
    };

    if (isBlock(dbNode)) {
      if (data.type === BlockType.COMBINED) {
        registerPort(generateInPort(node.id));
      }

      node.combinedNodes = dbNode.data.steps;
    }

    if (isStep(dbNode)) {
      const stepIndex = siblingSteps.indexOf(node.id);
      const hasNextStep = stepIndex !== -1 && stepIndex + 1 < siblingSteps.length;
      const nextStep = hasNextStep ? siblingSteps[stepIndex + 1] : null;

      registerPort(generateInPort(node.id));
      (portsAdapter[node.type] || defaultPortAdapter)
        .fromDB(dbNode.data.ports, dbNode, platform)
        .forEach(({ port, target }) => registerPort(port, nextStep === target ? null : target));
    }

    return {
      node,
      data,
      ports,
    };
  },
  ({ node, data, ports }, { portToTargets, stepMap, platform }) => {
    const portMap = ports.reduce<Record<string, Port>>((acc, port) => ({ ...acc, [port.id]: port }), {});
    const { data: dbData, type } = nodeDataAdapter.toDB(data, { platform });

    const diagramNode: DiagramNode = {
      nodeID: node.id,
      type,
      coords: node.parentNode ? undefined : [node.x, node.y],
      data: dbData,
    };

    if (node.ports.out.length > 0) {
      diagramNode.data.ports = (portsAdapter[type] || defaultPortAdapter).toDB(
        node.ports.out.map((portID) => ({
          port: portMap[portID],
          target: portToTargets[portID] || stepMap[node.id] || null,
        })),
        node,
        platform
      );
    }

    if ([BlockType.COMBINED, BlockType.START].includes(node.type)) {
      diagramNode.data.steps = node.combinedNodes;
    }

    return diagramNode;
  }
);

export default nodeAdapter;
