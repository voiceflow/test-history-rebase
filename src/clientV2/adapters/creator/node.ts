import { Block, DiagramNode, NodeID } from '@voiceflow/api-sdk';
import _isFunction from 'lodash/isFunction';

import { createAdapter } from '@/client/adapters/utils';
import { BlockType, PlatformType } from '@/constants';
import { Link, Node, NodeData, Port } from '@/models';

import { DB_BLOCK_TYPE_FROM_APP, defaultPortAdapter, portsAdapter } from './block';
import { IN_PORT_KEY, OUT_PORT_KEY } from './constants';
import nodeDataAdapter from './nodeData';
import { generateInPort, getInPortID, getLinkID, isBlock, isStep } from './utils';

const nodeAdapter = createAdapter<
  DiagramNode,
  { node: Node; data: NodeData<unknown>; ports: Port[] },
  [{ parentNode: Block | null; links: Link[]; platform: PlatformType }],
  [{ portToTargets: Record<string, NodeID>; stepMap: Record<NodeID, NodeID>; platform: PlatformType }]
>(
  (dbNode, { parentNode, links, platform }) => {
    const siblingSteps = parentNode?.data.steps ?? [];
    const data = nodeDataAdapter.fromDB(dbNode.data, { dbNode, platform });

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

      if (port.id.endsWith(OUT_PORT_KEY)) {
        node.ports.out.push(port.id);
      }

      if (port.id.endsWith(IN_PORT_KEY)) {
        node.ports.in.push(port.id);
      }

      if (target) {
        links.push({
          id: getLinkID(port.id, target),
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
        .fromDB(dbNode.data.ports, dbNode)
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
    const getNodeType = DB_BLOCK_TYPE_FROM_APP[node.type];
    const type = _isFunction(getNodeType) ? getNodeType(data) : getNodeType || node.type;

    const diagramNode: DiagramNode = {
      nodeID: node.id,
      type,
      coords: node.parentNode ? undefined : [node.x, node.y],
      data: nodeDataAdapter.toDB(data, { platform }),
    };

    if (node.ports.out.length > 0) {
      diagramNode.data.ports = (portsAdapter[type] || defaultPortAdapter).toDB(
        node.ports.out.map((portID) => ({
          port: portMap[portID],
          target: portToTargets[portID] || stepMap[node.id] || null,
        })),
        node
      );
    }

    if ([BlockType.COMBINED, BlockType.START].includes(node.type)) {
      diagramNode.data.steps = node.combinedNodes;
    }

    return diagramNode;
  }
);

export default nodeAdapter;
