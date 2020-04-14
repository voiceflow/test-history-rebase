import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { getAllNormalizedByKeys } from '@/utils/normalized';

import { createAdapter } from '../utils';
import { VIRTUAL_NODE_ID_PREFIX, VIRTUAL_PORT_ID_PREFIX } from './constants';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';

// eslint-disable-next-line max-params
function convertNodeForDB(appNode, ports, data, linksByPortID, platform, nextID) {
  const { id, type, x, y, parentNode } = appNode;
  const { name, ...appData } = data[id];

  let outPorts = getAllNormalizedByKeys(ports, appNode.ports.out);
  if (type === BlockType.STREAM) {
    const { alexa, google } = outPorts.reduce(
      (acc, port) => {
        acc[port.platform]?.push(port);
        return acc;
      },
      { alexa: [], google: [] }
    );
    outPorts = [...google, ...alexa];
  }

  const node = {
    id,
    name,
    type,
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

const nodeAdapter = createAdapter(
  (dbNode, data, parentNode) => ({
    id: dbNode.id,
    type: data.type,
    x: dbNode.x ?? 0,
    y: dbNode.y ?? 0,
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
  (appNode, { nodes, ports, data, linksByPortID, platform, isBlockRedesignEnabled }) => {
    const node = {
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
    };

    if (!isBlockRedesignEnabled || node.type !== BlockType.COMBINED || node.combines?.length !== 1) {
      return node;
    }

    // TODO: extra convolution can hopefully be removed once database size constraints are removed / altered
    const { color } = node.extras;
    const childNode = node.combines[0];
    const inPortID = node.ports?.[0].id;
    const virtualExtras = {
      // ignore the default value
      color: color === BlockVariant.REGULAR ? undefined : color,
      // ignore redundant value
      name: node.name === childNode.name ? undefined : node.name,
      // ignore reproducable values
      id: node.id === `${VIRTUAL_NODE_ID_PREFIX}${childNode.id}` ? undefined : node.id,
      inPortID: inPortID === `${VIRTUAL_PORT_ID_PREFIX}${childNode.id}` ? undefined : inPortID,
    };

    return {
      ...childNode,
      name: childNode.name,
      parentNode: undefined,
      x: node.x,
      y: node.y,
      extras: {
        ...childNode.extras,
        virtualExtras: Object.keys(virtualExtras).some((key) => virtualExtras[key]) ? virtualExtras : undefined,
      },
    };
  }
);

export default nodeAdapter;
