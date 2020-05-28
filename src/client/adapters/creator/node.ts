import { BlockType, PlatformType } from '@/constants';
import { DBNode, Node, NodeData, Port } from '@/models';
import { Normalized, getAllNormalizedByKeys } from '@/utils/normalized';

import { createAdapter } from '../utils';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';

const sortStreamPorts = (ports: Port[]) => {
  const { alexa, google } = ports.reduce<Record<PlatformType, Port[]>>(
    (acc, port) => {
      if (port.platform) {
        acc[port.platform]?.push(port);
      }

      return acc;
    },
    { alexa: [], google: [] }
  );

  return [...google, ...alexa];
};

const nodeAdapter = createAdapter<
  DBNode,
  Node,
  [NodeData<unknown>, string?],
  [
    {
      nodes: Normalized<Node>;
      ports: Normalized<Port>;
      data: Record<string, NodeData<unknown>>;
      linksByPortID: Record<string, string[]>;
      platform: PlatformType;
    }
  ]
>(
  (dbNode, data, parentNode) => ({
    id: dbNode.id,
    type: data.type,
    x: dbNode.x ?? 0,
    y: dbNode.y ?? 0,
    parentNode: parentNode || null,
    combinedNodes: !parentNode && dbNode.combines ? dbNode.combines.map(({ id }) => id) : [],
    ports: dbNode.ports.reduce<Record<'in' | 'out', string[]>>(
      (acc, port) => {
        (port.in ? acc.in : acc.out).push(port.id);

        return acc;
      },
      { in: [], out: [] }
    ),
  }),
  (appNode, { nodes, ports, data, linksByPortID, platform }) => {
    const convertNodeForDB = (rawNode: Node, nextID: string | null = null): DBNode => {
      const { id, type, x, y, parentNode } = rawNode;
      const appData = data[id];

      let outPorts = getAllNormalizedByKeys(ports, rawNode.ports.out);
      if (type === BlockType.STREAM) {
        outPorts = sortStreamPorts(outPorts);
      }

      return {
        id,
        name: appData.name,
        extras: nodeDataAdapter.toDB(appData, nextID),
        ports: [
          ...outPorts.map((port, index) => portAdapter.toDB(port, false, linksByPortID, platform, type, index)),
          ...getAllNormalizedByKeys(ports, rawNode.ports.in).map((port) => portAdapter.toDB(port, true, linksByPortID, platform)),
        ],
        ...(parentNode ? { parentNode, combines: undefined } : { x, y }),
      };
    };

    return {
      ...convertNodeForDB(appNode),
      ...(appNode.combinedNodes.length && {
        combines: getAllNormalizedByKeys(nodes, appNode.combinedNodes).map((childNode, index, combinedNodes) => ({
          ...convertNodeForDB(childNode, index === combinedNodes.length - 1 ? null : combinedNodes[index + 1]?.id),
          parentNode: appNode.id,
          combines: null,
        })),
      }),
    };
  }
);

export default nodeAdapter;
