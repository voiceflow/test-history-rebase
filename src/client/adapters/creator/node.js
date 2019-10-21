import { getAllNormalizedByKeys } from '@/utils/normalized';

import { createSimpleAdapter } from '../utils';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';

const nodeAdapter = createSimpleAdapter(
  (dbNode, data, parentNode) => ({
    id: dbNode.id,
    type: data.type,
    x: dbNode.x,
    y: dbNode.y,
    parentNode: parentNode || null,
    combinedNodes: !parentNode && dbNode.combines ? dbNode.combines.map(({ id }) => id) : [],
    ports: dbNode.ports.reduce(
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
      combines: getAllNormalizedByKeys(nodes, appNode.combinedNodes).map((node, index, combinedNodes) => ({
        ...convertNodeForDB(node, ports, data, linksByPortID, platform, index === combinedNodes.length - 1 ? null : combinedNodes[index + 1]?.id),
        parentNode: appNode.id,
        combines: null,
      })),
    }),
  })
);

export default nodeAdapter;

// eslint-disable-next-line max-params
function convertNodeForDB(appNode, ports, data, linksByPortID, platform, nextID) {
  const { id, type, x, y, parentNode } = appNode;
  const { name, ...appData } = data[id];
  const node = {
    id,
    name,
    type,
    x,
    y,
    parentNode,
    extras: nodeDataAdapter.toDB(appData),
    ports: [
      ...getAllNormalizedByKeys(ports, appNode.ports.out).map((port, index) => portAdapter.toDB(port, false, linksByPortID, platform, type, index)),
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
