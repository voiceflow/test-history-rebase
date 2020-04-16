import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { getAllNormalizedByKeys } from '@/utils/normalized';

import { createSimpleAdapter } from '../utils';
import { APP_BLOCK_TYPE_FROM_DB, DB_BLOCK_TYPE_FROM_APP } from './block';
import { NODE_HEIGHT_DIFFERENCE, NODE_WIDTH_DIFFERENCE, VIRTUAL_NODE_ID_PREFIX, VIRTUAL_PORT_ID_PREFIX } from './constants';
import linkAdapter from './link';
import nodeAdapter from './node';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';

const ROOT_NODES = [BlockType.COMBINED, BlockType.START, BlockType.COMMENT];

const findDiagramCenter = (nodes) => {
  const xValues = nodes.map((node) => node.x);
  const yValues = nodes.map((node) => node.y);

  const maxX = Math.max(...xValues);
  const minX = Math.min(...xValues);
  const maxY = Math.max(...yValues);
  const minY = Math.min(...yValues);

  return [(maxX - minX) / 2, (maxY - minY) / 2];
};

const spreadOutNodes = (nodes, [centerX, centerY]) =>
  nodes.map((node) => ({
    ...node,
    x: centerX + (node.x - centerX) * NODE_WIDTH_DIFFERENCE,
    y: centerY + (node.y - centerY) * NODE_HEIGHT_DIFFERENCE,
  }));

const creatorAdapter = createSimpleAdapter(
  (diagram, platform) => {
    const rootNodes = [];
    const nodes = [];
    const nodeIDs = [];
    const ports = [];
    const portIDs = [];
    const data = {};

    const registerNode = (node, parentNode) => {
      const nodeData = nodeDataAdapter.fromDB(node.extras, node);

      nodeIDs.push(node.id);
      nodes.push(nodeAdapter.fromDB(node, nodeData, parentNode));
      node.ports
        .map((port) => portAdapter.fromDB(port, nodeData.type, platform))
        .forEach((port) => {
          ports.push(port);
          portIDs.push(port.id);
        });
      data[node.id] = nodeData;
    };

    let diagramNodes = diagram.nodes;

    // apply an offset to space out blocks from the old layout
    if (!diagram.blockRedesignOffset) {
      const center = findDiagramCenter(diagram.nodes);

      diagramNodes = spreadOutNodes(diagram.nodes, center);
    }

    diagramNodes.forEach((node) => {
      let _node = node; // eslint-disable-line no-underscore-dangle

      const nodeType = APP_BLOCK_TYPE_FROM_DB[node.extras.type] || node.extras.type;
      const virtualPortID = `${VIRTUAL_PORT_ID_PREFIX}${node.id}`;

      if (nodeType === BlockType.COMBINED) {
        _node = {
          ..._node,
          ports: [{ id: virtualPortID, parentNode: _node.id, in: true, virtual: true }],
        };
      } else if (!ROOT_NODES.includes(nodeType)) {
        const { virtualExtras, ...extras } = node.extras || {};
        const virtualNodeID = virtualExtras?.id || `${VIRTUAL_NODE_ID_PREFIX}${node.id}`;

        _node = {
          x: node.x,
          y: node.y,
          id: virtualNodeID,
          name: virtualExtras?.name || node.name || 'Block',
          extras: { type: DB_BLOCK_TYPE_FROM_APP[BlockType.COMBINED], ...virtualExtras },
          ports: [{ id: virtualExtras?.inPortID || virtualPortID, parentNode: virtualNodeID, in: true, virtual: true }],
          parentNode: null,
          combines: [
            {
              ...node,
              extras,
              parentNode: virtualNodeID,
            },
          ],
        };
      }

      rootNodes.push(_node.id);

      registerNode(_node);

      if (_node.combines) {
        _node.combines.forEach((combinedNode) => registerNode(combinedNode, _node.id));
      }
    });

    const links = linkAdapter.mapFromDB(diagram.links);
    const validLinks = links.filter(
      (link) =>
        nodeIDs.includes(link.source.nodeID) &&
        nodeIDs.includes(link.target.nodeID) &&
        portIDs.includes(link.source.portID) &&
        portIDs.includes(link.target.portID)
    );

    return {
      diagramID: diagram.id,
      viewport: {
        x: diagram.offsetX,
        y: diagram.offsetY,
        zoom: diagram.zoom,
      },
      rootNodes,
      nodes,
      links: validLinks,
      ports,
      data,
    };
  },
  ({ id, viewport, platform, rootNodeIDs, nodes, ports, links, data }, { linksByPortID }) => {
    const rootNodes = getAllNormalizedByKeys(nodes, rootNodeIDs);

    return {
      id,
      offsetX: viewport.x,
      offsetY: viewport.y,
      zoom: viewport.zoom,
      links: linkAdapter.mapToDB(links, { nodes }),
      nodes: nodeAdapter.mapToDB(rootNodes, { nodes, ports, data, linksByPortID, platform }).map((node) => {
        if (node.type !== BlockType.COMBINED || node.combines?.length !== 1) {
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
      }),
      blockRedesignOffset: true,
    };
  }
);

export default creatorAdapter;
