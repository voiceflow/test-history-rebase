import { DiagramNode, NodeID, Port as DBPort } from '@voiceflow/api-sdk';
import _isFunction from 'lodash/isFunction';

import { createAdapter } from '@/client/adapters/utils';
import { BlockType } from '@/constants';
import { Link, Node, NodeData, Port } from '@/models';

import { DB_BLOCK_TYPE_FROM_APP } from './block';
import { IN_PORT_KEY, OUT_PORT_KEY } from './constants';
import nodeDataAdpater from './nodeData';
import { getInPortID, getLinkID, getOutPortID, isBlock, isStep } from './utils';

const nodeAdapter = createAdapter<
  DiagramNode,
  { node: Node; data: NodeData<unknown>; ports: Port[] },
  [{ parentNode: NodeID | void; links: Link[] }],
  [{ portToTargets: Record<string, NodeID>; stepMap: Record<NodeID, NodeID> }]
>(
  (dbNode, { parentNode, links }) => {
    const data = nodeDataAdpater.fromDB(dbNode.data, dbNode);

    const ports: Port[] = [];

    const node: Node = {
      id: dbNode.nodeID,
      type: data.type,
      x: dbNode.coords?.[0] || 0,
      y: dbNode.coords?.[1] || 0,
      parentNode: parentNode || null,
      combinedNodes: [],
      ports: {
        in: [],
        out: [],
      },
    };

    const registerPort = ({ portID, label = null, target = null }: { portID: string; label?: string | null; target?: NodeID | null }) => {
      ports.push({
        id: portID,
        nodeID: dbNode.nodeID,
        label,
        platform: null,
        virtual: false,
      });
      if (portID.endsWith(OUT_PORT_KEY)) {
        node.ports.out.push(portID);
      }
      if (portID.endsWith(IN_PORT_KEY)) {
        node.ports.in.push(portID);
      }

      if (target) {
        links.push({
          id: getLinkID(portID, target),
          source: {
            nodeID: node.id,
            portID,
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
        registerPort({ portID: getInPortID(node.id) });
      }
      node.combinedNodes = dbNode.data.steps;
    }
    if (isStep(dbNode)) {
      registerPort({ portID: getInPortID(node.id) });
      dbNode.data.ports.forEach((port, index) => {
        registerPort({ portID: getOutPortID(node.id, index), label: port.type, target: port.target });
      });
    }

    return {
      node,
      data,
      ports,
    };
  },
  ({ node, data, ports }, { portToTargets, stepMap }) => {
    const portMap = ports.reduce<Record<string, Port>>((acc, port) => ({ ...acc, [port.id]: port }), {});
    const getNodeType = DB_BLOCK_TYPE_FROM_APP[node.type];
    const type = _isFunction(getNodeType) ? getNodeType(data) : getNodeType || node.type;

    const diagramNode: DiagramNode = {
      nodeID: node.id,
      type,
      coords: node.parentNode ? undefined : [node.x, node.y],
      data: nodeDataAdpater.toDB(data),
    };

    if (node.ports.out.length > 0) {
      diagramNode.data.ports = node.ports.out.map<DBPort>((portID) => ({
        type: portMap[portID]?.label || '',
        target: portToTargets[portID] || stepMap[node.id] || null,
      }));
    }

    if ([BlockType.COMBINED, BlockType.START].includes(node.type)) {
      diagramNode.data.steps = node.combinedNodes;
    }

    return diagramNode;
  }
);

export default nodeAdapter;
