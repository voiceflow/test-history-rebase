import { BlockType, PlatformType } from '@/constants';
import { DBNode, Node, NodeData, Port } from '@/models';
import { Normalized, getAllNormalizedByKeys } from '@/utils/normalized';

import { createAdapter } from '../utils';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';

// eslint-disable-next-line max-params
function convertNodeForDB(
  appNode: Node,
  ports: Normalized<Port>,
  data: Record<string, NodeData<unknown>>,
  linksByPortID: Record<string, string[]>,
  platform: PlatformType,
  nextID?: string | null
): DBNode {
  const { id, type, x, y, parentNode } = appNode;
  const appData = data[id];

  let outPorts = getAllNormalizedByKeys(ports, appNode.ports.out);
  if (type === BlockType.STREAM) {
    const { alexa, google } = outPorts.reduce<Record<PlatformType, Port[]>>(
      (acc, port) => {
        if (port.platform) {
          acc[port.platform]?.push(port);
        }

        return acc;
      },
      { alexa: [], google: [] }
    );
    outPorts = [...google, ...alexa];
  }

  const node = {
    id,
    name: appData.name,
    ...(parentNode
      ? {
          parentNode,
          combines: undefined,
        }
      : { x, y }),
    extras: nodeDataAdapter.toDB(appData),
    ports: [
      ...outPorts.map((port, index) => portAdapter.toDB(port, false, linksByPortID, platform, type, index)),
      ...getAllNormalizedByKeys(ports, appNode.ports.in).map((port) => portAdapter.toDB(port, true, linksByPortID, platform)),
    ],
  };

  if (nextID) {
    node.extras.nextID = nextID;
  } else {
    delete node.extras.nextID;
  }

  return node;
}

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
  (appNode, { nodes, ports, data, linksByPortID, platform }) => ({
    ...convertNodeForDB(appNode, ports, data, linksByPortID, platform),
    ...(appNode.combinedNodes.length && {
      combines: getAllNormalizedByKeys(nodes, appNode.combinedNodes).map((childNode, index, combinedNodes) => ({
        ...convertNodeForDB(
          childNode,
          ports,
          data,
          linksByPortID,
          platform,
          index === combinedNodes.length - 1 ? null : combinedNodes[index + 1]?.id
        ),
        parentNode: appNode.id,
        combines: null,
      })),
    }),
  })
);

export default nodeAdapter;
