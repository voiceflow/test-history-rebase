import { BaseBlock, BaseDiagramNode, NodeID } from '@voiceflow/api-sdk';
import { Constants } from '@voiceflow/general-types';

import { BlockType } from '../../constants';
import { Link, Node, NodeData, Port } from '../../models';
import { AdapterContext } from '../types';
import { createAdapter } from '../utils';
import { defaultPortAdapter, getPortsAdapter, noInPortTypes } from './block';
import { IN_PORT_KEY } from './constants';
import nodeDataAdapter from './nodeData';
import { generateInPort, getInPortID, isBlock, isStep } from './utils';

const nodeAdapter = createAdapter<
  BaseDiagramNode,
  { node: Node; data: NodeData<unknown>; ports: Port[] },
  [
    {
      parentNode: BaseBlock | null;
      links: Link[];
      platform: Constants.PlatformType;
      context: AdapterContext;
    }
  ],
  [
    {
      portToTargets: Record<string, NodeID>;
      stepMap: Record<NodeID, NodeID>;
      platform: Constants.PlatformType;
      portLinksMap: Record<string, Link>;
      context: AdapterContext;
    }
  ]
>(
  // eslint-disable-next-line sonarjs/cognitive-complexity
  (dbNode, { parentNode, links, platform, context }) => {
    const siblingSteps = parentNode?.data.steps ?? [];
    const data = nodeDataAdapter.fromDB({ data: dbNode.data, type: dbNode.type }, { platform, nodeID: dbNode.nodeID, context });

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
          data: port.linkData,
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

      if (!noInPortTypes.has(node.type)) {
        registerPort(generateInPort(node.id));
      }

      const adapter = getPortsAdapter(platform)?.[node.type] || defaultPortAdapter;

      adapter.fromDB(dbNode.data.ports, dbNode).forEach(({ port, target }) => registerPort(port, nextStep === target ? null : target));
    }

    return {
      node,
      data,
      ports,
    };
  },
  ({ node, data, ports }, { portToTargets, stepMap, platform, portLinksMap, context }) => {
    const portMap = ports.reduce<Record<string, Port>>((acc, port) => ({ ...acc, [port.id]: port }), {});
    const { data: dbData, type } = nodeDataAdapter.toDB(data, { platform, context });

    const diagramNode: BaseDiagramNode = {
      nodeID: node.id,
      type,
      coords: node.parentNode ? undefined : [node.x, node.y],
      data: dbData,
    };

    if (node.ports.out.length > 0) {
      const adapter = getPortsAdapter(platform)?.[type as BlockType] || defaultPortAdapter;

      diagramNode.data.ports = adapter.toDB(
        node.ports.out.map((portID) => ({
          port: portMap[portID],
          link: portLinksMap[portID],
          target: portToTargets[portID] || stepMap[node.id] || null,
        })),
        node,
        data
      );
    }

    if ([BlockType.COMBINED, BlockType.START].includes(node.type)) {
      diagramNode.data.steps = node.combinedNodes;
    }

    return diagramNode;
  }
);

export default nodeAdapter;
