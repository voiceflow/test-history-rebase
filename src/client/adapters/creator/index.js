import { BlockType } from '@/constants';

import { createSimpleAdapter } from '../utils';
import { APP_BLOCK_TYPE_FROM_DB, DB_BLOCK_TYPE_FROM_APP } from './block';
import linkAdapter from './link';
import nodeAdapter from './node';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';

const VIRTUAL_NODE_ID_PREFIX = 'virtualNode';
const VIRTUAL_PORT_ID_PREFIX = 'virtualPort';
const NODE_HEIGHT_DIFFERENCE = 1.2;
const NODE_WIDTH_DIFFERENCE = 2.4;

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
  (diagram, platform, isBlockRedesignEnabled) => {
    const rootNodes = [];
    const nodes = [];
    const ports = [];
    const data = {};
    const links = linkAdapter.mapFromDB(diagram.links, isBlockRedesignEnabled);

    const registerNode = (node, parentNode) => {
      const nodeData = nodeDataAdapter.fromDB(node.extras, node, isBlockRedesignEnabled);
      nodes.push(nodeAdapter.fromDB(node, nodeData, parentNode));

      node.ports.forEach((port) => ports.push(portAdapter.fromDB(port, nodeData.type, platform)));
      data[node.id] = nodeData;
    };

    let diagramNodes = diagram.nodes;

    // apply an offset to space out blocks from the old layout
    if (isBlockRedesignEnabled && !diagram.blockRedesignOffset) {
      const center = findDiagramCenter(diagram.nodes);

      diagramNodes = spreadOutNodes(diagram.nodes, center);
    }

    diagramNodes.forEach((node) => {
      let _node = node; // eslint-disable-line no-underscore-dangle

      const nodeType = APP_BLOCK_TYPE_FROM_DB[node.extras.type] || node.extras.type;

      if (isBlockRedesignEnabled && !ROOT_NODES.includes(nodeType)) {
        // deterministic ID generation to support realtime
        const virtualNodeID = `${VIRTUAL_NODE_ID_PREFIX}--${node.id}`;
        const virtualPortID = `${VIRTUAL_PORT_ID_PREFIX}--${node.id}`;
        const { virtualExtras, ...extras } = node.extras || {};

        _node = {
          x: node.x,
          y: node.y,
          id: virtualNodeID,
          name: virtualExtras?.name || node.name || 'Block',
          extras: { type: DB_BLOCK_TYPE_FROM_APP[BlockType.COMBINED], ...virtualExtras },
          ports: [{ id: virtualPortID, parentNode: virtualNodeID, in: true, virtual: true }],
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

    return {
      diagramID: diagram.id,
      viewport: {
        x: diagram.offsetX,
        y: diagram.offsetY,
        zoom: diagram.zoom,
      },
      rootNodes,
      nodes,
      links,
      ports,
      data,
    };
  },
  (diagram) => {
    const nodes = diagram.nodes.map((node) => {
      if (node.type !== BlockType.COMBINED || node.combines?.length !== 1) {
        return node;
      }

      const childNode = node.combines[0];

      return {
        ...childNode,
        name: childNode.name,
        parentNode: null,
        x: node.x,
        y: node.y,
        extras: {
          ...childNode.extras,
          virtualExtras: {
            ...node.extras,
            name: node.name,
          },
        },
      };
    });

    return { ...diagram, nodes };
  }
);

export default creatorAdapter;
