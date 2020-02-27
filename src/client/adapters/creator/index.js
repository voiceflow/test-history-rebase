import cuid from 'cuid';

import { BLOCK_REDESIGN_ENABLED } from '@/config/features';
import { BlockType } from '@/constants';

import { createSimpleAdapter } from '../utils';
import { DB_BLOCK_TYPE_FROM_APP } from './block';
import linkAdapter from './link';
import nodeAdapter from './node';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';

const creatorAdapter = createSimpleAdapter(
  (diagram, platform) => {
    const rootNodes = [];
    const nodes = [];
    const ports = [];
    const data = {};
    const links = linkAdapter.mapFromDB(diagram.links);

    const registerNode = (node, parentNode) => {
      const nodeData = nodeDataAdapter.fromDB(node.extras, node);
      nodes.push(nodeAdapter.fromDB(node, nodeData, parentNode));

      node.ports.forEach((port) => ports.push(portAdapter.fromDB(port, nodeData.type, platform)));
      data[node.id] = nodeData;
    };

    diagram.nodes.forEach((node) => {
      let _node = node; // eslint-disable-line no-underscore-dangle

      if (BLOCK_REDESIGN_ENABLED && !_node.parentNode && !_node.combines) {
        const nodeID = cuid();

        _node = {
          x: node.x,
          y: node.y,
          id: nodeID,
          name: node.name || 'Block',
          type: BlockType.COMBINED,
          extras: { type: DB_BLOCK_TYPE_FROM_APP[BlockType.COMBINED] },
          ports: [],
          parentNode: null,
          combines: [
            {
              ...node,
              parentNode: nodeID,
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
    const nodes = diagram.nodes.map((node) => (node.combines?.length === 1 ? { ...node.combines[0], name: node.name, parentNode: null } : node));

    return { ...diagram, nodes };
  }
);

export default creatorAdapter;
