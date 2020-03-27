import { BlockType } from '@/constants';

import { createSimpleAdapter } from '../utils';
import { DB_BLOCK_TYPE_FROM_APP } from './block';
import linkAdapter from './link';
import nodeAdapter from './node';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';

const VIRTUAL_NODE_ID_PREFIX = 'virtualNode';
const VIRTUAL_PORT_ID_PREFIX = 'virtualPort';

const ROOT_NODES = [BlockType.COMBINED, BlockType.START, BlockType.COMMENT];

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

    diagram.nodes.forEach((node) => {
      let _node = node; // eslint-disable-line no-underscore-dangle

      if (isBlockRedesignEnabled && _node.type && !ROOT_NODES.includes(node.type)) {
        // deterministic ID generation to support realtime
        const virtualNodeID = `${VIRTUAL_NODE_ID_PREFIX}--${node.id}`;
        const virtualPortID = `${VIRTUAL_PORT_ID_PREFIX}--${node.id}`;

        _node = {
          x: node.x,
          y: node.y,
          id: virtualNodeID,
          name: node.name || 'Block',
          type: BlockType.COMBINED,
          extras: { type: DB_BLOCK_TYPE_FROM_APP[BlockType.COMBINED] },
          ports: [{ id: virtualPortID, parentNode: virtualNodeID, in: true, virtual: true }],
          parentNode: null,
          combines: [
            {
              ...node,
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
    const nodes = diagram.nodes.map((node) =>
      node.type === BlockType.COMBINED && node.combines?.length === 1
        ? { ...node.combines[0], name: node.name, parentNode: null, x: node.x, y: node.y }
        : node
    );

    return { ...diagram, nodes };
  }
);

export default creatorAdapter;
